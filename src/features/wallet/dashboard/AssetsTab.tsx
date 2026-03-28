import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d5 from "@/assets/d5.png";
import d3 from "@/assets/d3.png";
import d9 from "@/assets/d9.png";
import up from "@/assets/up.svg";
import CommonTable, { type Column } from "../../component/CommonTable";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Loader from "../../component/Loader";
interface Asset {
  name: string;
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  icon: string;
}

function AssetsTab() {
  const [loading, setLoading] = useState(true);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const socket = io("https://socket.cryptosfort.com", {
      transports: ["websocket"],
    });

 socket.onAny((_, data) => {
  if (!data?.prices) return;

  const saved = localStorage.getItem("crypto_prices");
  const storedPrices = saved ? JSON.parse(saved) : {};

  setAssets((prevAssets) => {
    const updated = prevAssets.map((asset) => {
    const match = data.prices.find(
  (p: any) => p.symbol.toUpperCase() === asset.symbol.toUpperCase()
);
      if (!match) return asset;

      const newPrice = Number(match.price);

      const prevPrice = Number(
        storedPrices?.[asset.symbol]?.price || newPrice
      );

      let diff = 0;
      let changePercent = asset.change;
      let isUp = asset.up;

      if (prevPrice > 0 && prevPrice !== newPrice) {
        diff = ((newPrice - prevPrice) / prevPrice) * 100;
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

    // store new + prev price
    const priceMap: any = {};

    updated.forEach((a) => {
      const old = storedPrices?.[a.symbol];

      priceMap[a.symbol] = {
        price: a.price,
        prevPrice: old?.price || a.price,
        change: a.change,
        up: a.up,
      };
    });

    localStorage.setItem("crypto_prices", JSON.stringify(priceMap));

    return updated;
  });

  setSocketLoaded(true);
  setLoading(false);
});

    return () => {
      socket.disconnect();
    };
  }, []);

  const COIN_CONFIG: Record<string, { name: string; symbol: string; icon: string }> = {
  btc: { name: "Bitcoin", symbol: "BTC", icon: d2 },
  eth: { name: "Ethereum", symbol: "ETH", icon: d1 },
  usdt: { name: "Tether", symbol: "USDT", icon: d5 },
  bnb: { name: "BNB", symbol: "BNB", icon: d3 },
  trx: { name: "TRON", symbol: "TRX", icon: d9 },
   trc20: { name: "USDT (TRC20)", symbol: "TRC20", icon: d5 },
};

  useEffect(() => {
    const savedPrices = localStorage.getItem("crypto_prices");
    const priceMap = savedPrices ? JSON.parse(savedPrices) : {};

    // const assetList: Asset[] = [
    //   {
    //     name: "Bitcoin",
    //     symbol: "BTC",
    //     price: priceMap.BTC?.price || "",
    //     change: priceMap.BTC?.change ?? "0.00%",
    //     up: priceMap.BTC?.up ?? true,
    //     icon: d2,
    //   },
    //   {
    //     name: "Ethereum",
    //     symbol: "ETH",
    //     price: priceMap.ETH?.price || "",
    //     change: priceMap.ETH?.change ?? "0.00%",
    //     up: priceMap.ETH?.up ?? true,
    //     icon: d1,
    //   },
    //   {
    //     name: "Tether",
    //     symbol: "USDT",
    //     price: priceMap.USDT?.price || "",
    //     change: priceMap.USDT?.change ?? "0.00%",
    //     up: priceMap.USDT?.up ?? true,
    //     icon: d5,
    //   },
    // ];
const assetList: Asset[] = Object.values(COIN_CONFIG).map((coin) => ({
  name: coin.name,
  symbol: coin.symbol,
  price: priceMap[coin.symbol]?.price || "",
  change: priceMap[coin.symbol]?.change ?? "0.00%",
  up: priceMap[coin.symbol]?.up ?? true,
  icon: coin.icon,
}));
    setAssets(assetList);
    setLoading(false);
  }, []);

  const columns: Column<Asset>[] = [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-[10px]">
          <img src={row.icon} alt="icon" className="w-8 h-8" />
          <div>
            <p className="text-sm text-white font-medium mb-1">{row.name}</p>
            <p className="text-xs text-[#7A7D83]">{row.symbol}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Last Price",
      key: "price",
      align: "right",
      width: "13%",
      render: (row) => {
        const rawValue = row?.price;

        if (rawValue === undefined || rawValue === null) {
          return <p className="text-[#7A7D83] text-base font-normal">--</p>;
        }

        const cleaned = String(rawValue).replace(/[$,]/g, "");
        const price = Number(cleaned);

        if (isNaN(price)) {
          return <p className="text-[#7A7D83] text-base font-normal">--</p>;
        }

        return (
          <p className="text-[#7A7D83] text-base font-normal">
            $
            {price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        );
      },
    },
    {
      header: "Change",
      key: "change",
      align: "right",
      width: "13%",
      render: (row) => (
        <span
          className={`px-[10px] py-[6px] rounded-[5px] text-sm font-medium inline-flex items-center gap-[5px]
          ${row.up ? "bg-[#25C866]" : "bg-[#C82525]"} text-white`}
        >
          <img
            src={up}
            alt="icon"
            className={`${row.up ? "" : "rotate-180"}`}
          />
          {row.change}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
      <div className="px-5 pt-5 pb-[15px]">
        <h3 className="tet-xl text-[#25C866] font-semibold mb-[15px]">
          Assets
        </h3>
      </div>
      {loading || !socketLoaded ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : (
        <CommonTable data={assets} columns={columns} />
      )}
    </div>
  );
}

export default AssetsTab;
