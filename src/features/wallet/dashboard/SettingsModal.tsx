import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import {
  downloadWalletBackup,
  exportTransactions,
} from "../../../api/walletApi";
import { useState } from "react";
import { setCurrency } from "../../../redux/currencySlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.currency.value);
  const [exporting, setExporting] = useState<"backup" | "report" | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en",
  );
  const [translating, setTranslating] = useState(false);

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

      if (!res?.data?.file_content) {
        toast.error("Backup data not available");
        return;
      }

      toast.success("Downloading...");

      const fileContent = res.data.file_content;
      const fileName = res.data.suggested_filename || "backup-wallet.txt";

      const blob = new Blob([fileContent], {
        type: "text/plain;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err?.message || "Download failed");
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

      const res = await exportTransactions({
        wallet_id: activeWallet.id,
        format,
        type: exportType,
      });

      toast.dismiss();

      if (!res.success || !res.data?.transactions?.length) {
        toast.error("No transactions found");
        return;
      }

      const { wallet, transactions } = res.data;

      const formattedData = transactions.map((tx) => ({
        Currency: tx.currency,
        Hash: tx.hash,
        From: tx.from_address,
        To: tx.to_address,
        Amount: Number(tx.amount),
        GasFee: Number(tx.gas_price) * Number(tx.gas_used),
        Type: tx.transaction_type,
        Date: new Date(tx.timestamp).toLocaleString(),
      }));

      /* ================= EXCEL ================= */

      if (format === "excel") {
        /* ================= WALLET SHEET ================= */

        const walletSheet = XLSX.utils.json_to_sheet([
          {
            WalletID: wallet.id,
            ETH_Address: wallet.address,
            BTC_Address: wallet.btc_address,
          },
        ]);

        /* ================= TRANSACTION SHEET ================= */

        const transactionSheet = XLSX.utils.json_to_sheet(formattedData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, walletSheet, "Wallet Info");
        XLSX.utils.book_append_sheet(
          workbook,
          transactionSheet,
          "Transactions",
        );

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `transactions_${wallet.address}.xlsx`);
        toast.success("Excel downloaded");
      }
      /* ================= PDF ================= */

      if (format === "pdf") {
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        doc.setFontSize(14);
        doc.text("Transaction Report", 14, 12);

        doc.setFontSize(9);
        doc.text(`Wallet ID: ${wallet.id}`, 14, 18);
        doc.text(`ETH Address: ${wallet.address}`, 14, 23);
        doc.text(`BTC Address: ${wallet.btc_address}`, 14, 28);

        autoTable(doc, {
          startY: 24,

          head: [
            [
              "Currency",
              "Hash",
              "From",
              "To",
              "Amount",
              "Gas Fee",
              "Type",
              "Date",
            ],
          ],

          body: transactions.map((tx) => [
            tx.currency,
            tx.hash, // 👈 FULL hash
            tx.from_address, // 👈 FULL address
            tx.to_address,
            Number(tx.amount).toFixed(6),
            (Number(tx.gas_price) * Number(tx.gas_used)).toFixed(6),
            tx.transaction_type,
            new Date(tx.timestamp).toLocaleString(),
          ]),

          styles: {
            fontSize: 7,
            cellPadding: 2,
            overflow: "linebreak", // 👈 wrap text instead of cut
            valign: "middle",
          },

          headStyles: {
            fillColor: [52, 152, 219],
            textColor: 255,
            fontStyle: "bold",
            halign: "center",
          },

          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 45 }, // Hash wider
            2: { cellWidth: 45 }, // From wider
            3: { cellWidth: 45 }, // To wider
            4: { cellWidth: 20 },
            5: { cellWidth: 25 },
            6: { cellWidth: 20 },
            7: { cellWidth: 30 },
          },

          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },

          didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.text(
              `Page ${doc.getNumberOfPages()}`,
              data.settings.margin.left,
              doc.internal.pageSize.height - 5,
            );
          },
        });

        doc.save(`transactions_${wallet.address}.pdf`);
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
              <option className="bg-[#161F37] text-white" value="fr">
                French
              </option>
              <option className="bg-[#161F37] text-white" value="fi">
                Finnish
              </option>
              <option className="bg-[#161F37] text-white" value="de">
                German
              </option>
              <option className="bg-[#161F37] text-white" value="ar">
                Arabic
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
                onClick={() => {
                  setShowExportOptions(false);
                  handleExportTxReport("excel", "all");
                }}
                className="flex-1 rounded-lg border border-[#3C3D47] 
      bg-[#202A43] px-4 py-3 text-white hover:bg-[#2A3556]  cursor-pointer"
              >
                Export as Excel
              </button>

              {/* PDF */}
              <button
                onClick={() => {
                  setShowExportOptions(false);
                  handleExportTxReport("pdf", "all");
                }}
                className="flex-1 rounded-lg border border-[#3C3D47] 
      bg-[#202A43] px-4 py-3 text-white hover:bg-[#2A3556] cursor-pointer"
              >
                Export as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
