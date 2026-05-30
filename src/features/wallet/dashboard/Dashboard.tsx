import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout"
import AssetsTab from "./AssetsTab"
import WalletSummary from "./WalletSummary"
import type { RootState } from "../../../redux/store/store";
import { useCallback, useEffect } from "react";
import { getWallets } from "../../../api/walletApi";
import { setActiveWallet } from "../../../redux/activeWalletSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const activeWallet = useSelector((state: RootState) => state.activeWallet.wallet);
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const refreshWallets = useCallback(async () => {
    try {
      const res = await getWallets();
      if (res.success && res.data.length > 0) {
        const currentId = activeWallet?.id;
        const fresh = res.data.find((w) => w.id === currentId) ?? res.data[0];
        dispatch(setActiveWallet(fresh));
      }
    } catch {
      toast.error("Failed to load wallets");
    }
  }, [activeWallet?.id, dispatch]);

  useEffect(() => {
    refreshWallets();
  }, []);

  return (
    <>
      <DashboardLayout>
        <WalletSummary refreshWallets={refreshWallets} />
        <AssetsTab refreshWallets={refreshWallets} />
      </DashboardLayout>
    </>
  )
}

export default Dashboard
