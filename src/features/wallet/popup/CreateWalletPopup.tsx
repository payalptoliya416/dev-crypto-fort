import { useState } from "react";
import { useDispatch } from "react-redux";

import CreateWalletUI from "../components/CreateWalletUI";
import { createWallet } from "../../../api/createWallet";
import { setWallet } from "../../../redux/walletSlice";

function CreateWalletPopup({
  onClose,
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
      <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose} 
    >
      <div onClick={(e) => e.stopPropagation()}>
        <CreateWalletUI
          loading={loading}
          onCreateWallet={handleCreateWallet}
          onImportWallet={onImport}
        />
      </div>
    </div>
  );
}

export default CreateWalletPopup;
