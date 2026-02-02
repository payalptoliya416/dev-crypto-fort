import { IoClose } from "react-icons/io5";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto p-5">
      {/* Overlay */}
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

        {/* Modal Content */}
         <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto">
          {/* Title */}
          <h3 className="text-[#25C866] font-medium text-lg mb-[15px]">
            Send Token
          </h3>

          {/* Currency */}
         <div className="mb-[30px]">
            <label className="text-lg text-[#7A7D83] block mb-3">
              Currency
            </label>

            <select
              className="w-full bg-transparent border border-[#3C3D47]
              rounded-xl px-6 py-4 text-lg text-[#7A7D83] outline-none"
            >
              <option>Select currency</option>
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>
          </div>

          {/* Language */}
          <div className="mb-10">
            <label className="text-lg text-[#7A7D83] block mb-3">
              Language
            </label>

            <select
              className="w-full bg-transparent border border-[#3C3D47]
              rounded-xl px-6 py-4 text-lg text-[#7A7D83] outline-none"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
            </select>
          </div>

          {/* Backup & Export */}
          <h3 className="text-white text-xl font-medium mb-[15px]">
            Backup & Export
          </h3>

          <div
            className="w-full border border-[#3C3D47] rounded-xl 
            p-5 mb-[15px] bg-[#202A43]/40 cursor-pointer hover:bg-[#202A43]/70 transition"
          >
            <p className="text-[#7A7D83] text-lg font-medium">
              Backup Recovery Phrase
            </p>
            <p className="text-[#434548] text-sm mt-2">
              View and write down your 12/24-word recovery phrase
            </p>
          </div>

          {/* Export TxHash Report */}
          <div
            className="w-full border border-[#3C3D47] rounded-xl 
            p-5 bg-[#202A43]/40 cursor-pointer hover:bg-[#202A43]/70 transition"
          >
            <p className="text-[#7A7D83] text-lg font-medium">
              Export TxHash Report
            </p>
            <p className="text-[#434548] text-sm mt-2">
              Download your transition history report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
