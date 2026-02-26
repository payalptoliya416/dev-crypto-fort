import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import type { RootState } from "../../../redux/store/store";
import AuthLayout from "../../layout/AuthLayout";
import RecoveryPhraseUI from "../components/RecoveryPhraseUI";

function RecoveryPhrase() {
  const wallet = useSelector((state: RootState) => state.wallet.wallet);
  const navigate = useNavigate();

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
      navigate("/create-password");
    }, 500);
  };

  return (
    <AuthLayout>
      <RecoveryPhraseUI
        words={words}
        phrase={wallet.phrase}
        confirmLoading={confirmLoading}
        onCopy={handleCopy}
        onConfirm={handleConfirm}
      />
    </AuthLayout>
  );
}

export default RecoveryPhrase;
