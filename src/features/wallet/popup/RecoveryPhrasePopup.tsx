import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState } from "react";
import RecoveryPhraseUI from "../components/RecoveryPhraseUI";
import type { RootState } from "../../../redux/store/store";

function RecoveryPhrasePopup({
  onNext,
}: {
  onNext: () => void;
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
    <RecoveryPhraseUI
      words={words}
      phrase={wallet.phrase}
      confirmLoading={confirmLoading}
      onCopy={handleCopy}
      onConfirm={handleConfirm}
    />
  );
}

export default RecoveryPhrasePopup;
