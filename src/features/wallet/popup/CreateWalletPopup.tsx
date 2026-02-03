import { useState } from "react";
import { useDispatch } from "react-redux";

import CreateWalletUI from "../components/CreateWalletUI";
import { createWallet } from "../../../api/createWallet";
import { setWallet } from "../../../redux/walletSlice";

function CreateWalletPopup({
//   onClose,
  onNext,
  onImport,
}: {
  onClose: () => void;
  onNext: () => void;
  onImport: () => void;
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    try {
      setLoading(true);

      const res = await createWallet(true);

      dispatch(setWallet(res.data));
      onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
     <CreateWalletUI
    loading={loading}
    onCreateWallet={handleCreateWallet}
    onImportWallet={onImport}          
    onLogin={() => alert("Login popup")}
  />
  );
}

export default CreateWalletPopup;
