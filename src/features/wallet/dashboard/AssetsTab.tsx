import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import d3 from "@/assets/Binance.png";
import d9 from "@/assets/tron.svg";
import up from "@/assets/up.svg";
import custom_tokn from "@/assets/custom_tokn.svg";
import CommonTable, { type Column } from "../../component/CommonTable";
import { formatBalance } from "../../component/format";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Loader from "../../component/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { getBalance } from "../../../api/walletApi";
import SendTokenModal from "./SendTokenModal";
import ReceiveTokenModal from "./ReceiveTokenModal";
import ConfirmTransactionModal from "./ConfirmTransactionModal";
import toast from "react-hot-toast";
import ImportTokenModal from "./ImportTokenModal";
import { getDisplayTokenIcon } from "../utils/tokenIconUtils";

interface Asset {
  token: string;
  name: string;
  symbol: string;
  price: string;
  balance: string;
  change: string;
  up: boolean;
  icon: string;
  network?: string;
  contractAddress?: string;
  value?: string;
  marketSymbol?: string;
}

const CUSTOM_TOKENS_KEY = "custom_wallet_tokens";

const getStoredCustomAssets = (): Asset[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_TOKENS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function AssetsTab({
  refreshWallets,
}: {
  refreshWallets: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(true);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetActionOpen, setAssetActionOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );

  useEffect(() => {
    const socket = io("https://socket.cryptosfort.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      // connected
    });

    socket.on("connect_error", (error) => {
      console.warn("Socket connect error:", error);
    });

    socket.onAny((_, data) => {
      if (!data?.prices || !Array.isArray(data.prices)) return;
      const saved = localStorage.getItem("crypto_prices");
      const storedPrices = saved ? JSON.parse(saved) : {};

      // socket price update received

      setAssets((prevAssets) => {
        const updated = prevAssets.map((asset) => {
          const socketSymbol = asset.marketSymbol || asset.symbol;

          const match = data.prices.find(
            (p: any) =>
              String(p.symbol).toUpperCase() ===
              String(socketSymbol).toUpperCase(),
          );
          const usdtData = data.prices.find(
            (p: any) => String(p.symbol).toUpperCase() === "USDT",
          );
          const newPrice =
            match?.price != null
              ? Number(match.price)
              : usdtData?.price != null
                ? Number(usdtData.price)
                : Number(asset.price || 0);

          const previousPrice = Number(
            storedPrices?.[asset.symbol]?.price || asset.price || 0,
          );
          let changePercent =
            match?.price != null
              ? asset.change
              : storedPrices?.USDT?.change || "0.00%";

          let isUp =
            match?.price != null ? asset.up : (storedPrices?.USDT?.up ?? true);

          if (previousPrice > 0) {
            const diff = ((newPrice - previousPrice) / previousPrice) * 100;
            changePercent = `${diff.toFixed(2)}%`;
            isUp = diff >= 0;
          }

          const hasSocketPrice = !!match;

          const fallbackSymbol =
  asset.marketSymbol ||
  (asset.symbol === "ETH" ? "ETH" : "USDT");

        const fallbackPrice =
          storedPrices?.[fallbackSymbol]?.price ||
          "1";

          return {
            ...asset,
            price: hasSocketPrice ? String(match.price) : fallbackPrice,

            change: hasSocketPrice
            ? changePercent
            : storedPrices?.[fallbackSymbol]?.change || "0.00%",

          up: hasSocketPrice
            ? isUp
            : (storedPrices?.[fallbackSymbol]?.up ?? true),
          };
        });

        if (updated.length > 0) {
          const priceMap: any = {};

          updated.forEach((a) => {
            const prevStored = storedPrices?.[a.symbol];

            priceMap[a.symbol] = {
              price: a.price,
              prevPrice: prevStored?.price || a.price,
              change: a.change,
              up: a.up,
            };
          });
          localStorage.setItem("crypto_prices", JSON.stringify(priceMap));
        }

        return updated.sort((a, b) => {
          const totalA = Number(a.balance || 0) * Number(a.price || 1);

          const totalB = Number(b.balance || 0) * Number(b.price || 1);

          return totalB - totalA;
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const COIN_CONFIG: Record<
    string,
    { name: string; symbol: string; icon: string }
  > = {
    btc: { name: "Bitcoin", symbol: "BTC", icon: d2 },
    eth: { name: "Ethereum", symbol: "ETH", icon: d1 },
    usdt: { name: "Tether", symbol: "USDT", icon: d5 },
    usdc: { name: "USDC (ERC20)", symbol: "USDC", icon: d4 },
    bnb: { name: "BNB", symbol: "BNB", icon: d3 },
    trx: { name: "TRON", symbol: "TRX", icon: d9 },
    trc20: { name: "USDT (TRC20)", symbol: "USDT", icon: d5 },
  };

  useEffect(() => {
    if (!activeWallet?.id) return;

    const fetchBalance = async () => {
      // if we have cached prices, continue — no socketLoaded state needed
      try {
        setLoading(true);
        // const balanceRes = await getBalance({
        //   wallet_id: activeWallet.id,
        //   type: "all",
        // });

        // const balances = balanceRes?.data?.balance || {};
        const balances = {
      eth: activeWallet.eth_balance,
      btc: activeWallet.btc_balance,
      usdt: activeWallet.usdt_balance,
      usdc: activeWallet.usdc_balance,
      trx: activeWallet.trx_balance,
      bnb: activeWallet.bnb_balance,
      trc20: activeWallet.trc20_balance,
    };
        const savedPrices = localStorage.getItem("crypto_prices");
        const priceMap = savedPrices ? JSON.parse(savedPrices) : {};

        const nativeAssets: Asset[] = Object.entries(balances)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            const config = COIN_CONFIG[key];
            const symbol = config?.symbol || key.toUpperCase();

            return {
              token: key,
              name: config?.name || key.toUpperCase(),
              symbol,
              balance: value,
              price: priceMap[symbol]?.price || "",
              change: priceMap[symbol]?.change ?? "",
              up: priceMap[symbol]?.up ?? true,
              icon: getDisplayTokenIcon(key, config?.icon || custom_tokn),
            };
          }) as Asset[];

    const customAssets: Asset[] =
  activeWallet.custom_tokens?.map((token: any) => {
    const marketSymbol = token.is_eth ? "ETH" : "USDT";

    return {
      token: token.contract_address?.toLowerCase() || token.symbol.toLowerCase(),
      name: token.name,
      symbol: token.symbol,
      balance: token.balance,

      marketSymbol, // 👈 add

      price: priceMap[marketSymbol]?.price || "0",
      change: priceMap[marketSymbol]?.change || "0.00%",
      up: priceMap[marketSymbol]?.up ?? true,

     icon:
    token.is_eth &&
    token.token_image_url &&
    token.token_image_url.trim() !== ""
    ? token.token_image_url
    : getDisplayTokenIcon(token.symbol, custom_tokn),
      network: token.network,
      contractAddress: token.contract_address,
    };
  }) || [];
  
        const storedCustomAssets = getStoredCustomAssets().map((asset) => {
          const usdtData = priceMap["USDT"];

          return {
            ...asset,
            price: priceMap[asset.symbol]?.price || usdtData?.price || "1",
            change:
              priceMap[asset.symbol]?.change || usdtData?.change || "0.00%",
            up: priceMap[asset.symbol]?.up ?? usdtData?.up ?? true,
            icon: getDisplayTokenIcon(asset.token, asset.icon),
          };
        });
        const nativeAssetMap = new Map(
          nativeAssets.map((asset) => [asset.token, asset]),
        );
        const mergedAssets = nativeAssets.map((asset) => {
          const matchingCustomAsset = storedCustomAssets.find(
            (customAsset) =>
              customAsset.contractAddress === asset.token ||
              customAsset.token === asset.token,
          );

          if (!matchingCustomAsset) return asset;

          return {
            ...asset,
            name: matchingCustomAsset.name || asset.name,
            symbol: matchingCustomAsset.symbol || asset.symbol,
            price: matchingCustomAsset.price || asset.price,
            change: matchingCustomAsset.change || asset.change,
            up: matchingCustomAsset.up,
            icon: matchingCustomAsset.icon || asset.icon,
            network: matchingCustomAsset.network,
            contractAddress: matchingCustomAsset.contractAddress,
          };
        });

        storedCustomAssets
          .filter((customAsset) => {
            const customTokenKey =
              customAsset.contractAddress || customAsset.token;
            return !nativeAssetMap.has(customTokenKey);
          })
          .forEach((customAsset) => {
            mergedAssets.push({
              ...customAsset,
              icon: getDisplayTokenIcon(customAsset.token, customAsset.icon),
            });
          });

        // const sortedAssets = mergedAssets.sort((a, b) => {
        //   const totalA = Number(a.balance || 0) * Number(a.price || 1);

        //   const totalB = Number(b.balance || 0) * Number(b.price || 1);

        //   return totalB - totalA;
        // });
        
        const sortedAssets = [...nativeAssets, ...customAssets].sort(
          (a, b) => {
            const totalA =
              Number(a.balance || 0) *
              Number(a.price || 1);

            const totalB =
              Number(b.balance || 0) *
              Number(b.price || 1);

            return totalB - totalA;
          }
        );
        setAssets(sortedAssets);
        setLoading(false);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load balance");
        setLoading(false);
      }
    };

    fetchBalance();

    const handleCustomTokenImport = () => {
      fetchBalance();
    };

    window.addEventListener("custom-token-imported", handleCustomTokenImport);

    return () => {
      window.removeEventListener(
        "custom-token-imported",
        handleCustomTokenImport,
      );
    };
  }, [activeWallet?.id]);

  const columns: Column<Asset>[] = [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-[10px]">
          <img src={row.icon} alt="icon" className="w-[30px] rounded-full" />
          <div>
            <p className="text-sm text-white font-medium mb-1">{row.name}</p>
            <p className="text-xs text-[#FAFAFB]">{row.symbol}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Balance",
      key: "balance",
      align: "right",
      render: (row) => (
        <p className="text-[#FAFAFB] text-base font-normal">
          {formatBalance(row.balance)} {row.symbol}
        </p>
      ),
    },
    {
      header: "Value",
      key: "value",
      align: "right",
      width: "13%",
      render: (row) => {
        const balance = Number(row.balance || 0);
        if (!row.price) {
          return (
            <div className="flex justify-end">
              <div className="w-10 h-5 overflow-hidden">
                <Loader />
              </div>
            </div>
          );
        }

        const cleaned = String(row.price).replace(/[$,]/g, "");
        const price = Number(cleaned);

        if (isNaN(price)) {
          return <p className="text-[#FAFAFB] text-base font-normal">--</p>;
        }

        const total = balance * price;

        return (
          <p className="text-[#FAFAFB] text-base font-normal">
            ${formatBalance(total, { isFiat: true })}
          </p>
        );
      },
    },
    {
      header: "Price",
      key: "price",
      align: "right",
      width: "13%",
      render: (row) => {
        if (!row.price) {
          return (
            <div className="flex justify-end">
              <div className="w-10 h-5 overflow-hidden">
                <Loader />
              </div>
            </div>
          );
        }

        return (
          <p className="text-[#FAFAFB] text-base font-normal">
            ${formatBalance(row.price, { isFiat: true })}
          </p>
        );
      },
    },
    {
      header: "Change",
      key: "change",
      align: "right",
      width: "13%",
      render: (row) => {
        if (!row.change) {
          return (
            <div className="flex justify-end">
              <div className="w-10 h-5 overflow-hidden">
                <Loader />
              </div>
            </div>
          );
        }

        return (
          <span
            className={`px-[10px] py-[6px] rounded-[5px] text-sm font-medium inline-flex items-center gap-[5px]
      ${row.up ? "bg-[#16A34A]" : "bg-[#DC2626]"} text-white`}
          >
            <img
              src={up}
              alt="icon"
              className={`${row.up ? "" : "rotate-180"}`}
            />
            {row.change}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
      <div className="px-5 py-5 flex items-center justify-between flex-wrap gap-1">
        <h3 className="text-base xl:text-xl text-[#25C866] font-semibold">
          Assets
        </h3>
        <button
          onClick={() => setImportOpen(true)}
          className="bg-[#202A43] rounded-lg py-2 px-5 sm:px-6 flex items-center gap-[10px] text-white text-sm font-medium cursor-pointer"
        >
          Import Token
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : (
        <CommonTable
          data={assets}
          columns={columns}
          onRowClick={(asset) => {
            setSelectedAsset(asset);
            setAssetActionOpen(true);
          }}
        />
      )}

      {assetActionOpen && selectedAsset && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
          <div
            onClick={() => setAssetActionOpen(false)}
            className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-[420px] rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]">
            <h3 className="text-[#25C866] font-semibold text-lg mb-4">
              {selectedAsset.name}
            </h3>
            <p className="text-[#7A7D83] mb-4">
              Balance: {formatBalance(selectedAsset.balance)}{" "}
              {selectedAsset.symbol}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setAssetActionOpen(false);
                  setSendOpen(true);
                }}
                className="py-3 rounded-xl bg-[#25C866] text-black font-semibold cursor-pointer"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setAssetActionOpen(false);
                  setReceiveOpen(true);
                }}
                className="py-3 rounded-xl border border-[#3C3D47] text-white cursor-pointer"
              >
                Receive
              </button>
            </div>
          </div>
        </div>
      )}

      <ImportTokenModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
          refreshWallets={refreshWallets}
      />
      <SendTokenModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onNext={() => {
          setSendOpen(false);
          setAssetActionOpen(false);
          setConfirmOpen(true);
        }}
        defaultSelectedToken={selectedAsset?.token}
        defaultAmount={selectedAsset?.balance}
        dashboardMode={true}
      />
      <ReceiveTokenModal
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
        defaultSelectedToken={selectedAsset?.token ?? "eth"}
      />

      <ConfirmTransactionModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onSuccess={async () => {
          try {
            if (activeWallet?.id) {
              await getBalance({ wallet_id: activeWallet.id, type: "all" });
            }
          } catch (error) {
            console.error("Failed to refresh wallet balance:", error);
          }
        }}
      />
    </div>
  );
}

export default AssetsTab;
