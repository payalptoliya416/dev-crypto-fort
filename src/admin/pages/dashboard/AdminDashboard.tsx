import { useEffect, useState } from "react";
import type { Column } from "../../components/CommonTable";
import CommonTable from "../../components/CommonTable";
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAdminTransactions } from "../../adminapi/adminTransactions";

interface Transaction {
  id: number;
  currency: string;
  hash: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  transactionType: string;
  status: string;
}

function AdminDashboard() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchTransactions = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getAdminTransactions(pageNumber, search);

      const apiTransactions = res?.data?.transactions || [];

      const mapped: Transaction[] = apiTransactions.map((tx) => ({
        id: tx.id,
        currency: tx.currency,
        hash: tx.hash,
        fromAddress: tx.from_address,
        toAddress: tx.to_address,
        amount: tx.amount,
        transactionType: tx.transaction_type,
        status: tx.txreceipt_status,
      }));

      setData(mapped);

      setPage(res?.data?.pagination?.current_page || 1);
      setLastPage(res?.data?.pagination?.last_page || 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTransactions(1);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}.....${address.slice(-5)}`;
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };
  const columns: Column<Transaction>[] = [
    {
      header: "Currency",
      accessor: "currency",
    },
    {
      header: "Hash",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.hash)}
          className="text-xs cursor-pointer hover:text-[#25C866]"
        >
          {truncateAddress(row.hash)}
        </span>
      ),
    },
    {
      header: "From Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.fromAddress)}
          className="text-xs cursor-pointer hover:text-[#25C866]"
        >
          {truncateAddress(row.fromAddress)}
        </span>
      ),
    },
    {
      header: "To Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.toAddress)}
          className="text-xs cursor-pointer hover:text-[#25C866]"
        >
          {truncateAddress(row.toAddress)}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: (row) => `${row.amount} ${row.currency}`,
    },
    {
      header: "Type",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.transactionType === "Receive"
              ? " text-green-400"
              : " text-red-400"
          }`}
        >
          {row.transactionType}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.status === "Success"
              ? "bg-green-600/20 text-green-400"
              : "bg-red-600/20 text-red-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-[#16233A] border border-[#24324D] shadow-lg rounded-[10px]">
        {/* Header */}
        <div className="sm:flex justify-between items-center p-5 border-b border-bordercolor flex-wrap sm:gap-4">
          <h3 className="text-lg font-semibold text-white mb-3 sm:mb-0">
            Transactions History
          </h3>

          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-[#24324D] bg-[#16233A] text-white rounded-lg text-sm sm:w-72 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <CommonTable
          columns={columns}
          data={data}
          loading={loading}
          page={page}
          lastPage={lastPage}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
