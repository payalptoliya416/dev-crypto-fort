import { FaCheck } from "react-icons/fa";

type CommonSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
};

function CommonSuccessModal({
  open,
  onClose,
  title,
  description,
  buttonText = "Continue",
  onButtonClick,
}: CommonSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10 w-[90%] max-w-116.5
          rounded-[14px]
          bg-[#161F37]
          border border-[#3C3D47]
          px-10.5 py-12.5
          text-center
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-25.5 h-25.5 rounded-full bg-[#89E47F0D]
            flex items-center justify-center">
            <div className="w-16.75 h-16.75 rounded-full bg-[#25C866]
              flex items-center justify-center">
              <FaCheck className="text-white text-3xl" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-[28px] font-bold mb-3.75">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#7A7D83] text-lg mb-8.75">
          {description}
        </p>

        {/* Button */}
        <button
          className="w-full bg-[#25C866] text-white
          py-3.5 sm:py-4.5 cursor-pointer
          rounded-xl font-semibold"
          onClick={() => {
            onButtonClick?.();
            onClose();
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default CommonSuccessModal;
