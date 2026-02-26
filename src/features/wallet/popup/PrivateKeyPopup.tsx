import { useState } from "react";
import toast from "react-hot-toast";

import CommonSuccessModal from "../../component/CommonSuccessModal";
import PrivateKeyUI from "../components/PrivateKeyUI";
import { importWallet } from "../../../api/importWallet";

function PrivateKeyPopup({
  onFinish,
  onClose,
}: {
  onFinish: () => void;
  onClose: () => void;
}) {
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
        true, 
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={onClose} 
      >
        {/* ================= MODAL CONTENT ================= */}
        <div onClick={(e) => e.stopPropagation()}>
          <PrivateKeyUI
            loading={loading}
            apiError={apiError}
            showKey={showKey}
            setShowKey={setShowKey}
            clearError={() => setApiError("")}
            onSubmit={handleImportKey}
          />
        </div>
      </div>
      
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
