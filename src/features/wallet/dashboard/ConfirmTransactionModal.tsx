import { IoClose } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";

interface ConfirmTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

function ConfirmTransactionModal({
  open,
  onClose,
}: ConfirmTransactionModalProps) {

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  } catch {
    toast.error("Failed to copy");
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-[560px]">
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

        {/* Modal Content */}
        <div
          className="rounded-2xl bg-[#161F37] border border-[#3C3D47] 
          p-6 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]"
        >
          {/* Title */}
          <h3 className="text-[#25C866] font-medium text-xl mb-[15px]">
            Confirm transaction
          </h3>

          {/* Info Rows */}
          <div className="space-y-5">
            {/* Row */}
            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-lg font-medium">Token:</p>
              <p className="text-[#7A7D83] text-lg font-medium">ETH</p>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-lg font-medium">From:</p>

              <div className="flex items-center gap-3 text-[#7A7D83] text-lg">
                51cd....d048
                <FiCopy  onClick={() => handleCopy("51cd....d048")} className="cursor-pointer hover:text-white" />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-lg font-medium">To:</p>

              <div className="flex items-center gap-3 text-[#7A7D83] text-lg">
                0x9F....a0D1
                <FiCopy  onClick={() => handleCopy("0x9F....a0D1")} className="cursor-pointer hover:text-white" />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-lg font-medium">Amount:</p>
              <p className="text-[#7A7D83] text-lg font-medium">
                1.0045 ETH
              </p>
            </div>

            <div className="flex justify-between items-center border-b border-[#3C3D47] pb-5">
              <p className="text-white text-lg font-medium">Total:</p>
              <p className="text-[#7A7D83] text-lg font-medium">
                1.2345 ETH
              </p>
            </div>
          </div>

          {/* Warning Box */}
          <div className="mt-5 border border-[#FACC15]/40 bg-[#FFDD1D05] rounded-[6px] px-[15px] py-3 w-max">
            <p className="text-[#FFDD1D] text-lg font-medium">
              Blockchain transactions cannot be reversed.
            </p>
          </div>

          {/* Confirm Button */}
          <button className="w-full mt-[30px] py-[18px] rounded-xl bg-[#25C866] text-white font-bold hover:opacity-90 transition cursor-pointer text-lg">
            Confirm &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmTransactionModal;
