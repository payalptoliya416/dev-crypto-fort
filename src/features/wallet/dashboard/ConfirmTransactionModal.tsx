import { IoClose } from "react-icons/io5";
import { TbCopy } from "react-icons/tb";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import { sendTransaction } from "../../../api/transactionApi";
import { formatBalance } from "../../component/format";

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
  const { toAddress, amount, totalCost, selectedToken } = useSelector(
    (state: RootState) => state.transaction,
  );

  useEffect(() => {
  if (open) {
    setLoading(false);
  }
}, [open]);

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

 const getFromAddress = (): string => {
  if (!activeWallet) return "";

  switch (selectedToken?.toLowerCase()) {
    case "eth":
    case "usdt":
    case "bnb":
      return activeWallet.eth_address || "";

    case "trc20":
      return activeWallet.tron_address || "";

    case "btc":
      return activeWallet.btc_address || "";

    default:
      return activeWallet.eth_address || "";
  }
};

  const handleConfirmSend = async () => {
    if (loading) return;

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
        type: selectedToken as any, 
      });

    if (res.success) {
  toast.success(res.message || "Transaction sent");
  onClose();
} else {
  let errorMsg = "Transaction failed";

  // ✅ Laravel validation errors
 if ((res as any)?.errors) {
  const errorsObj = (res as any).errors;

  const firstKey = Object.keys(errorsObj)[0];
  if (firstKey && errorsObj[firstKey]?.length > 0) {
    errorMsg = errorsObj[firstKey][0];
  }
}
  // ✅ direct message
  else if (res?.message) {
    errorMsg = res.message;
  }

  toast.error(errorMsg);
  setLoading(false);
}
    } catch (error: any) {
  let errorMsg = "Something went wrong";

  // ✅ CASE 1: direct error.errors (YOUR CASE)
  if (error?.errors) {
    const firstKey = Object.keys(error.errors)[0];
    if (error.errors[firstKey]?.length > 0) {
      errorMsg = error.errors[firstKey][0];
    }
  }

  // ✅ CASE 2: axios error.response.data.errors
  else if (error?.response?.data?.errors) {
    const firstKey = Object.keys(error.response.data.errors)[0];
    if (error.response.data.errors[firstKey]?.length > 0) {
      errorMsg = error.response.data.errors[firstKey][0];
    }
  }

  // ✅ CASE 3: message fallback
  else if (error?.response?.data?.message) {
    errorMsg = error.response.data.message;
  }
  else if (error?.message) {
    errorMsg = error.message;
  }

  toast.error(errorMsg);
}
 setLoading(false);
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
              <p className="text-[#7A7D83] text-base sm:text-lg font-medium">{selectedToken ? selectedToken.toUpperCase() : "ETH"}</p>
            </div>

            {/* From (static wallet for now) */}
            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">From:</p>

              <div className="flex items-center gap-3 text-[#7A7D83] text-base sm:text-lg">
                {shortenAddress(getFromAddress())}
                <TbCopy
                  onClick={() => handleCopy(getFromAddress())}
                  className="cursor-pointer hover:text-white"
                />
              </div>
            </div>

            {/* To */}
            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">To:</p>
              <div className="flex items-center gap-3 text-[#7A7D83] text-base sm:text-lg">
                {shortenAddress(toAddress)}
                <TbCopy
                  onClick={() => handleCopy(toAddress)}
                  className="cursor-pointer hover:text-white"
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">Amount:</p>
              <p className="text-[#7A7D83] text-base sm:text-lg font-medium">
                {amount ? `${formatBalance(amount)} ${selectedToken ? selectedToken.toUpperCase() : "ETH"}` : `0.00 ${selectedToken ? selectedToken.toUpperCase() : "ETH"}`}
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-base sm:text-lg font-medium">Total:</p>
              <p className="text-[#7A7D83] text-base sm:text-lg font-medium">
                {totalCost ? `${formatBalance(totalCost)} ${selectedToken ? selectedToken.toUpperCase() : "ETH"}` : `0.00 ${selectedToken ? selectedToken.toUpperCase() : "ETH"}`}
              </p>
            </div>
          </div>
          <div className="mt-5 border border-[#FACC15]/40 bg-[#FFDD1D05] rounded-[6px] px-[15px] py-3  w-full sm:w-max">
            <p className="text-[#FFDD1D] text-base sm:text-lg font-medium">
              Blockchain transactions cannot be reversed.
            </p>
          </div>
          <button
          type="button"
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
