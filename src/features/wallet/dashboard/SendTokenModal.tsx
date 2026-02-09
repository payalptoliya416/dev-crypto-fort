
import { HiOutlineQrCode } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

interface SendTokenModalProps {
  open: boolean;
  onClose: () => void;
    onNext: () => void; 
}

function SendTokenModal({ open, onClose,onNext }: SendTokenModalProps) {
    if (!open) return null;

  return (
    <>
    <div className="fixed inset-0 z-[999] flex items-center justify-center  overflow-y-auto p-5">
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

        <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]  max-h-[90vh] overflow-y-auto">
          <h3 className="text-[#25C866] font-medium text-lg mb-[15px]">
            Send Token
          </h3>

          {/* <div className="mb-5">
            <label className="text-lg text-[#7A7D83] mb-[10px] block">
              Select Token
            </label>
            <select
              className="w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-5 py-4 text-lg text-white outline-none"
            >
              <option className="bg-[#161F37] text-[#7A7D83]">
                Select token
              </option>

              <option className="bg-[#161F37] text-white">Ethereum</option>

              <option className="bg-[#161F37] text-white">Bitcoin</option>
            </select>
          </div> */}

          <div className="mb-5">
            <label className="text-lg text-[#7A7D83] mb-[10px] block">
              Recipient Address
            </label>

            <div className="flex gap-3 items-center">
              <input
                placeholder="Enter recipient address"
                className="flex-1 bg-transparent border border-[#3C3D47] 
                rounded-xl px-5 py-4 text-lg leading-[18px] placeholder:text-[#3C3D47] text-white outline-none"
              />

              {/* <button
                className="w-[50px] h-[50px] rounded-xl bg-[#202A43] 
                border border-[#3C3D47] flex justify-center items-center text-[#7D7E84]"
              >
                <HiOutlineQrCode size={26} />
              </button> */}
            </div>
          </div>

          <div>
            <label className="text-lg text-[#7A7D83] mb-[10px] block">
              Amount
            </label>
            <input
              placeholder="Amount"
              className="w-full bg-transparent border border-[#3C3D47] 
              rounded-xl px-5 py-4 text-lg leading-[18px] placeholder:text-[#3C3D47] text-white outline-none"
            />
          </div>

          <div className="mt-[25px] space-y-5 text-sm">
            <div className="flex justify-between text-white text-lg font-medium">
              <p>Gas Fees</p>
              <p>1.0045 ETH</p>
            </div>

            <div className="flex justify-between text-white text-lg font-medium">
              <p>Total Cost</p>
              <p>1.2345 ETH</p>
            </div>
          </div>

          <button  onClick={onNext}
            className="w-full mt-[30px] py-[18px] rounded-xl bg-[#25C866] text-white font-bold hover:opacity-90 transition cursor-pointer text-lg">
            Send Token
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default SendTokenModal;
