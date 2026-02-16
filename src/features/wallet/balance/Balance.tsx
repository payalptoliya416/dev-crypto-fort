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
import up from "@/assets/up.svg";

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
      });

      const priceRes = await getLivePrices();
      const ethPrice = priceRes.ethereum.usd;
      const ethChange = priceRes.ethereum.usd_24h_change;

      const asset: Asset = {
        name: "Ethereum",
        symbol: "ETH",
        balance: balanceRes.data.formatted_balance,
        price: `$${ethPrice.toLocaleString()}`,
        change: `${ethChange.toFixed(2)}%`,
        up: ethChange >= 0,
        icon: d1,
      };

      setAssets([asset]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load balance");
    } finally {
      setLoading(false);
    }
  };

  fetchBalanceAndPrice();
  intervalId = setInterval(fetchBalanceAndPrice, 12000);

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
           {row.balance} ETH
        </p>
      ),
    },
    {
      header: "Last Price",
      key: "price",
      align: "right",
      width: "13%",
      render: (row) => (
        <p className="text-[#7A7D83] text-base font-normal">{row.price}</p>
      ),
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
        ) : (
          <CommonTable data={assets} columns={columns} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Balance;
