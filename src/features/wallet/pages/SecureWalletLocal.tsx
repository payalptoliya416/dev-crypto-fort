import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import type { RootState } from "../../../redux/store/store";
import { setToken, unlockWallet } from "../../../redux/authSlice";
import { saveEncryptedSeedPhrase } from "../../../utils/walletCrypto";

import AuthLayout from "../../layout/AuthLayout";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import SecureWalletUI from "../components/SecureWalletUI";

function SecureWalletLocal() {
  const wallet = useSelector((state: RootState) => state.wallet.wallet);
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as
    | {
        seedPhrase?: string;
        initialToken?: string;
        expiresIn?: number | null;
        userId?: number;
        requires2fa?: boolean;
      }
    | null) ?? null;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    try {
      const seedPhrase = state?.seedPhrase ?? wallet?.phrase;
      if (!seedPhrase) {
        toast.error("Seed phrase not available for password setup.");
        return;
      }

      setLoading(true);

      // Save encrypted seed locally (cookie + localStorage backup)
      saveEncryptedSeedPhrase(seedPhrase, values.password);

      // If flow provided an initial token (e.g. from registration/login), persist it locally
      if (state?.initialToken) {
        dispatch(
          setToken({
            token: state.initialToken,
            expiresIn: state.expiresIn,
            userId: state.userId,
          }),
        );
        dispatch(unlockWallet());
        toast.success("Password set successfully");
        navigate("/dashboard", { replace: true });
        return;
      }

      if (state?.requires2fa) {
        toast.success("Password set. Continue to 2FA verification.");
        navigate("/login-verify-2fa", { replace: true });
        return;
      }

      dispatch(unlockWallet());
      toast.success("Password saved locally. You can now unlock your wallet with it.");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error.message);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <SecureWalletUI
        loading={loading}
        showPassword={showPassword}
        showConfirm={showConfirm}
        setShowPassword={setShowPassword}
        setShowConfirm={setShowConfirm}
        onSubmit={handleSubmit}
      />

      <CommonSuccessModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Password Verified"
        description="Your password has been set. You now have full access to your wallet."
        buttonText="Go to Dashboard"
        onButtonClick={() => navigate("/dashboard")}
      />
    </AuthLayout>
  );
}

export default SecureWalletLocal;
