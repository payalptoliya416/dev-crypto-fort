import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout";
import CommonTabs from "../../component/CommonTabs";
import CommonTable, { type Column } from "../../component/CommonTable";
import Loader from "../../component/Loader";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store/store";
import { getBalance, getLivePrices } from "../../../api/walletApi";
import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d5 from "@/assets/d5.png";
import up from "@/assets/up.svg";
import { formatBalance } from "../../component/format";

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

  useEffect(() => {
    if (!activeWallet?.id) return;

    let intervalId: ReturnType<typeof setInterval>;

    const fetchBalanceAndPrice = async () => {
      try {
        const balanceRes = await getBalance({
          wallet_id: activeWallet.id,
          type: "all",
        });

        let priceRes;

        try {
          priceRes = await getLivePrices();
        } catch {
          priceRes = {
            ethereum: { usd: 0, usd_24h_change: 0 },
            bitcoin: { usd: 0, usd_24h_change: 0 },
            tether: { usd: 0, usd_24h_change: 0 },
          };
        }

        const balances = balanceRes.data.balance;

        const assetList: Asset[] = priceRes.map((coin: any) => ({
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          balance:
            coin.id === "ethereum"
              ? balances.eth
              : coin.id === "bitcoin"
                ? balances.btc
                : balances.usdt,
          price: `$${coin.current_price}`,
          change: `${coin.price_change_percentage_1h_in_currency?.toFixed(2)}%`,
          up: coin.price_change_percentage_1h_in_currency >= 0,
          icon: coin.id === "ethereum" ? d1 : coin.id === "bitcoin" ? d2 : d5,
        }));

        setAssets(assetList);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceAndPrice();
    intervalId = setInterval(fetchBalanceAndPrice, 30000);

    return () => clearInterval(intervalId);
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

        if (!rawValue) {
          return <p className="text-[#7A7D83] text-base font-normal">--</p>;
        }

        // remove $ and commas if already formatted
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
