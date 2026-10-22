import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState } from "../../../redux/store/store";
import {
  fetchAllTransactions,
  getTransactions,
  getBalance,
  getWallets,
} from "../../../api/walletApi";
import { setActiveWallet } from "../../../redux/activeWalletSlice";

export function useTransactionSync() {
  const dispatch = useDispatch();
  const location = useLocation();
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const activeWalletId = activeWallet?.id;

  const inFlightWalletIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!token || !activeWalletId) return;

    let isMounted = true;

    const performSync = async () => {
      // Prevent duplicate parallel calls for same wallet
      if (inFlightWalletIdRef.current === activeWalletId) return;
      inFlightWalletIdRef.current = activeWalletId;

      try {
        const res = await fetchAllTransactions({ wallet_id: activeWalletId });

        if (isMounted && res?.success && res?.data?.is_transaction === true) {
          // 1. Fetch updated transactions
          const txRes = await getTransactions({
            wallet_id: activeWalletId,
            type: "all",
          });

          // 2. Fetch updated balance and update activeWallet in Redux
          const [balanceRes, walletsRes] = await Promise.allSettled([
            getBalance({ wallet_id: activeWalletId, type: "all" }),
            getWallets(),
          ]);

          if (
            isMounted &&
            walletsRes.status === "fulfilled" &&
            walletsRes.value?.success
          ) {
            const freshWallet = walletsRes.value.data.find(
              (w) => w.id === activeWalletId
            );

            if (freshWallet) {
              if (
                balanceRes.status === "fulfilled" &&
                balanceRes.value?.success &&
                balanceRes.value.data?.balance
              ) {
                const b = balanceRes.value.data.balance;
                if (b.eth !== undefined) freshWallet.eth_balance = b.eth;
                if (b.btc !== undefined) freshWallet.btc_balance = b.btc;
                if (b.usdt !== undefined) freshWallet.usdt_balance = b.usdt;
                if (b.usdc !== undefined) freshWallet.usdc_balance = b.usdc;
                if (b.bnb !== undefined) freshWallet.bnb_balance = b.bnb;
                if (b.trx !== undefined) freshWallet.trx_balance = b.trx;
                if (b.trc20 !== undefined) freshWallet.trc20_balance = b.trc20;
              }

              dispatch(setActiveWallet(freshWallet));
            }
          }

          // 3. Dispatch events to notify balance and transaction listeners
          window.dispatchEvent(new Event("wallets-updated"));

          if (isMounted && txRes?.success && Array.isArray(txRes.data)) {
            window.dispatchEvent(
              new CustomEvent("transactions-updated", {
                detail: {
                  walletId: activeWalletId,
                  transactions: txRes.data,
                },
              })
            );
          }
        }
      } catch (err) {
        // Runs silently in background
        console.error("Background transaction sync error:", err);
      } finally {
        inFlightWalletIdRef.current = null;
      }
    };

    performSync();

    return () => {
      isMounted = false;
    };
  }, [activeWalletId, location.pathname, token, dispatch]);
}
