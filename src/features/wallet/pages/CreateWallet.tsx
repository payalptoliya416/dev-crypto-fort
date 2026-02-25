import AuthLayout from "../../layout/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createWallet } from "../../../api/createWallet";
import { useDispatch, useSelector } from "react-redux";
import { setWallet } from "../../../redux/walletSlice";
import CreateWalletUI from "../components/CreateWalletUI";
import type { RootState } from "../../../redux/store/store";

function CreateWallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const handleCreateWallet = async () => {
    try {
      setLoading(true);
      const res = await createWallet(false);
      dispatch(setWallet(res.data));
      navigate("/recovery-phrase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CreateWalletUI
        loading={loading}
        onCreateWallet={handleCreateWallet}
        onImportWallet={() => navigate("/existing-wallet")}
        onLogin={() => navigate("/login")}
      />
    </AuthLayout>
  );
}

export default CreateWallet;
