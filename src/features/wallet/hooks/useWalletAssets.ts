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
import { getDisplayTokenIcon } from "../utils/tokenIconUtils";

export interface WalletAsset {
  token: string;
  name: string;
  symbol: string;
  icon: string;
  balance: string;
  network?: string;
  contractAddress?: string;
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

const CUSTOM_TOKENS_KEY = "custom_wallet_tokens";

const getStoredCustomAssets = (): WalletAsset[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_TOKENS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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

        const nativeAssets: WalletAsset[] = Object.entries(balances)
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

        const storedCustomAssets = getStoredCustomAssets().map((asset) => ({
          ...asset,
          icon: getDisplayTokenIcon(asset.token, asset.icon),
        }));

        const nativeAssetMap = new Map(nativeAssets.map((asset) => [asset.token, asset]));
        const mergedAssets = nativeAssets.map((asset) => {
          const matchingCustomAsset = storedCustomAssets.find((customAsset) =>
            customAsset.contractAddress === asset.token || customAsset.token === asset.token,
          );

          if (!matchingCustomAsset) return asset;

          return {
            ...asset,
            name: matchingCustomAsset.name || asset.name,
            symbol: matchingCustomAsset.symbol || asset.symbol,
            icon: matchingCustomAsset.icon || asset.icon,
            network: matchingCustomAsset.network || asset.network,
            contractAddress: matchingCustomAsset.contractAddress || asset.contractAddress,
          };
        });

        storedCustomAssets
          .filter((customAsset) => {
            const customTokenKey = customAsset.contractAddress || customAsset.token;
            return !nativeAssetMap.has(customTokenKey);
          })
          .forEach((customAsset) => {
            mergedAssets.push({
              ...customAsset,
              icon: getDisplayTokenIcon(customAsset.token, customAsset.icon),
            });
          });

        setAssets(mergedAssets);
      } catch {
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    const handleCustomTokenImport = () => {
      fetchBalance();
    };

    window.addEventListener("custom-token-imported", handleCustomTokenImport);

    return () => {
      window.removeEventListener("custom-token-imported", handleCustomTokenImport);
    };
  }, [activeWallet?.id]);

  return { assets, loading };
}
