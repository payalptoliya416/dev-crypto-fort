import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout";
import CommonTable, { type Column } from "../../component/CommonTable";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store/store";
import { getTransactions, type Transaction } from "../../../api/walletApi";
import d1 from "@/assets/d1.png";
import Loader from "../../component/Loader";

interface TransactionRow {
  name: string;
  address: string;
  amount: string;
  type: "Sent" | "Received";
  status: "Confirmed" | "Pending" | "Failed";
  icon: string;
}

function TransactionPage() {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWallet?.id) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await getTransactions({
          wallet_id: activeWallet.id,
          type: "all",
        });
        const mapTxStatus = (
          status: Transaction["txreceipt_status"],
        ): TransactionRow["status"] => {
          switch (status) {
            case "Success":
              return "Confirmed";
            case "Pending":
              return "Pending";
            default:
              return "Failed";
          }
        };
        const mapped: TransactionRow[] = res.data.map((tx: Transaction) => ({
          name: "Ethereum",
          address:
            tx.transaction_type === "Send" ? tx.to_address : tx.from_address,
          amount: `${tx.amount} ETH`,
          type: tx.transaction_type === "Send" ? "Sent" : "Received",
          status: mapTxStatus(tx.txreceipt_status),
          icon: d1,
        }));

        setRows(mapped);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeWallet?.id]);

  const columns: Column<TransactionRow>[] = [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-[10px]">
          <img src={row.icon} alt="icon" className="w-8 h-8" />
          <div>
            <p className="text-sm text-white font-medium mb-1">{row.name}</p>
            <p className="text-xs text-[#7A7D83]">
              {row.address.slice(0, 6)}...{row.address.slice(-4)}
            </p>
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
          <h3 className="tet-xl text-[#25C866] font-semibold">Transaction</h3>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">  
            <Loader />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-[#7A7D83] font-medium">
              No transactions found
            </p>
            <p className="text-sm text-[#434548] mt-2">
              This wallet does not have any transaction history yet.
            </p>
          </div>
        ) : (
          <CommonTable data={rows} columns={columns} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default TransactionPage;
