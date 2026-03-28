import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import type { RootState } from "../../../redux/store/store";
import { setWalletPassword } from "../../../api/setWalletPassword";
import { setToken } from "../../../redux/authSlice";

import AuthLayout from "../../layout/AuthLayout";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import SecureWalletUI from "../components/SecureWalletUI";

function SecureWallet() {
  const wallet = useSelector((state: RootState) => state.wallet.wallet);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (values: any) => {
    try {
      if (!wallet) {
        toast.error("Wallet not found!");
        return;
      }

      setLoading(true);

      const payload = {
        wallet_id: wallet.wallet_id,
        eth_address: wallet.eth_address,
        password: values.password,
        password_confirmation: values.confirmPassword,
        acknowledge_password_loss: values.acknowledge_password_loss,
      };

      const res = await setWalletPassword(payload, false);

      if (res.success) {
        if (res.data?.token) {
          dispatch(
            setToken({
              token: res.data.token,
              expiresIn: res.data.expires_in ?? 24 * 60 * 60,
              userId: res.data.user_id 
            })
          );
        }

        toast.success(res.message);

        navigate("/setup-2fa", { replace: true }); 
      }
      // setShowModal(true);
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

export default SecureWallet;
