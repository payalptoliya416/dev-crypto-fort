import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CommonSuccessModal from "../../component/CommonSuccessModal";
import AppLogo from "../../component/AppLogo";
import PrivateKeyUI from "../components/PrivateKeyUI";

import { importWallet } from "../../../api/importWallet";
import { useDispatch } from "react-redux";
import { setToken } from "../../../redux/authSlice";

function PrivateKey() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      
      if (res.data?.token) {
        dispatch(setToken({ 
          token: res.data.token, 
          expiresIn: res.data.expires_in! 
        }));
        navigate("/dashboard");
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
