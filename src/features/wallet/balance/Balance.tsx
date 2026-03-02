import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout";
import CommonTabs from "../../component/CommonTabs";
import CommonTable, { type Column } from "../../component/CommonTable";
import Loader from "../../component/Loader";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store/store";
import { getBalance } from "../../../api/walletApi";
import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d5 from "@/assets/d5.png";
import up from "@/assets/up.svg";
import { formatBalance } from "../../component/format";
import { io, Socket } from "socket.io-client";
import { useRef } from "react";
interface Asset {
  name: string;
  symbol: string;
  price: string;
  balance: string;
  change: string;
  up: boolean;
  icon: string;
}

function Balance() {
  const tabs = ["Favorites", "Top", "Popular", "Token price", "New token"];
  const [activeTab, setActiveTab] = useState("Favorites");

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const previousPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!activeWallet?.id) return;

    let socket: Socket;

    const init = async () => {
      try {
        const balanceRes = await getBalance({
          wallet_id: activeWallet.id,
          type: "all",
        });

        const balances = balanceRes?.data?.balance || {};

        socket = io("http://192.168.29.134:3001", {
          transports: ["websocket"],
        });
        socket.on("priceUpdate", (data: any) => {
          const priceMap: Record<string, number> = {};

          data?.prices?.forEach((item: any) => {
            if (item?.symbol && item?.price !== undefined) {
              priceMap[item.symbol] = Number(item.price);
            }
          });

          const createAsset = (
            name: string,
            symbol: string,
            balance: string,
            icon: string,
          ): Asset => {
            const incomingPrice = priceMap[symbol];

            const previousPrice = previousPrices.current[symbol];

            let currentPrice =
              incomingPrice !== undefined ? incomingPrice : previousPrice;

            let change = "0.00%";
            let up = true;

            // Calculate only if previous exists AND new incoming price exists
            if (
              previousPrice !== undefined &&
              incomingPrice !== undefined &&
              previousPrice !== 0
            ) {
              const diff = incomingPrice - previousPrice;
              const percentChange = (diff / previousPrice) * 100;

              change = `${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(2)}%`;
              up = percentChange >= 0;
            }

            // IMPORTANT: update previous only if new price came
            if (incomingPrice !== undefined) {
              previousPrices.current[symbol] = incomingPrice;
            }

            return {
              name,
              symbol,
              balance,
              price: currentPrice !== undefined ? `$${currentPrice}` : "",
              change,
              up,
              icon,
            };
          };

          const assetList: Asset[] = [
            createAsset("Bitcoin", "BTC", balances.btc, d2),
            createAsset("Ethereum", "ETH", balances.eth, d1),
            createAsset("Tether", "USDT", balances.usdt, d5),
          ];

          setAssets(assetList);
          setLoading(false);
        });
      } catch (err: any) {
        toast.error(err?.message || "Failed to load balance");
        setLoading(false);
      }
    };

    init();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
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
    <DashboardLayout>
      <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
        <div className="px-5 pt-5 pb-[15px]">
          <h3 className="tet-xl text-[#25C866] font-semibold mb-[15px]">
            Balance
          </h3>

          <CommonTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {loading ? (
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
