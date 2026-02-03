import AuthLayout from "../../layout/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createWallet } from "../../../api/createWallet";
import { useDispatch } from "react-redux";
import { setWallet } from "../../../redux/walletSlice";

import CreateWalletUI from "../components/CreateWalletUI";

function CreateWallet() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    try {
      setLoading(true);

      // ❌ Page version → no token
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
