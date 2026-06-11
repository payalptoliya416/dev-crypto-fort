import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout";
import CommonTable, { type Column } from "../../component/CommonTable";
import Loader from "../../component/Loader";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store/store";
import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d3 from "@/assets/Binance.png";
import d5 from "@/assets/TRC-20.svg";
import d9 from "@/assets/tron.svg";
import d4 from "@/assets/USDC.svg";
import up from "@/assets/up.svg";
import { formatBalance } from "../../component/format";
import { io } from "socket.io-client";
import AssetPieChart from "./AssetPieChart";
import { getDisplayTokenIcon } from "../utils/tokenIconUtils";
import custom_tokn from "@/assets/custom_tokn.svg";
interface Asset {
  name: string;
  symbol: string;
  price: string;
  balance: string;
  change: string;
  up: boolean;
  icon: string;
  token_price?: string;
    marketSymbol?: string;
}

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

function Balance() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const hasValidPrices = () => {
    const saved = localStorage.getItem("crypto_balance_prices");
    if (!saved) return false;
    const prices = JSON.parse(saved);

    return Object.values(prices).some(
      (p: any) => p?.price && Number(p.price) > 0,
    );
  };
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

    socket.onAny((_, data) => {
      if (!data?.prices) return;
      const saved = localStorage.getItem("crypto_balance_prices");
      const storedPrices = saved ? JSON.parse(saved) : {};

      setSocketLoaded(true);

      setAssets((prevAssets) => {
        const updated = prevAssets.map((asset) => {
  
         const socketSymbol =
  asset.marketSymbol || asset.symbol;

const match = data.prices.find(
  (p: any) =>
    String(p.symbol).toUpperCase() ===
    String(socketSymbol).toUpperCase()
);

        const usdtData = data.prices.find(
          (p: any) =>
            String(p.symbol).toUpperCase() === "USDT"
        );

        const hasSocketPrice = !!match;

          const effectivePrice = match?.price ?? usdtData?.price;

          if (!effectivePrice) {
            return asset;
          }

          const newPrice = Number(effectivePrice);

          if (isNaN(newPrice)) {
            return asset;
          }

          const previousPrice = Number(
            storedPrices?.[asset.symbol]?.price || asset.price || 0,
          );
          let changePercent = asset.change;
          let isUp = asset.up;

          if (previousPrice > 0) {
            const diff = ((newPrice - previousPrice) / previousPrice) * 100;
            changePercent = `${diff.toFixed(2)}%`;
            isUp = diff >= 0;
          }
          const fallbackSymbol =
            asset.marketSymbol || "USDT";

          return {
            ...asset,
            balance: asset.balance,

            price: hasSocketPrice
              ? String(match.price)
              : (
                  storedPrices?.[fallbackSymbol]?.price ||
                  usdtData?.price?.toString() ||
                  "1"
                ),

            change: hasSocketPrice
              ? changePercent
              : (
                  storedPrices?.[fallbackSymbol]?.change ||
                  "0.00%"
                ),

            up: hasSocketPrice
              ? isUp
              : (
                  storedPrices?.[fallbackSymbol]?.up ??
                  true
                ),
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

          localStorage.setItem(
            "crypto_balance_prices",
            JSON.stringify(priceMap),
          );
        }

       return updated.sort((a, b) => {
        const totalA =
          Number(a.balance || 0) *
          Number(a.price || 0);

        const totalB =
          Number(b.balance || 0) *
          Number(b.price || 0);

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
    bnb: { name: "BNB", symbol: "BNB", icon: d3 },
    trx: { name: "TRON", symbol: "TRX", icon: d9 },
    trc20: { name: "USDT (TRC20)", symbol: "USDT", icon: d5 },
    usdc: { name: "USDC (ERC20)", symbol: "USDC", icon: d4 },
  };

  const DEFAULT_ICON = custom_tokn;

  useEffect(() => {
    if (!activeWallet?.id) return;

    const fetchBalance = async () => {
      if (hasValidPrices()) {
        setSocketLoaded(true);
      }
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
        bnb: activeWallet.bnb_balance,
        trx: activeWallet.trx_balance,
        trc20: activeWallet.trc20_balance,
      };

        const savedPrices = localStorage.getItem("crypto_balance_prices");
        const priceMap = savedPrices ? JSON.parse(savedPrices) : {};
        const customAssets: Asset[] =
  activeWallet.custom_tokens?.map((token: any) => {
    const marketSymbol = token.is_eth ? "ETH" : "USDT";

    return {
      name: token.name,
      symbol: token.symbol,
      balance: token.balance,

      marketSymbol,

      price: priceMap[marketSymbol]?.price || "0",
      change: priceMap[marketSymbol]?.change || "0.00%",
      up: priceMap[marketSymbol]?.up ?? true,

      icon:
      token.is_eth &&
      token.token_image_url &&
      token.token_image_url.trim() !== ""
        ? token.token_image_url
        : getDisplayTokenIcon(token.symbol, DEFAULT_ICON),
      };
      }) || [];
  
        const assetList: Asset[] = Object.entries(balances)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            const config = COIN_CONFIG[key];
            const symbol = config?.symbol || key.toUpperCase();

            return {
              name: config?.name || key.toUpperCase(),
              symbol,
              balance: value,
              price: priceMap[symbol]?.price || priceMap["USDT"]?.price || "",
              change: priceMap[symbol]?.change ?? priceMap["USDT"]?.change ?? "",
              up: priceMap[symbol]?.up ?? priceMap["USDT"]?.up ?? true,
              icon: getDisplayTokenIcon(key, config?.icon || DEFAULT_ICON),
            };
          }) as Asset[];
        //  const sortedAssets = assetList.sort((a, b) => {
        //   const totalA =
        //     Number(a.balance || 0) * Number(a.price || 0);

        //   const totalB =
        //     Number(b.balance || 0) * Number(b.price || 0);

        //   return totalB - totalA;
        // });
            const sortedAssets = [...assetList, ...customAssets].sort(
              (a, b) => {
                const totalA =
                  Number(a.balance || 0) *
                  Number(a.price || 0);

                const totalB =
                  Number(b.balance || 0) *
                  Number(b.price || 0);

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
  }, [activeWallet?.id]);

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

  const chartData = displayAssets
  .map((asset) => {
    const balance = Number(asset.balance || 0);
    const price = Number(asset.price || 0);

    return {
      name: asset.symbol,
      value: balance * price,
    };
  })
  .filter((item) => item.value > 0);

  const columns: Column<Asset>[] = [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-[10px]">
          <img src={row.icon} alt="icon" className="w-[30px] rounded-full" />
          <div>
            <p className="text-sm text-white font-medium mb-1">{row.name}</p>
            <p className="text-xs text-[#7A7D83]">{row.symbol}</p>
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
      key: "token_price",
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

//         if (!row.change || row.change === "--") {
//   return (
//     <p className="text-[#FAFAFB] text-base font-medium">--</p>
//   );
// }
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
        if (!row.change || row.change === "--") {
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
      ${row.up ? "bg-[#25C866]" : "bg-[#DC2626]"} text-white`}
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
  const filteredAssets = displayAssets.filter(
  (asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <DashboardLayout>
      <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
        <div className="px-2 sm:px-5 pt-5 pb-[15px]">
          <h3 className="tet-xl text-[#25C866] font-semibold mb-5">
            Balance
          </h3>

         <AssetPieChart data={chartData} />
        </div>
          {loading || !socketLoaded ? (
            <></>)
            :
          ( <div className="flex items-center justify-end gap-3 flex-wrap mb-[15px] px-3 sm:px-5">
        
          <input
            type="text"
            placeholder="Search BTC, ETH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#202A43] border border-[#3C3D47] rounded-lg px-3 py-2 text-white text-sm outline-none w-[220px]"
          />
           </div>)
          }
        {loading || !socketLoaded ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-[#7A7D83] font-medium">
              No balance available
            </p>
            <p className="text-sm text-[#434548] mt-2">
              This wallet does not contain any assets yet.
            </p>
          </div>
        ) : (
        filteredAssets.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-white text-base font-medium">
            No assets found
          </p>
          <p className="text-[#7A7D83] text-sm mt-1">
            Try searching for BTC, ETH, USDT or another asset.
          </p>
        </div>
      ) : (
        <CommonTable data={filteredAssets} columns={columns} />
      )
        )}
      </div>
    </DashboardLayout>
  );
}

export default Balance;
