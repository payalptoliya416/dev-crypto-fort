import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d3 from "@/assets/d3.png";
import d4 from "@/assets/d4.png";
import d5 from "@/assets/d5.png";
import d6 from "@/assets/d6.png";
import d7 from "@/assets/d7.png";
import d8 from "@/assets/d8.png";
import up from "@/assets/up.svg";
import CommonTabs from "../../component/CommonTabs";
import CommonTable, { type Column } from "../../component/CommonTable";

interface Asset {
  name: string;
  symbol: string;
  price: string;
  balance: string;
  change: string;
  up: boolean;
  icon: string;
}

const assets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    balance: "1.2345 ETH",
    price: "$2,435.20",
    change: "+2.5%",
    up: true,
    icon: d1,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.0421 BTC",
    price: "$62,880.00",
    change: "+1.2%",
    up: true,
    icon: d2,
  },
  {
    name: "Binance",
    symbol: "BNB",
    balance: "3.85 BNB",
    price: "$320.00",
    change: "-0.8%",
    up: false,
    icon: d3,
  },
  {
    name: "Solana",
    symbol: "SOL",
    balance: "12.44 SOL",
    price: "$143.20",
    change: "+4.5%",
    up: true,
    icon: d4,
  },
  {
    name: "Tether",
    symbol: "USDT",
    balance: "520 USDT",
    price: "$1.0",
    change: "+1.8%",
    up: true,
    icon: d5,
  },
  {
    name: "Arbitrum One",
    symbol: "ARB",
    balance: "420.00 ARB",
    price: "$1.08",
    change: "1.6%",
    up: true,
    icon: d6,
  },
  {
    name: "XRP Ledger",
    symbol: "XRP",
    balance: "900.00 XRP",
    price: "$0.56",
    change: "0.3%",
    up: true,
    icon: d7,
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    balance: "1,200 DOGE",
    price: "$0.08",
    change: "1.1%",
    up: true,
    icon: d8,
  },
];

function Balance() {
  const tabs = ["Favorites", "Top", "Popular", "Token price", "New token"];
  const [activeTab, setActiveTab] = useState("Favorites");

  const columns: Column<Asset>[] = [
    {
      header: "Name",
      key: "name",
      render: (row: any) => (
        <div className="flex items-center gap-[10px]">
          <img src={row.icon} alt="icon" />
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
        {row.balance}
      </p>
    ),
  },
    {
      header: "Last Price",
      key: "price",
      align: "right",
      width: "13%",
      render: (row: any) => (
        <p className="text-[#7A7D83]  text-base font-normal">{row.price}</p>
      ),
    },
    {
      header: "Change",
      key: "change",
      align: "right",
      width: "13%",
      render: (row: any) => (
        <span
          className={`px-[10px] py-[6px] rounded-[5px] text-sm font-medium inline-flex items-center gap-[5px] w-full max-w-[65px]
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
        <CommonTable data={assets} columns={columns} />
      </div>
    </DashboardLayout>
  );
}

export default Balance;
