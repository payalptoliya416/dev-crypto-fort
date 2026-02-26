import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../layout/AuthLayout";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import SeedPhraseUI from "../components/SeedPhraseUI";

import { importWallet } from "../../../api/importWallet";

function SeedPhrase() {
  const navigate = useNavigate();

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
        false
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
      <AuthLayout>
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
      </AuthLayout>

      <CommonSuccessModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Access Unlocked"
        description="Your funds are now accessible. Continue to your dashboard."
        buttonText="Go to Dashboard"
        onButtonClick={() => navigate("/dashboard")}
      />
    </>
  );
}

export default SeedPhrase;
