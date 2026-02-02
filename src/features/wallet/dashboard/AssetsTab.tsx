import { useState } from "react";
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
  change: string;
  up: boolean;
  icon: string;
}

const assets = [
  { name: "Ethereum", symbol: "ETH", price: "$2,435.20", change: "+2.5%", up: true, icon: d1 },
  { name: "Bitcoin", symbol: "BTC", price: "$62,880.00", change: "+1.2%", up: true, icon: d2 },
  { name: "Binance", symbol: "BNB", price: "$320.00", change: "-0.8%", up: false, icon: d3 },
  { name: "Solana", symbol: "SOL", price: "$143.20", change: "+4.5%", up: true, icon: d4 },
  { name: "Tether", symbol: "USDT", price: "$1.0", change: "+1.8%", up: true, icon: d5 },
  { name: "Arbitrum One", symbol: "ARB", price: "$1.08", change: "1.6%", up: true, icon: d6 },
  { name: "XRP Ledger", symbol: "XRP", price: "$0.56", change: "0.3%", up: true, icon: d7 },
  { name: "Dogecoin", symbol: "DOGE", price: "$0.08", change: "1.1%", up: true, icon: d8 },
];

function AssetsTab() {
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
      header: "Last Price",
      key: "price",
      align: "right",
      render: (row: any) => (
        <p className="text-[#7A7D83]  text-base font-normal">{row.price}</p>
      ),
    },
    {
      header: "Change",
      key: "change",
      align: "right",
      width: '13%',
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
    <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
      <div className="px-5 pt-5 pb-[15px]">
        <h3 className="tet-xl text-[#25C866] font-semibold mb-[15px]">
          Assets
        </h3>
        {/* <div
          className="flex gap-6 mt-4 border-b border-[#3C3D47] overflow-x-auto whitespace-nowrap scrollbar-hide
           sm:overflow-visible"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 pb-[15px] text-base transition  cursor-pointer
                ${
                  activeTab === tab
                    ? "text-white border-b-2 border-white  font-semibold"
                    : "text-[#7A7D83] hover:text-white font-normal"
                }
                `}
            >
              {tab}
            </button>
          ))}
        </div> */}
          <CommonTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    <CommonTable data={assets} columns={columns} />
    </div>
  );
}

export default AssetsTab;
