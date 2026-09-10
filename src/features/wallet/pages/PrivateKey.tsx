import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CommonSuccessModal from "../../component/CommonSuccessModal";
import AppLogo from "../../component/AppLogo";
import PrivateKeyUI from "../components/PrivateKeyUI";

import { importWallet } from "../../../api/importWallet";

function PrivateKey() {
  const navigate = useNavigate();

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
        false // ❌ No token (page)
      );

      toast.success(res.message);
      // Notify app to refresh wallet lists
      window.dispatchEvent(new Event("wallets-updated"));

      if (res.data?.token) {
        navigate("/create-password-local", {
          state: {
            seedPhrase: res.data.phrase ?? privateKey.trim(),
            initialToken: res.data.token,
            expiresIn: res.data.expires_in,
            userId: res.data.user_id,
          },
        });
      } else {
        setShowModal(true);
      }
    } catch (err: any) {
      setApiError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#13192B] flex items-center justify-center px-4 sm:px-6">
        <AppLogo />

        <PrivateKeyUI
          loading={loading}
          apiError={apiError}
          showKey={showKey}
          setShowKey={setShowKey}
          clearError={() => setApiError("")}
          onSubmit={handleImportKey}
        />
      </div>

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

export default PrivateKey;
