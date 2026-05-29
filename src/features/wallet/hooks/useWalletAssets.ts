import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { getBalance } from "../../../api/walletApi";
import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d3 from "@/assets/Binance.png";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import d9 from "@/assets/tron.svg";

export interface WalletAsset {
  token: string;
  name: string;
  symbol: string;
  icon: string;
  balance: string;
}

const COIN_CONFIG: Record<string, { name: string; symbol: string; icon: string }> = {
  btc: { name: "Bitcoin", symbol: "BTC", icon: d2 },
  eth: { name: "Ethereum", symbol: "ETH", icon: d1 },
  usdt: { name: "Tether", symbol: "USDT", icon: d5 },
  usdc: { name: "USDC (ERC20)", symbol: "USDC", icon: d4 },
  bnb: { name: "BNB", symbol: "BNB", icon: d3 },
  trx: { name: "TRON", symbol: "TRX", icon: d9 },
  trc20: { name: "USDT (TRC20)", symbol: "USDT", icon: d5 },
};

export function useWalletAssets() {
  const activeWallet = useSelector((state: RootState) => state.activeWallet.wallet);
  const [assets, setAssets] = useState<WalletAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeWallet?.id) return;
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const balanceRes = await getBalance({ wallet_id: activeWallet.id, type: "all" });
        const balances = balanceRes?.data?.balance || {};
        const assetList: WalletAsset[] = Object.entries(balances)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            const config = COIN_CONFIG[key];
            const symbol = config?.symbol || key.toUpperCase();
            return {
              token: key,
              name: config?.name || key.toUpperCase(),
              symbol,
              balance: value,
              icon: config?.icon || d1,
            };
          });
        setAssets(assetList);
      } catch {
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, [activeWallet?.id]);

  return { assets, loading };
}
