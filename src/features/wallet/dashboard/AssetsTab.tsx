import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d5 from "@/assets/d5.png";
import d3 from "@/assets/d3.png";
import d9 from "@/assets/d9.png";
import up from "@/assets/up.svg";
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

interface Asset {
  token: string;
  name: string;
  symbol: string;
  price: string;
  balance: string;
  change: string;
  up: boolean;
  icon: string;
}

function AssetsTab() {
  const [loading, setLoading] = useState(true);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetActionOpen, setAssetActionOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );

  const hasValidPrices = () => {
    const saved = localStorage.getItem("crypto_prices");
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
  const saved = localStorage.getItem("crypto_prices");
  const storedPrices = saved ? JSON.parse(saved) : {};

  setSocketLoaded(true);

  setAssets((prevAssets) => {
    const updated = prevAssets.map((asset) => {

      const match = data.prices.find(
        (p: any) =>
          String(p.symbol).toUpperCase() === String(asset.symbol).toUpperCase(),
      );

      const newPrice = Number(match.price);

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
        "crypto_prices",
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
        const savedPrices = localStorage.getItem("crypto_prices");
        const priceMap = savedPrices ? JSON.parse(savedPrices) : {};

        const assetList: Asset[] = Object.entries(balances)
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
              icon: config?.icon || d1,
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
      header: "Balance",
      key: "balance",
      align: "right",
      render: (row) => (
        <p className="text-[#7A7D83] text-base font-normal">
          {formatBalance(row.balance)} {row.symbol}
        </p>
      ),
    },
    {
      header: "Amount",
      key: "price",
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
          return <p className="text-[#7A7D83] text-base font-normal">--</p>;
        }

        const total = balance * price;

        return (
          <p className="text-[#7A7D83] text-base font-normal">
            ${formatBalance(total, { isFiat: true })}
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
      ${row.up ? "bg-[#25C866]" : "bg-[#C82525]"} text-white`}
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
        <CommonTable data={assets} columns={columns} onRowClick={(asset) => {
          setSelectedAsset(asset);
          setAssetActionOpen(true);
        }} />
      )}

      {assetActionOpen && selectedAsset && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
          <div
            onClick={() => setAssetActionOpen(false)}
            className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-[420px] rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]">
            <h3 className="text-[#25C866] font-semibold text-lg mb-4">{selectedAsset.name}</h3>
            <p className="text-[#7A7D83] mb-4">
              Balance: {formatBalance(selectedAsset.balance)} {selectedAsset.symbol}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setAssetActionOpen(false);
                  setSendOpen(true);
                }}
                className="py-3 rounded-xl bg-[#25C866] text-black font-semibold"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setAssetActionOpen(false);
                  setReceiveOpen(true);
                }}
                className="py-3 rounded-xl border border-[#3C3D47] text-white"
              >
                Receive
              </button>
            </div>
          </div>
        </div>
      )}

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
