import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layout/DashboardLayout";
import CommonTable, { type Column } from "../../component/CommonTable";
import toast from "react-hot-toast";
import type { RootState } from "../../../redux/store/store";
import { getTransactions, type Transaction } from "../../../api/walletApi";
import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d3 from "@/assets/Binance.png";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import d9 from "@/assets/tron.svg";
import Loader from "../../component/Loader";
import { TbCopy } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { getDisplayTokenIcon } from "../utils/tokenIconUtils";

interface TransactionRow {
  name: string;
  from_address: string;
  to_address: string;
  hash: string;
  amount: string;
  type: "Sent" | "Received";
  status: "Confirmed" | "Pending" | "Failed";
  icon: string;
  currency?: string;
  timestamp: string;
  view?: string;

  is_swap?: boolean;
  token_transfers?: any[];
}

function TransactionPage() {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const [loading, setLoading] = useState(true);
  const [openSwapModal, setOpenSwapModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<TransactionRow | null>(null);

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
        const mapped: TransactionRow[] = res.data.map((tx: Transaction) => {
         const currency = tx.currency?.toUpperCase() || "ETH";

        const tokenMap: Record<string, { name: string; icon: string }> = {
          ETH: { name: "Ethereum", icon: d1 },
          BTC: { name: "Bitcoin", icon: d2 },
          USDT: { name: "Tether", icon: d5 },
          USDC: { name: "USDC (ERC20)", icon: d4 },
          TRX: { name: "Tron", icon: d9 },
          TRC20: { name: "Trc20", icon: d5 },
          BNB: { name: "Bnb", icon: d3 },
        };

        const isCustomToken = !tokenMap[currency];

        const symbol = isCustomToken ? "ETH" : currency;

      const tokenData = isCustomToken
  ? {
      name:
        tx.currency
          ? tx.currency.charAt(0).toUpperCase() +
            tx.currency.slice(1).toLowerCase()
          : "Token",
      icon: getDisplayTokenIcon(
        tx.currency?.toLowerCase() || "",
        d1
      ),
    }
  : tokenMap[currency];

          return {
            name: tokenData.name,

            from_address: tx.from_address,
            to_address: tx.to_address,
            hash: tx.hash,

            amount: `${tx.amount} ${symbol}`,

            type: tx.transaction_type === "Send" ? "Sent" : "Received",

            status: mapTxStatus(tx.txreceipt_status),

            icon: tokenData.icon,
            timestamp: tx.timestamp,

            is_swap: tx.is_swap,
            token_transfers: tx.token_transfers || [],
          };
        });
        setRows(mapped);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeWallet?.id]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getTokenIcon = (symbol: string) => {
    const icons: Record<string, string> = {
      ETH: d1,
      BTC: d2,
      USDT: d5,
      USDC: d4,
      TRX: d9,
      BNB: d3,
    };

    return icons[symbol?.toUpperCase()] || d1;
  };

  const filteredRows = rows.filter((row) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return [
      row.name,
      row.hash,
      row.from_address,
      row.to_address,
      row.amount,
      row.type,
      row.status,
    ].some((value) => value.toLowerCase().includes(query));
  });

  const columns: Column<TransactionRow>[] = [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <div className="flex items-start md:items-center gap-[10px]">
          <img src={row.icon} alt="icon" className="" />
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <p className="text-sm text-white font-medium mb-1">{row.name}</p>

            {row.is_swap && (row.token_transfers?.length ?? 0) > 0 && (
                <button
                  onClick={() => {
                    setSelectedSwap(row);
                    setOpenSwapModal(true);
                  }}
                  className="
                px-2 py-1 rounded-lg
                text-[#25C866]
                text-xs cursor-pointer
                font-semibold
                border border-[#25C8661A]
              "
                >
                  View Swap
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#7A7D83]">
                  Tx: {row.hash.slice(0, 6)}...{row.hash.slice(-4)}
                </p>
                <TbCopy
                  className="text-[#7A7D83] cursor-pointer hover:text-white"
                  size={14}
                  onClick={() => handleCopy(row.hash)}
                />
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-[#7A7D83]">
                  From: {row.from_address.slice(0, 6)}...
                  {row.from_address.slice(-4)}
                </p>
                <TbCopy
                  className="text-[#7A7D83] cursor-pointer hover:text-white"
                  size={14}
                  onClick={() => handleCopy(row.from_address)}
                />
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-[#7A7D83]">
                  To: {row.to_address.slice(0, 6)}...{row.to_address.slice(-4)}
                </p>
                <TbCopy
                  className="text-[#7A7D83] cursor-pointer hover:text-white"
                  size={14}
                  onClick={() => handleCopy(row.to_address)}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      key: "timestamp",
      render: (row) => {
        const date = new Date(row.timestamp);
        return (
          <p className="text-[#7A7D83] text-sm font-normal">
            {isNaN(date.getTime()) ? "N/A" : date.toLocaleString()}
          </p>
        );
      },
    },
    {
      header: "Amount",
      key: "amount",
      align: "right",
      render: (row) => (
        <p className="text-[#FAFAFB] text-base font-normal">{row.amount}</p>
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
                : "bg-[#DC2626] text-white"
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
        <div className="px-5 pt-5 pb-[15px] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="tet-xl text-[#25C866] font-semibold">Transaction</h3>

          <div className="flex items-center text-white gap-4">
            <label htmlFor="transaction-search" className="block">
              Search:
            </label>
            <input
              id="transaction-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions"
              className="w-full rounded-lg border border-[#3C3D47] px-3 py-2 text-sm text-white outline-none placeholder:text-[#7A7D83] md:max-w-[200px]"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-[#7A7D83] font-medium">
              {searchQuery ? "No matching transactions found" : "No transactions found"}
            </p>
            <p className="text-sm text-[#434548] mt-2">
              {searchQuery
                ? "Try a different search term."
                : "This wallet does not have any transaction history yet."}
            </p>
          </div>
        ) : (
          <CommonTable data={filteredRows} columns={columns} />
        )}

        {openSwapModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <div
              onClick={() => setOpenSwapModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <div
              className=" relative w-full max-w-[520px]
            rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 max-h-[85vh]
            overflow-y-auto  scroll-thin"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-lg font-semibold">
                  Swap Transaction
                </h3>
                <button
                  onClick={() => setOpenSwapModal(false)}
                  className="w-9 h-9 rounded-full bg-[#202A43] flex items-center justify-center cursor-pointer"
                >
                  <IoClose className="text-white text-xl" />
                </button>
              </div>
              <div className="space-y-4">
                {selectedSwap?.token_transfers?.map((token, index) => (
                  <div
                    key={index}
                    className="
                        bg-[#0F172A]
                        border border-[#2E3A5C]
                        rounded-2xl
                        p-4
                      "
                  >
                    {/* Top */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={getTokenIcon(token.token_symbol)}
                        alt="token"
                      />

                      <div>
                        <p className="text-white font-semibold">
                          {token.token_symbol}
                        </p>

                        <p className="text-[#7A7D83] text-xs">Token Transfer</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#7A7D83] text-sm">Amount</p>

                      <p className="text-white font-semibold">
                         {Number(token.amount).toString()} {token.token_symbol}
                      </p>
                    </div>

                    {/* From */}
                    <div className="flex items-center justify-between mb-3 gap-3">
                      <p className="text-[#7A7D83] text-sm">From</p>

                      <div className="flex items-center gap-2">
                        <p className="text-white text-xs">
                          {token.from_address.slice(0, 8)}...
                          {token.from_address.slice(-6)}
                        </p>

                        <TbCopy
                          className="text-[#7A7D83] cursor-pointer hover:text-white"
                          size={14}
                          onClick={() => handleCopy(token.from_address)}
                        />
                      </div>
                    </div>

                    {/* To */}
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[#7A7D83] text-sm">To</p>

                      <div className="flex items-center gap-2">
                        <p className="text-white text-xs">
                          {token.to_address.slice(0, 8)}...
                          {token.to_address.slice(-6)}
                        </p>

                        <TbCopy
                          className="text-[#7A7D83] cursor-pointer hover:text-white"
                          size={14}
                          onClick={() => handleCopy(token.to_address)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TransactionPage;
