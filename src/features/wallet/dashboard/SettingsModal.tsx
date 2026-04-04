import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import {
  checkUserPassword,
  downloadWalletBackup,
  getMe,
  getTransactions,
} from "../../../api/walletApi";
import { useEffect, useState } from "react";
import { setCurrency } from "../../../redux/currencySlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import ToggleSwitch from "../../../hooks/ToggleSwitch";
import { disable2FA } from "../../../api/login";
import TwoFactorModal from "./TwoFactorModal";
interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.currency.value);
  const [exporting, setExporting] = useState<"backup" | "report" | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en",
  );
  const [translating, setTranslating] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf" | null>(
    null,
  );
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  const fetch2FAStatus = async () => {
    try {
      setLoading2FA(true);

      const res = await getMe();

      if (res.success) {
        setTwoFactorEnabled(res.data.is_2fa_enabled);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch 2FA status");
    } finally {
      setLoading2FA(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetch2FAStatus();
    }
  }, [open]);

  const handleExportTxHash = async () => {
    if (!activeWallet?.id) {
      toast.error("Wallet not found");
      return;
    }

    try {
      setExporting("backup");

      const res = await downloadWalletBackup({
        wallet_id: activeWallet.id,
      });

      const privateKey = res?.data?.private_key;
      const recoveryPhrase = res?.data?.recovery_phrase;

      if (!privateKey || !recoveryPhrase) {
        toast.error("Backup data not available");
        return;
      }

      // 👉 store data
      setBackupData({
        privateKey,
        recoveryPhrase,
      });

      // 👉 open modal
      setShowBackupModal(true);
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setExporting(null);
    }
  };

  const handleExportTxReport = async (
    format: "excel" | "pdf",
    exportType: "all" | "eth" | "btc" | "usdt" = "all",
  ) => {
    if (!activeWallet?.id) {
      toast.error("Wallet not found");
      return;
    }

    try {
      setExporting("report");
      toast.loading("Generating export...");

      const res = await getTransactions({
        wallet_id: activeWallet.id,
        type: exportType,
      });
      toast.dismiss();

      if (!res.success || !res.data?.length) {
        toast.error("No transactions found");
        return;
      }

      const transactions = res.data;

      const formattedData = transactions.map((tx) => ({
        Date: new Date(tx.timestamp || Date.now()).toLocaleString(),
        Type: tx.transaction_type,
        Currency: tx.currency?.toUpperCase() || "ETH",
        Amount: Number(tx.amount).toFixed(6),
        Status: tx.txreceipt_status,
        Hash: tx.hash,
        From: tx.from_address,
        To: tx.to_address,
      }));

      /* ================= EXCEL ================= */

      if (format === "excel") {
        const wsData = [
          ["Transaction History Report"],
          [],
          [`ETH Address:`, activeWallet.eth_address],
          [`BTC Address:`, (activeWallet as any).btc_address || "N/A"],
          [],
          [
            "Date",
            "Type",
            "Currency",
            "Amount",
            "Status",
            "Hash",
            "From",
            "To",
          ],
          ...formattedData.map((tx) => [
            tx.Date,
            tx.Type,
            tx.Currency,
            tx.Amount,
            tx.Status,
            tx.Hash,
            tx.From,
            tx.To,
          ]),
        ];

        const sheet = XLSX.utils.aoa_to_sheet(wsData);

        sheet["!cols"] = [
          { wch: 22 }, // Date
          { wch: 45 }, // Type / Values
          { wch: 10 }, // Currency
          { wch: 15 }, // Amount
          { wch: 12 }, // Status
          { wch: 68 }, // Hash
          { wch: 45 }, // From
          { wch: 45 }, // To
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, "Transactions");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `transactions_${activeWallet.eth_address}.xlsx`);
        toast.success("Excel downloaded");
      }
      /* ================= PDF ================= */

      if (format === "pdf") {
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        doc.setFontSize(22);
        doc.setTextColor(37, 200, 102); // #25C866 color
        doc.text("Transaction History Report", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Wallet ID: ${activeWallet.id}`, 14, 30);
        doc.text(`ETH Address: ${activeWallet.eth_address}`, 14, 36);
        doc.text(
          `BTC Address: ${(activeWallet as any).btc_address || "N/A"}`,
          14,
          42,
        );

        autoTable(doc, {
          startY: 50,

          head: [
            [
              "Date",
              "Type",
              "Currency",
              "Amount",
              "Status",
              "Hash",
              "From",
              "To",
            ],
          ],

          body: formattedData.map((tx) => [
            tx.Date,
            tx.Type,
            tx.Currency,
            tx.Amount,
            tx.Status,
            tx.Hash,
            tx.From,
            tx.To,
          ]),

          styles: {
            fontSize: 7,
            cellPadding: 3,
            overflow: "linebreak",
            valign: "middle",
          },

          headStyles: {
            fillColor: [37, 200, 102], // Match #25C866
            textColor: 255,
            fontStyle: "bold",
            halign: "center",
          },

          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 15, halign: "center" },
            2: { cellWidth: 15, halign: "center" },
            3: { cellWidth: 20, halign: "right" },
            4: { cellWidth: 15, halign: "center" },
            5: { cellWidth: 60 }, // Hash wider
            6: { cellWidth: 60 }, // From wider
            7: { cellWidth: 60 }, // To wider
          },

          alternateRowStyles: {
            fillColor: [248, 249, 250],
          },

          didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            const str = `Page ${doc.getNumberOfPages()} - Crypto Fort Wallet`;
            doc.text(
              str,
              data.settings.margin.left,
              doc.internal.pageSize.height - 10,
            );
          },
        });

        doc.save(`transactions_${activeWallet.eth_address}.pdf`);
        toast.success("PDF downloaded");
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Export failed");
    } finally {
      setExporting(null);
    }
  };

  const waitForGoogle = () => {
    return new Promise<HTMLSelectElement>((resolve) => {
      const check = () => {
        const select = document.querySelector(
          ".goog-te-combo",
        ) as HTMLSelectElement | null;

        if (select) {
          resolve(select);
        } else {
          setTimeout(check, 200);
        }
      };
      check();
    });
  };

  const changeLanguage = async (lang: string) => {
    setTranslating(true);
    setLanguage(lang);
    localStorage.setItem("lang", lang);

    try {
      const select = await waitForGoogle();

      select.value = lang;
      select.dispatchEvent(new Event("change", { bubbles: true }));

      setTimeout(() => {
        setTranslating(false);
      }, 1200);
    } catch {
      setTranslating(false);
    }
  };

  const handleToggle = async (value: boolean) => {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    try {
      setLoading(true);
      if (value) {
        setShow2FAModal(true);
        return;
      }
      if (!value) {
        const res = await disable2FA({ user_id: userId });

        if (!res.success) {
          toast.error(res.message || "Failed to disable 2FA");
          return;
        }

        toast.success(res.message || "2FA Disabled successfully");
        setTwoFactorEnabled(false);
      } else {
        toast.success("2FA Enabled (UI only)");
        setTwoFactorEnabled(true);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");

      setTwoFactorEnabled((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />
      {translating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-[#161F37] px-6 py-4 rounded-xl text-white animate-pulse">
            Changing language...
          </div>
        </div>
      )}

      <TwoFactorModal
        open={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        onSuccess={() => setTwoFactorEnabled(true)}
      />

      <div className="relative w-full max-w-[760px]">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full 
            bg-[#202A43] text-white border border-[#3C3D47] mb-[10px]
            shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto">
          <h3 className="text-[#25C866] font-medium text-lg mb-[15px]">
            Settings
          </h3>
          <div className="mb-3">
            <label className="text-base sm:text-lg text-[#7A7D83] block mb-3">
              Two-Factor Authentication
            </label>
            <ToggleSwitch
              checked={twoFactorEnabled}
              onChange={handleToggle}
              disabled={loading || loading2FA}
              loading={loading || loading2FA}
            />
          </div>

          <div className="mb-[30px]">
            <label className="text-base sm:text-lg text-[#7A7D83] block mb-3">
              Currency
            </label>

            <select
              value={currency}
              onChange={(e) => dispatch(setCurrency(e.target.value))}
              className="w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-6 py-4 text-base sm:text-lg text-white outline-none cursor-pointer"
            >
              <option className="bg-[#161F37] text-[#7A7D83]">
                Select currency
              </option>
              <option className="bg-[#161F37] text-white">USD</option>
              <option className="bg-[#161F37] text-white">EUR</option>
              <option className="bg-[#161F37] text-white">GBP</option>
              <option className="bg-[#161F37] text-white">AED</option>
              <option className="bg-[#161F37] text-white">AUD</option>
              <option className="bg-[#161F37] text-white">CAD</option>
              <option className="bg-[#161F37] text-white">NOK</option>
              <option className="bg-[#161F37] text-white">NZD</option>
              <option className="bg-[#161F37] text-white">CHF</option>
              <option className="bg-[#161F37] text-white">BTC</option>
            </select>
          </div>

          <div className="mb-10">
            <label className="text-base sm:text-lg text-[#7A7D83] block mb-3">
              <label>Language</label>
            </label>

            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-5 py-4 text-base sm:text-lg text-white outline-none cursor-pointer"
            >
              <option className="bg-[#161F37] text-white" value="en">
                English
              </option>
              <option className="bg-[#161F37] text-white" value="sv">
                Swedish
              </option>
              <option className="bg-[#161F37] text-white" value="nl">
                Dutch
              </option>
              <option className="bg-[#161F37] text-white" value="fi">
                Finish
              </option>
              <option className="bg-[#161F37] text-white" value="de">
                German
              </option>
            </select>
          </div>

          <h3 className="text-white text-lg sm:text-xl font-medium mb-[15px]">
            Backup & Export
          </h3>

          <div
            onClick={exporting ? undefined : handleExportTxHash}
            className={`relative w-full border border-[#3C3D47] rounded-xl p-3 sm:p-5 mb-[15px]
          bg-[#202A43]/40 transition
          ${exporting ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-[#202A43]/70"}`}
          >
            {exporting === "backup" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#161F37]/70 rounded-xl">
                <span className="text-white text-sm animate-pulse">
                  Exporting…
                </span>
              </div>
            )}

            <p className="text-[#7A7D83] text-base sm:text-lg font-medium">
              Backup Recovery Phrase
            </p>
            <p className="text-[#434548] text-sm mt-2">
              View and write down your 12-word recovery phrase
            </p>
          </div>

          <div
            onClick={exporting ? undefined : () => setShowExportOptions(true)}
            className={`relative w-full border border-[#3C3D47] rounded-xl p-3 sm:p-5
            bg-[#202A43]/40 transition
            ${exporting ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-[#202A43]/70"}`}
          >
            {exporting === "report" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#161F37]/70 rounded-xl">
                <span className="text-white text-sm animate-pulse">
                  Generating report…
                </span>
              </div>
            )}

            <p className="text-[#7A7D83] text-base sm:text-lg font-medium">
              Export TxHash Report
            </p>
            <p className="text-[#434548] text-sm mt-2">
              Download your transaction history report
            </p>
          </div>
          {showExportOptions && (
            <div className="mt-3 flex gap-3">
              {/* Excel */}
              <button
                // onClick={() => {
                //   setShowExportOptions(false);
                //   handleExportTxReport("excel", "all");
                // }}
                onClick={() => {
                  setExportFormat("excel");
                  setShowPasswordModal(true);
                }}
                className="flex-1 rounded-lg border border-[#3C3D47] 
      bg-[#202A43] px-4 py-3 text-white hover:bg-[#2A3556]  cursor-pointer"
              >
                Export as Excel
              </button>

              {/* PDF */}
              <button
                // onClick={() => {
                //   setShowExportOptions(false);
                //   handleExportTxReport("pdf", "all");
                // }}
                onClick={() => {
                  setExportFormat("pdf");
                  setShowPasswordModal(true);
                }}
                className="flex-1 rounded-lg border border-[#3C3D47] 
      bg-[#202A43] px-4 py-3 text-white hover:bg-[#2A3556] cursor-pointer"
              >
                Export as PDF
              </button>
            </div>
          )}
        </div>
        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999]">
            <div className="bg-[#161F37] p-6 rounded-2xl w-[350px] relative mx-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-2 right-3 text-white text-xl cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-white my-4">Enter Your Password</h3>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 rounded-lg bg-[#0F172A] text-white focus:outline-none"
                  placeholder="Enter password"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className=" absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </span>
              </div>

              <button
                onClick={async () => {
                  if (!password) {
                    toast.error("Enter password");
                    return;
                  }

                  if (!userId) {
                    toast.error("User not found. Please log in again.");
                    return;
                  }

                  try {
                    setCheckingPassword(true);
                    const res = await checkUserPassword({
                      user_id: userId,
                      password: password,
                    });

                    if (!res.success) {
                      const apiError =
                        (res as any)?.errors?.user_id?.[0] ||
                        (res as any)?.message ||
                        "Something went wrong";

                      toast.error(apiError);
                      return;
                    }

                    if (!res.match) {
                      toast.error("Incorrect password");
                      return;
                    }

                    setShowPasswordModal(false);
                    setShowExportOptions(false);

                    if (exportFormat) {
                      handleExportTxReport(exportFormat, "all");
                    }

                    setPassword("");
                  } catch (err: any) {
                    const apiError =
                      err?.message ||
                      err?.data?.message ||
                      err?.errors?.user_id?.[0] ||
                      (err?.errors &&
                        Object.values(err.errors).flat().filter(Boolean)[0]) ||
                      "Password check failed";

                    toast.error(apiError);

                    const expiredMsg = (apiError as string).toLowerCase();
                    if (
                      expiredMsg.includes("expired") ||
                      expiredMsg.includes("session")
                    ) {
                      localStorage.removeItem("token");
                      localStorage.removeItem("token_expiry");
                      localStorage.removeItem("user_id");
                      window.location.href = "/login";
                    }
                  } finally {
                    setCheckingPassword(false);
                    setPassword("");
                  }
                }}
                disabled={checkingPassword}
                className={`w-full py-2 rounded-lg text-white transition mt-4
                    ${
                      checkingPassword
                        ? "bg-green-400 cursor-not-allowed opacity-70"
                        : "bg-[#25C866] hover:bg-green-500 cursor-pointer"
                    }`}
              >
                {checkingPassword ? "Checking..." : "Confirm"}
              </button>
            </div>
          </div>
        )}

        {showBackupModal && backupData && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowBackupModal(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#161F37] border border-[#3C3D47] rounded-2xl p-6 z-10">
              {/* Close */}
              <button
                onClick={() => setShowBackupModal(false)}
                className="absolute top-3 right-3 text-white text-xl cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-lg font-semibold text-[#25C866] mb-6 flex items-center gap-2">
                Backup Wallet
              </h3>

              {/* Private Key */}
              <div className="mb-6">
                <p className="text-sm text-[#A1A1AA] mb-2">Private Key</p>

                <div className="bg-[#0F172A] border border-[#2E3A5C] rounded-lg p-3 text-xs font-mono break-all text-white">
                  {backupData.privateKey}
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(backupData.privateKey);
                      toast.success("Private key copied");
                    }}
                    className="px-3 py-1.5 text-xs bg-[#25C866] text-white rounded-md hover:opacity-90 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Recovery Phrase */}
              <div className="mb-4">
                <p className="text-sm text-[#A1A1AA] mb-2">Recovery Phrase</p>

                <div className="bg-[#0F172A] border border-[#2E3A5C] rounded-lg p-3 text-sm leading-6 text-white">
                  {backupData.recoveryPhrase}
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(backupData.recoveryPhrase);
                      toast.success("Recovery phrase copied");
                    }}
                    className="px-3 py-1.5 text-xs bg-[#25C866] text-white rounded-md hover:opacity-90  cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsModal;
