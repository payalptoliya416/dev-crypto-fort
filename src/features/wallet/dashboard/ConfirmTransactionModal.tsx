import { IoClose } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useState } from "react";
import { sendTransaction } from "../../../api/transactionApi";

function shortenAddress(address: string) {
  if (!address) return "--";
  return `${address.slice(0, 6)}....${address.slice(-4)}`;
}

interface ConfirmTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

function ConfirmTransactionModal({
  open,
  onClose,
}: ConfirmTransactionModalProps) {
  // gasFee
  const { toAddress, amount, totalCost } = useSelector(
    (state: RootState) => state.transaction,
  );
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const [loading, setLoading] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleConfirmSend = async () => {
    if (!activeWallet?.id) {
      toast.error("Wallet not found");
      return;
    }

    try {
      setLoading(true);

      const res = await sendTransaction({
        wallet_id: activeWallet.id,
        to_address: toAddress,
        amount: amount,
      });

      if (res.success) {
        toast.success(res.message || "Transaction sent");
        onClose();
      } else {
        const errorMsg =
          (res as any)?.error ||
          (res as any)?.data?.error ||
          res.message ||
          "Transaction failed";

        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[560px]">
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

        <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-4 sm:p-6 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto">
          <h3 className="text-[#25C866] font-medium text-xl mb-[15px]">
            Confirm transaction
          </h3>
          <div className="space-y-5">
            {/* Token */}
            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">Token:</p>
              <p className="text-[#7A7D83] text-base sm:text-lg font-medium">ETH</p>
            </div>

            {/* From (static wallet for now) */}
            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">From:</p>

              <div className="flex items-center gap-3 text-[#7A7D83] text-base sm:text-lg">
                {shortenAddress(activeWallet?.address || "")}
                <FiCopy
                  onClick={() => handleCopy(activeWallet?.address || "")}
                  className="cursor-pointer hover:text-white"
                />
              </div>
            </div>

            {/* To */}
            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">To:</p>
              <div className="flex items-center gap-3 text-[#7A7D83] text-base sm:text-lg">
                {shortenAddress(toAddress)}
                <FiCopy
                  onClick={() => handleCopy(toAddress)}
                  className="cursor-pointer hover:text-white"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">Amount:</p>
              <p className="text-[#7A7D83] text-base sm:text-lg font-medium">
                {amount || "0"} ETH
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">Total:</p>
              <p className="text-[#7A7D83] text-base sm:text-lg font-medium">
                {totalCost || "0"} ETH
              </p>
            </div>
          </div>
          <div className="mt-5 border border-[#FACC15]/40 bg-[#FFDD1D05] rounded-[6px] px-[15px] py-3  w-full sm:w-max">
            <p className="text-[#FFDD1D] text-base sm:text-lg font-medium">
              Blockchain transactions cannot be reversed.
            </p>
          </div>
          <button
            onClick={handleConfirmSend}
            disabled={loading}
            className="w-full mt-[30px] py-3 sm:py-[18px] rounded-xl bg-[#25C866] text-white font-bold hover:opacity-90 transition cursor-pointer text-base sm:text-lg disabled:opacity-70"
          >
            {loading ? "Sending..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmTransactionModal;
