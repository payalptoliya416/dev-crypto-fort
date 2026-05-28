import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout";
import CommonTable, { type Column } from "../../component/CommonTable";
import Loader from "../../component/Loader";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store/store";
import { getBalance } from "../../../api/walletApi";
import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d3 from "@/assets/Binance.png";
import d5 from "@/assets/TRC-20.svg";
import d9 from "@/assets/tron.svg";
import up from "@/assets/up.svg";
import { formatBalance } from "../../component/format";
import { io } from "socket.io-client";
import AssetPieChart from "./AssetPieChart";
interface Asset {
  name: string;
  symbol: string;
  price: string;
  balance: string;
  change: string;
  up: boolean;
  icon: string;
  token_price?: string;
}

function Balance() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [socketLoaded, setSocketLoaded] = useState(false);
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
    socket.onAny((_, data) => {
      if (!data?.prices) return;
      const saved = localStorage.getItem("crypto_balance_prices");
      const storedPrices = saved ? JSON.parse(saved) : {};

      setSocketLoaded(true);

      setAssets((prevAssets) => {
        const updated = prevAssets.map((asset) => {
  
          const match = data.prices.find((p: any) => p.symbol === asset.symbol);
   
          if (!match) return asset;

          const newPrice = Number(match?.price);

          if (!match?.price || isNaN(newPrice)) {
            return {
              ...asset,
              price: "",
              change: "--",
              up: false,
            };
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

          return {
            ...asset,
            price: newPrice.toString(),
            change: changePercent,
            up: isUp,
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

        return updated;
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
  };

  const DEFAULT_ICON = d1;

  useEffect(() => {
    if (!activeWallet?.id) return;

    const fetchBalance = async () => {
      if (hasValidPrices()) {
        setSocketLoaded(true);
      }
      try {
        setLoading(true);
        const balanceRes = await getBalance({
          wallet_id: activeWallet.id,
          type: "all",
        });

        const balances = balanceRes?.data?.balance || {};
        const savedPrices = localStorage.getItem("crypto_balance_prices");
        const priceMap = savedPrices ? JSON.parse(savedPrices) : {};
      
        const assetList: Asset[] = Object.entries(balances)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => {
            const config = COIN_CONFIG[key];
            const symbol = config?.symbol || key.toUpperCase();

            return {
              name: config?.name || key.toUpperCase(),
              symbol,
              balance: value,
              price: priceMap[symbol]?.price || "",
              change: priceMap[symbol]?.change ?? "",
              up: priceMap[symbol]?.up ?? true,
              icon: config?.icon || DEFAULT_ICON,
            };
          }) as Asset[];
        setAssets(assetList);
        setLoading(false);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load balance");
        setLoading(false);
      }
    };

    fetchBalance();
  }, [activeWallet?.id]);

  const chartData = assets
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
          <img src={row.icon} alt="icon" className="" />
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

        if (!row.change || row.change === "--") {
  return (
    <p className="text-[#FAFAFB] text-base font-medium">--</p>
  );
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

  return (
    <DashboardLayout>
      <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
        <div className="px-2 sm:px-5 pt-5 pb-[15px]">
          <h3 className="tet-xl text-[#25C866] font-semibold mb-[15px]">
            Balance
          </h3>

         <AssetPieChart data={chartData} />
        </div>

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
          <CommonTable data={assets} columns={columns} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Balance;
