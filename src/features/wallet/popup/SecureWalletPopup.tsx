import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import SecureWalletUI from "../components/SecureWalletUI";
import type { RootState } from "../../../redux/store/store";
import { setWalletPassword } from "../../../api/setWalletPassword";

function SecureWalletPopup({
  onFinish,
  onClose,
}: {
  onFinish: () => void;
  onClose: () => void;
}) {
  const wallet = useSelector((state: RootState) => state.wallet.wallet);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      if (!wallet) {
        toast.error("Wallet not found!");
        return;
      }

      setLoading(true);

      const payload = {
        wallet_id: wallet.wallet_id,
        address: wallet.address,
        password: values.password,
        password_confirmation: values.confirmPassword,
        acknowledge_password_loss: values.acknowledge_password_loss,
      };

      const res = await setWalletPassword(payload, true);

      toast.success(res.message);
      setShowModal(true);
    } catch (error: any) {
      toast.error(error.message);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={onClose} // 👈 outside click closes popup
      >
        {/* ================= MODAL CONTENT ================= */}
        <div onClick={(e) => e.stopPropagation()}>
          <SecureWalletUI
            loading={loading}
            showPassword={showPassword}
            showConfirm={showConfirm}
            setShowPassword={setShowPassword}
            setShowConfirm={setShowConfirm}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <CommonSuccessModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Password Verified"
        description="Your password has been set. You now have full access to your wallet."
        buttonText="Done"
        onButtonClick={() => {
          setShowModal(false);
          onFinish(); // ✅ close flow
        }}
      />
    </>
  );
}

export default SecureWalletPopup;
