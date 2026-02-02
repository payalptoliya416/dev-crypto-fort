import DashboardLayout from "../../layout/DashboardLayout";
import d1 from "@/assets/d1.png";
import d2 from "@/assets/d2.png";
import d3 from "@/assets/d3.png";
import d4 from "@/assets/d4.png";
import d5 from "@/assets/d5.png";
import d6 from "@/assets/d6.png";
import d7 from "@/assets/d7.png";
import d8 from "@/assets/d8.png";
import CommonTable, { type Column } from "../../component/CommonTable";

interface TransactionItem {
  name: string;
  address: string;
  amount: string;
  type: "Sent" | "Received";
  status: "Confirmed" | "Pending" | "Failed";
  icon: string;
}

const transactions: TransactionItem[] = [
  {
    name: "Ethereum",
    address: "0x9F...aD1",
    amount: "$2,435.20",
    type: "Sent",
    status: "Confirmed",
    icon: d1,
  },
  {
    name: "Bitcoin",
    address: "0x92...4C9",
    amount: "$62,880.00",
    type: "Received",
    status: "Pending",
    icon: d2,
  },
  {
    name: "Binance",
    address: "0x7B...F23",
    amount: "$320.00",
    type: "Received",
    status: "Failed",
    icon: d3,
  },
  {
    name: "Solana",
    address: "0xF8...9A3",
    amount: "$143.20",
    type: "Sent",
    status: "Confirmed",
    icon: d4,
  },
  {
    name: "Tether",
    address: "0x92...4C9",
    amount: "$1.0",
    type: "Received",
    status: "Confirmed",
    icon: d5,
  },
  {
    name: "Arbitrum One",
    address: "0x92...4C9",
    amount: "$1.08",
    type: "Received",
    status: "Failed",
    icon: d6,
  },
  {
    name: "XRP Ledger",
    address: "0xF8...9A3",
    amount: "$0.56",
    type: "Sent",
    status: "Confirmed",
    icon: d7,
  },
  {
    name: "Dogecoin",
    address: "DOG0x92...4C9E",
    amount: "$0.08",
    type: "Sent",
    status: "Pending",
    icon: d8,
  },
];

function Transaction() {
  const columns: Column<TransactionItem>[] = [
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
    header: "Amount",
    key: "amount",
    align: "right",
    render: (row) => (
      <p className="text-[#7A7D83] text-base font-normal">{row.amount}</p>
    ),
  },
  {
    header: "Type",
    key: "type",
    align: "right",
        width: "13%",
    render: (row) => (
      <p className="text-white text-base font-medium">{row.type}</p>
    ),
  },
   {
    header: "Status",
    key: "status",
    align: "right",
    width: "13%",
    render: (row) => (
      <span
        className={`px-[9px] py-[6px] rounded-[5px] text-sm font-medium inline-flex justify-center w-full max-w-[90px]
        ${
          row.status === "Confirmed"
            ? "bg-[#25C866] text-white"
            : row.status === "Pending"
            ? "bg-[#DEC015] text-[#161F37]"
            : "bg-[#C82525] text-white"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  ];
  return (
    <DashboardLayout>
      <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47]">
        <div className="px-5 pt-5 pb-[15px]">
          <h3 className="tet-xl text-[#25C866] font-semibold">
            Transaction
          </h3>
        </div>
     <CommonTable data={transactions} columns={columns} />
      </div>
    </DashboardLayout>
  );
}

export default Transaction;
