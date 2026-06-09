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
  is_eth?: boolean;
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
          is_eth: asset.is_eth ?? false,
        }));

        const serverCustomAssets = activeWallet?.custom_tokens?.map((token: any) => ({
          token: token.contract_address?.toLowerCase() || token.symbol?.toLowerCase() || "",
          name: token.name,
          symbol: token.symbol,
          balance: token.balance,
          icon: getDisplayTokenIcon(token.contract_address || token.symbol || "", token.token_image_url),
          network: token.network,
          contractAddress: token.contract_address,
          is_eth: token.is_eth,
        })) || [];

        const mergedCustomAssetsMap = new Map<string, WalletAsset>();

        [...storedCustomAssets, ...serverCustomAssets].forEach((asset) => {
          const key = (
            asset.contractAddress || asset.token || asset.symbol || ""
          ).toString().toLowerCase();
          if (!key) return;

          const existing = mergedCustomAssetsMap.get(key);

          if (!existing) {
            mergedCustomAssetsMap.set(key, asset);
          } else if (
            asset.contractAddress &&
            !existing.contractAddress
          ) {
            mergedCustomAssetsMap.set(key, asset);
          }
        });

        const customAssets = Array.from(mergedCustomAssetsMap.values());

        const nativeAssetMap = new Map(nativeAssets.map((asset) => [asset.token, asset]));
        const mergedAssets = nativeAssets.map((asset) => {
          const matchingCustomAsset = customAssets.find((customAsset) =>
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
            is_eth: matchingCustomAsset.is_eth ?? asset.is_eth,
          };
        });

        customAssets
          .filter((customAsset) => {
            const customTokenKey = (
              customAsset.contractAddress || customAsset.token || ""
            ).toString();
            return !nativeAssetMap.has(customTokenKey);
          })
          .forEach((customAsset) => {
            mergedAssets.push({
              ...customAsset,
              icon: getDisplayTokenIcon(customAsset.token, customAsset.icon),
            });
          });

        const uniqueAssetsMap = new Map<string, WalletAsset>();
        mergedAssets.forEach((asset) => {
          const key = (
            asset.contractAddress || asset.token || asset.symbol || asset.name || ""
          )
            .toString()
            .toLowerCase();
          if (!uniqueAssetsMap.has(key)) {
            uniqueAssetsMap.set(key, asset);
          }
        });

        setAssets(Array.from(uniqueAssetsMap.values()));
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
