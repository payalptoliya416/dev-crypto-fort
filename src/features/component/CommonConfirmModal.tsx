import { FaExclamationTriangle } from "react-icons/fa";

type CommonConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

function CommonConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Yes, Reset",
  cancelText = "Cancel",
}: CommonConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10 w-[90%] max-w-116.5
          rounded-[14px]
          bg-[#161F37]
          border border-[#3C3D47]
          px-5 md:px-10.5 py-5 md:py-12.5
          text-center
        "
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-17 md:w-25.5 h-17 md:h-25.5 rounded-full bg-[#EF43431A]
            flex items-center justify-center">
            <div className="w-10 md:w-16.75 h-10 md:h-16.75 rounded-full bg-[#ef4343]
              flex items-center justify-center">
              <FaExclamationTriangle className="text-white text-xl md:text-3xl" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-xl md:text-[28px] font-bold mb-3.75 leading-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[#7A7D83] text-base md:text-lg mb-8.75">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 border border-[#3C3D47] text-white hover:bg-[#202A43]
            py-2 md:py-3.5 cursor-pointer rounded-xl font-semibold transition"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="flex-1 bg-[#ef4343] hover:bg-red-600 text-white
            py-2 md:py-3.5 cursor-pointer rounded-xl font-semibold transition"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonConfirmModal;
