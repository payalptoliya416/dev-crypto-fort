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
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../../redux/languageSlice";
import i18n from "../../../i18n";
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
  const { t } = useTranslation();
  const language = useSelector((state: RootState) => state.language.value);
  const [exporting, setExporting] = useState<"backup" | "report" | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const downloadFile = async (
    url: string,
    filename: string,
    mimeType?: string,
  ) => {
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "*/*" },
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const finalBlob = mimeType ? new Blob([blob], { type: mimeType }) : blob;

      const blobUrl = URL.createObjectURL(finalBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      toast.error("Download blocked by browser");
    }
  };

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

      const filePath = res?.data?.file_path;

      if (!filePath) {
        toast.error("File not available");
        return;
      }

      toast.success("Downloading...");

      let fileName = filePath.split("/").pop() || "txhash_report";
      if (!fileName.includes(".")) {
        fileName += ".txt";
      }

      await downloadFile(filePath, fileName, "text/plain");
    } catch (err: any) {
      toast.error(err?.message || "Download failed");
    } finally {
      setExporting(null);
    }
  };

  const handleExportTxReport = async (type: "excel" | "pdf") => {
    if (!activeWallet?.id) {
      toast.error("Wallet not found");
      return;
    }

    try {
      setExporting("report");
      toast.loading("Generating export...");

      const res = await exportTransactions({
        wallet_id: activeWallet.id,
        type,
      });

      toast.dismiss();

      const fileUrl = res?.data?.file_url;
      let fileName = res?.data?.file_name;

      if (!fileUrl) {
        toast.error("File not available");
        return;
      }

      toast.success("Downloading...");

      const extension = type === "excel" ? "xlsx" : "pdf";
      if (!fileName) {
        fileName = `transactions.${extension}`;
      } else {
        if (
          type === "excel" &&
          (fileName.endsWith(".excel") || !fileName.includes("."))
        ) {
          fileName = fileName.replace(/\.excel$/, "") + ".xlsx";
        } else if (!fileName.includes(".")) {
          fileName += `.${extension}`;
        }
      }

      const mimeType =
        type === "excel"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "application/pdf";

      await downloadFile(fileUrl, fileName, mimeType);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
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
            Send Token
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
              <label>{t("language")}</label>
            </label>

            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value;
                dispatch(setLanguage(lang));
                i18n.changeLanguage(lang);
              }}
              className="w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-5 py-4 text-base sm:text-lg text-white outline-none cursor-pointer"
            >
              <option className="bg-[#161F37] text-[#7A7D83]">
                Select language
              </option>
              <option className="bg-[#161F37] text-white" value="en">
                French
              </option>
              <option className="bg-[#161F37] text-white" value="fr">
                English
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
                  handleExportTxReport("excel");
                }}
                className="flex-1 rounded-lg border border-[#3C3D47] 
      bg-[#202A43] px-4 py-3 text-white hover:bg-[#2A3556]"
              >
                Export as Excel
              </button>

              {/* PDF */}
              <button
                onClick={() => {
                  setShowExportOptions(false);
                  handleExportTxReport("pdf");
                }}
                className="flex-1 rounded-lg border border-[#3C3D47] 
      bg-[#202A43] px-4 py-3 text-white hover:bg-[#2A3556]"
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
