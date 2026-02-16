import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import {
  downloadWalletBackup,
  exportTransactions,
} from "../../../api/walletApi";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const [exporting, setExporting] = useState<"backup" | "report" | null>(null);

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

      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop() || "txhash_report";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      const fileName = res?.data?.file_name;

      if (!fileUrl) {
        toast.error("File not available");
        return;
      }

      toast.success("Downloading...");

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || `transactions.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto p-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />

      {/* Modal Box */}
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
            <label className="text-lg text-[#7A7D83] block mb-3">
              Currency
            </label>

            <select
              className="w-full bg-[#161F37] border border-[#3C3D47]
  rounded-xl px-6 py-4 text-lg text-white outline-none"
            >
              <option className="bg-[#161F37] text-[#7A7D83]">
                Select currency
              </option>
              <option className="bg-[#161F37] text-white">USD</option>
              <option className="bg-[#161F37] text-white">INR</option>
              <option className="bg-[#161F37] text-white">EUR</option>
            </select>
          </div>

          <div className="mb-10">
            <label className="text-lg text-[#7A7D83] block mb-3">
              Language
            </label>

            <select
              className="w-full bg-[#161F37] border border-[#3C3D47]
  rounded-xl px-5 py-4 text-lg text-white outline-none"
            >
              <option className="bg-[#161F37] text-[#7A7D83]">
                Select token
              </option>
              <option className="bg-[#161F37] text-white">Ethereum</option>
              <option className="bg-[#161F37] text-white">Bitcoin</option>
            </select>
          </div>

          <h3 className="text-white text-xl font-medium mb-[15px]">
            Backup & Export
          </h3>

          <div
            onClick={exporting ? undefined : handleExportTxHash}
            className={`relative w-full border border-[#3C3D47] rounded-xl p-5 mb-[15px]
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

            <p className="text-[#7A7D83] text-lg font-medium">
              Backup Recovery Phrase
            </p>
            <p className="text-[#434548] text-sm mt-2">
              View and write down your 12-word recovery phrase
            </p>
          </div>

          <div
            onClick={
              exporting ? undefined : () => handleExportTxReport("excel")
            }
            className={`relative w-full border border-[#3C3D47] rounded-xl p-5
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

            <p className="text-[#7A7D83] text-lg font-medium">
              Export TxHash Report
            </p>
            <p className="text-[#434548] text-sm mt-2">
              Download your transaction history report
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
