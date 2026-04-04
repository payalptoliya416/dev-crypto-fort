import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import ExistingWalletUI from "../components/ExistingWalletUI";

function ExistingWallet() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <ExistingWalletUI
        onSeedPhrase={() =>
          navigate("/seed-phrase", { state: { type: "phrase" } })
        }
        onPrivateKey={() =>
          navigate("/private-key", { state: { type: "key" } })
        }
      />
    </AuthLayout>
  );
}

export default ExistingWallet;
