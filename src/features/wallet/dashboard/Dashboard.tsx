import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout"
import AssetsTab from "./AssetsTab"
import WalletSummary from "./WalletSummary"
import type { RootState } from "../../../redux/store/store";
import { useEffect } from "react";
import { getWallets } from "../../../api/walletApi";
import { setActiveWallet } from "../../../redux/activeWalletSlice";
import toast from "react-hot-toast";

function Dashboard() {
    const dispatch = useDispatch();
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet
  );

  useEffect(() => {
    const initWallet = async () => {
      try {
        const res = await getWallets();

        if (res.success && res.data.length > 0) {
          if (!activeWallet) {
            dispatch(setActiveWallet(res.data[0]));
          }
        }
      } catch {
        toast.error("Failed to load wallets");
      }
    };

    initWallet();
  }, []);

  return (
    <>
      <DashboardLayout>
        <WalletSummary/>
        <AssetsTab/>
      </DashboardLayout>
    </>
  )
}

export default Dashboard
