import { useState } from "react";
import toast from "react-hot-toast";

import CommonSuccessModal from "../../component/CommonSuccessModal";
import SeedPhraseUI from "../components/SeedPhraseUI";
import { importWallet } from "../../../api/importWallet";

function SeedPhrasePopup({ onFinish }: { onFinish: () => void }) {
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImport = async () => {
    if (!input.trim()) {
      setError("Recovery phrase is required");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const res = await importWallet(
        { type: "phrase", data: input.trim() },
        true 
      );

      toast.success(res.message);
      setShowModal(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SeedPhraseUI
        input={input}
        error={error}
        loading={loading}
        setInput={(v) => {
          setInput(v);
          setError("");
        }}
        onImport={handleImport}
      />

      <CommonSuccessModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Access Unlocked"
        description="Your funds are now accessible."
        buttonText="Done"
        onButtonClick={() => {
          setShowModal(false);
          onFinish();
        }}
      />
    </>
  );
}

export default SeedPhrasePopup;
