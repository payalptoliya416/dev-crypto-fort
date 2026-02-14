import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";
import RecoveryPhraseUI from "../components/RecoveryPhraseUI";
import type { RootState } from "../../../redux/store/store";

function RecoveryPhrasePopup({
  onNext,
   onClose,
}: {
  onNext: () => void;
   onClose: () => void;
}) {
  const wallet = useSelector((state: RootState) => state.wallet.wallet);
  const [confirmLoading, setConfirmLoading] = useState(false);

  if (!wallet) return <p>No wallet found</p>;

  const words = wallet.phrase.split(" ");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.phrase);
      toast.success("Recovery phrase copied!");
    } catch {
      toast.error("Failed to copy recovery phrase");
    }
  };

  const handleConfirm = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      onNext(); 
    }, 500);
  };

  return (
     <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose} // 👈 outside click close
    >
      {/* ================= MODAL CONTENT ================= */}
      <div onClick={(e) => e.stopPropagation()}>
        <RecoveryPhraseUI
          words={words}
          phrase={wallet.phrase}
          confirmLoading={confirmLoading}
          onCopy={handleCopy}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}

export default RecoveryPhrasePopup;
