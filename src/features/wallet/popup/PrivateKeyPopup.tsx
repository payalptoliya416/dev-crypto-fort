    import { useState } from "react";
import toast from "react-hot-toast";

import CommonSuccessModal from "../../component/CommonSuccessModal";
import PrivateKeyUI from "../components/PrivateKeyUI";
import { importWallet } from "../../../api/importWallet";

function PrivateKeyPopup({ onFinish }: { onFinish: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleImportKey = async (privateKey: string) => {
    setApiError("");

    try {
      setLoading(true);

      const res = await importWallet(
        {
          type: "key",
          data: privateKey.trim(),
        },
        true // ✅ Token required (popup)
      );

      toast.success(res.message);
      setShowModal(true);
    } catch (err: any) {
      setApiError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PrivateKeyUI
        loading={loading}
        apiError={apiError}
        showKey={showKey}
        setShowKey={setShowKey}
        clearError={() => setApiError("")}
        onSubmit={handleImportKey}
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

export default PrivateKeyPopup;
