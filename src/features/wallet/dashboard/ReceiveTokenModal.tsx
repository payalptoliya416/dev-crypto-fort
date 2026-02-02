import { IoClose } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import scanner from "@/assets/scanner.png";
import QRCode from "react-qr-code";

interface ReceiveTokenModalProps {
  open: boolean;
  onClose: () => void;
}

function ReceiveTokenModal({ open, onClose }: ReceiveTokenModalProps) {
  if (!open) return null;

  const address = "51cdd0b050d998c1bfb3af19fb5ffd048";

  // ✅ Copy Address Function
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!", { icon: "✅" });
    } catch {
      toast.error("Failed to copy!", { icon: "❌" });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto p-5">
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

        <div
          className="rounded-2xl bg-[#161F37] border border-[#3C3D47] 
          p-6 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]  max-h-[90vh] overflow-y-auto"
        >
          <h3 className="text-[#25C866] font-medium text-lg mb-[15px]">
            Receive
          </h3>

          <div className="mb-6">
            <label className="text-lg text-[#7A7D83] mb-[10px] block">
              Select Token
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

          <div className="flex justify-center mb-[30px]">
             <div className="border border-[#3C3D47] rounded-xl bg-[#202A43] p-[26px]">
                <QRCode value={scanner} bgColor="#202A43" fgColor="#ffffff" size={220} />
             </div>
          </div>

          <div className="flex items-center justify-between mb-[15px]">
            <p className="text-white text-lg font-medium">Your Address:</p>
            <div className="flex justify-center items-center gap-2">
            <p className="text-[#7A7D83] text-sm truncate flex-1">
              {address}
            </p>

            <FiCopy
              onClick={handleCopy}
              className="cursor-pointer text-[#7A7D83] hover:text-white"
            />

            </div>
          </div>

          <div className="border border-[#FFDD1D1A] bg-[#FFDD1D05] rounded-[6px] px-[15px] py-3 w-max">
            <p className="text-[#FFDD1D] text-lg font-medium">
              Only send ETH / ERC-20 tokens to this address.
            </p>
          </div>
          <button
            className="w-full mt-[30px] py-[18px] rounded-xl bg-[#25C866] 
            text-white font-bold hover:opacity-90 transition cursor-pointer text-lg"
          >
            Confirm &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiveTokenModal;
