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
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Loader from "../../component/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { getBalance, getTransactions } from "../../../api/walletApi";
import { TbCopy } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from "recharts";
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

const BASE_CURRENCY = "USD";

const parseTime = (timestamp: string) => {
  if (!timestamp) return 0;
  return new Date(timestamp.replace(" ", "T")).getTime();
};

const getHistoricalPrice = (history: any[], targetTime: number) => {
  if (!history?.length) return null;

  const sorted = history
    .map((item: any) => ({ ...item, _t: parseTime(item.recorded_at) }))
    .filter((item: any) => item._t > 0)
    .sort((a: any, b: any) => a._t - b._t);

  if (!sorted.length) return null;

  const before = sorted.filter((item: any) => item._t <= targetTime);
  if (before.length) {
    return Number(before[before.length - 1].price || 0);
  }

  return Number(sorted[0].price || 0);
};

const getLatestPriceFromHistory = (history: any[]) => {
  if (!history?.length) return null;

  const sorted = history
    .map((item: any) => ({ ...item, _t: parseTime(item.recorded_at) }))
    .filter((item: any) => item._t > 0)
    .sort((a: any, b: any) => a._t - b._t);

  return Number(sorted[sorted.length - 1]?.price || 0);
};

function AssetsTab({
  refreshWallets,
}: {
  refreshWallets: () => Promise<void>;
}) {
  // const [setLoading] = useState(true);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetActionOpen, setAssetActionOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [assetTransactions, setAssetTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
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

    socket.on("priceHistory", (data) => {
      setPriceHistory(data);
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
        // setLoading(true);
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
        // setLoading(false);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load balance");
        // setLoading(false);
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

  useEffect(() => {
    if (!assetActionOpen || !selectedAsset || !activeWallet?.id) {
      setAssetTransactions([]);
      return;
    }

    const fetchAssetTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const res = await getTransactions({
          wallet_id: activeWallet.id,
          type: "all",
        });
        const currency = selectedAsset.symbol.toUpperCase();
        const filtered = (res.data || [])
          .filter((tx: any) => (tx.currency || "ETH").toUpperCase() === currency)
          .slice(0, 5);
        setAssetTransactions(filtered);
      } catch (err) {
        console.error("Failed to load transactions for asset", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchAssetTransactions();
  }, [selectedAsset, assetActionOpen, activeWallet?.id]);

  const chartData = useMemo(() => {
    if (!selectedAsset || !priceHistory?.data?.[BASE_CURRENCY]) return [];
    const priceSymbol = selectedAsset.marketSymbol || selectedAsset.symbol;
    const history = priceHistory.data[BASE_CURRENCY][priceSymbol] || [];
    
    return history
      .map((item: any) => ({
        date: parseTime(item.recorded_at),
        value: Number(item.price || 0),
      }))
      .filter((item: any) => item.date > 0)
      .sort((a: any, b: any) => a.date - b.date);
  }, [selectedAsset, priceHistory]);

  const displayAssets = useMemo(() => {
    if (!priceHistory?.data?.[BASE_CURRENCY]) {
      return assets;
    }

    const historyData = priceHistory.data[BASE_CURRENCY];
    const targetTime = Date.now() - 24 * 60 * 60 * 1000;

    return assets.map((asset) => {
      const priceSymbol = asset.marketSymbol || asset.symbol;
      const history = historyData[priceSymbol] || [];
      const latestPrice = getLatestPriceFromHistory(history) ?? Number(asset.price || 0);
      const previousPrice = getHistoricalPrice(history, targetTime) ?? latestPrice;

      if (previousPrice <= 0) {
        return asset;
      }

      const changeValue = ((latestPrice - previousPrice) / previousPrice) * 100;
      return {
        ...asset,
        price: String(latestPrice),
        change: `${changeValue.toFixed(2)}%`,
        up: changeValue >= 0,
      };
    });
  }, [assets, priceHistory]);

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

  const filteredAssets = displayAssets.filter((asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
  <div className="px-5 py-5 flex items-center justify-between flex-wrap gap-3">
  <h3 className="text-base xl:text-xl text-[#25C866] font-semibold">
    Assets
  </h3>

  <div className="flex items-center gap-3 flex-wrap">
    <input
      type="text"
      placeholder="Search BTC, ETH..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="bg-[#202A43] border border-[#3C3D47] rounded-lg px-3 py-2 text-white text-sm outline-none w-[220px]"
    />

    <button
      onClick={() => setImportOpen(true)}
      className="bg-[#202A43] rounded-lg py-2 px-5 sm:px-6 flex items-center gap-[10px] text-white text-sm font-medium cursor-pointer"
    >
      Import Token
    </button>
  </div>
</div>
        {filteredAssets.length === 0 ? (
  <div className="py-12 text-center">
    <p className="text-white text-base font-medium">
      No assets found
    </p>
    <p className="text-[#7A7D83] text-sm mt-1">
      Try searching for BTC, ETH, USDT or another asset.
    </p>
  </div>
) : (
  <CommonTable
    data={filteredAssets}
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
          <div className="relative w-full max-w-[560px] rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] flex flex-col gap-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#3C3D47]/40">
              <div className="flex items-center gap-[10px]">
                <img src={selectedAsset.icon} alt="icon" className="w-[30px] rounded-full" />
                <div>
                  <h3 className="text-white font-semibold text-base">
                    {selectedAsset.name} ({selectedAsset.symbol})
                  </h3>
                  <p className="text-[10px] text-[#7A7D83] uppercase">
                    {selectedAsset.network || "Ethereum Network"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssetActionOpen(false)}
                className="text-[#7A7D83] hover:text-white cursor-pointer transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Top: Graph of the asset */}
            <div className="bg-[#0D1428] rounded-xl p-3 border border-[#3C3D47]/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-semibold text-[#25C866] uppercase tracking-wider">
                  24h Price Trend
                </span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-white block">
                    ${Number(selectedAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </span>
                  <span className={`text-[10px] font-medium flex items-center gap-0.5 justify-end ${selectedAsset.up ? "text-green-500" : "text-red-500"}`}>
                    {selectedAsset.up ? "▲" : "▼"} {selectedAsset.change}
                  </span>
                </div>
              </div>
              {chartData.length > 0 ? (
                <div className="w-full h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="modalLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="50%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#F97316" />
                        </linearGradient>
                        <linearGradient id="modalAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                          <stop offset="50%" stopColor="#EC4899" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis hide dataKey="date" />
                      <YAxis hide domain={["dataMin - 0.1", "dataMax + 0.1"]} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="bg-[#161F37] border border-[#3C3D47] p-2 rounded text-white text-[11px] shadow-lg">
                              <div className="text-[#7A7D83]">
                                {new Date(label ?? Date.now()).toLocaleString([], {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-[#25C866] font-semibold mt-0.5">
                                Price: ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#modalLineGradient)"
                        strokeWidth={2}
                        fill="url(#modalAreaGradient)"
                        fillOpacity={1}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-[120px] flex items-center justify-center text-[11px] text-[#7A7D83]">
                  No price trend data available
                </div>
              )}
            </div>

            {/* Middle: Balance & Actions */}
            <div className="flex justify-between items-center p-3 rounded-xl bg-[#202A43]/30 border border-[#3C3D47]/20">
              <div>
                <span className="text-[10px] uppercase text-[#7A7D83] tracking-wider block">
                  Your Balance
                </span>
                <span className="text-base font-bold text-white mt-0.5 block">
                  {formatBalance(selectedAsset.balance)} {selectedAsset.symbol}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAssetActionOpen(false);
                    setSendOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#25C866] text-black font-semibold text-xs cursor-pointer hover:bg-[#20b359] transition-colors"
                >
                  Send
                </button>
                <button
                  onClick={() => {
                    setAssetActionOpen(false);
                    setReceiveOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#3C3D47] text-white font-semibold text-xs cursor-pointer hover:bg-white/5 transition-colors"
                >
                  Receive
                </button>
              </div>
            </div>

            {/* Bottom: Transaction History */}
            <div>
              <h4 className="text-[11px] font-semibold text-[#25C866] uppercase tracking-wider mb-2">
                Recent Transactions
              </h4>
              {loadingTransactions ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-t-transparent border-[#25C866] rounded-full animate-spin" />
                </div>
              ) : assetTransactions.length > 0 ? (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {assetTransactions.map((tx) => {
                    const isSend = tx.transaction_type === "Send";
                    const amountSign = isSend ? "-" : "+";
                    const amountColor = isSend ? "text-white" : "text-green-500";
                    const dateStr = new Date(tx.timestamp || tx.created_at).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div key={tx.id || tx.hash} className="flex justify-between items-center p-3 rounded-xl bg-[#202A43]/20 border border-[#3C3D47]/20 hover:bg-[#202A43]/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isSend ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                          }`}>
                            {isSend ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white flex items-center gap-2">
                              {isSend ? "Sent" : "Received"}
                              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                                tx.txreceipt_status === "Success" 
                                  ? "bg-green-500/10 text-green-500" 
                                  : tx.txreceipt_status === "Pending" 
                                  ? "bg-yellow-500/10 text-yellow-500" 
                                  : "bg-red-500/10 text-red-500"
                              }`}>
                                {tx.txreceipt_status || "Success"}
                              </span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-[#7A7D83] font-mono">
                                {tx.hash ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}` : "N/A"}
                              </span>
                              {tx.hash && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(tx.hash);
                                    toast.success("Hash copied!");
                                  }}
                                  className="text-[#7A7D83] hover:text-white cursor-pointer transition-colors"
                                >
                                  <TbCopy size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold ${amountColor}`}>
                            {amountSign}{tx.amount} {selectedAsset.symbol}
                          </p>
                          <p className="text-[10px] text-[#7A7D83] mt-1">
                            {dateStr}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-[#3C3D47]/40 rounded-xl text-[11px] text-[#7A7D83]">
                  No transaction history found for this asset
                </div>
              )}
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
