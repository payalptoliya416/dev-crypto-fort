import { FiEye, FiSearch } from "react-icons/fi";
import type { Column } from "../../components/CommonTable";
import CommonTable from "../../components/CommonTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAdminUsers,
  resetUser2FA,
  type OtherAccount,
} from "../../adminapi/adminUsers";
import { LuRefreshCcw } from "react-icons/lu";
import { TooltipWrapper } from "../../components/TooltipWrapper";

interface TableUser {
  id: number;
  ethAddress: string;
  btcAddress: string;
  ethBalance: number;
  btcBalance: number;
  otherAccounts: OtherAccount[];
  is2FAEnabled: boolean;
}

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<TableUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}.....${address.slice(-5)}`;
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getAdminUsers(pageNumber, search);

      const apiUsers = res?.data?.users || [];
      const mappedUsers = apiUsers.map((user) => ({
        id: user.id,
        ethAddress: user.main_account.eth_address,
        btcAddress: user.main_account.btc_address,
        ethBalance: user.main_account.eth_balance,
        btcBalance: user.main_account.btc_balance,
        otherAccounts: user.other_accounts,
        is2FAEnabled: !!user.main_account.is_2fa_enabled,
      }));

      setUsers(mappedUsers);

      setPage(res?.data?.pagination?.current_page || 1);
      setLastPage(res?.data?.pagination?.last_page || 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const confirmReset2FA = async () => {
    if (!selectedUserId) return;

    try {
      setConfirmLoading(true);

      const res = await resetUser2FA(selectedUserId);

      if (res?.message) {
        toast.success(res.message);
      } else {
        toast.success("2FA Reset Successfully");
      }

      await fetchUsers(page);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset 2FA");
    } finally {
      setConfirmLoading(false);
      setShowConfirm(false);
      setSelectedUserId(null);
    }
  };

  const columns: Column<TableUser>[] = [
    {
      header: "ETH Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.ethAddress)}
          className="cursor-pointer hover:text-[#25C866]"
        >
          {truncateAddress(row.ethAddress)}
        </span>
      ),
    },
    {
      header: "BTC Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.btcAddress)}
          className="cursor-pointer hover:text-[#25C866]"
        >
          {truncateAddress(row.btcAddress)}
        </span>
      ),
    },
    {
      header: "ETH Balance",
      accessor: (row) => `${row.ethBalance} ETH`,
    },
    {
      header: "BTC Balance",
      accessor: (row) => `${row.btcBalance} BTC`,
    },
    {
      header: "View",
      accessor: (row) => (
        <div className="flex items-center gap-4">
          <TooltipWrapper content="View Details">
            <FiEye
              onClick={() =>
                navigate("/admin/users/user-details", {
                  state: { accounts: row.otherAccounts },
                })
              }
              className="text-[#25C866] hover:text-[#25C866]/80 cursor-pointer"
            />
          </TooltipWrapper>

          {row.is2FAEnabled && (
            <TooltipWrapper content="Reset 2FA">
              <LuRefreshCcw
                onClick={() => {
                  setSelectedUserId(row.id);
                  setShowConfirm(true);
                }}
                className="text-[#25C866] hover:text-[#25C866]/80 cursor-pointer"
              />
            </TooltipWrapper>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-[#13213A] border border-[#24324D] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#24324D] flex-wrap gap-4">
          <h3 className="text-white text-lg font-semibold">Active Clients</h3>

          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search user..."
              className="pl-9 pr-4 py-2 text-sm bg-[#15243D] border border-[#24324D] rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <CommonTable
          columns={columns}
          data={users}
          loading={loading}
          page={page}
          lastPage={lastPage}
          onPageChange={(p) => setPage(p)}
        />
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
          {/* Background */}
          <div
            onClick={() => setShowConfirm(false)}
            className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="relative w-full max-w-md">
            <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]">
              <h3 className="text-white text-lg font-semibold mb-3">
                Reset 2FA
              </h3>

              <p className="text-[#7A7D83] text-sm mb-5">
                Are you sure you want to reset 2FA for this user?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-[#3C3D47] text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmReset2FA}
                  disabled={confirmLoading}
                  className={`px-4 py-2 rounded-lg font-semibold transition
    ${
      confirmLoading
        ? "bg-green-400 cursor-not-allowed opacity-70"
        : "bg-[#25C866] hover:bg-green-500 cursor-pointer"
    }
    text-white`}
                >
                  {confirmLoading ? "Resetting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
