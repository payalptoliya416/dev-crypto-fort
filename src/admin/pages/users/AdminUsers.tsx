import { FiEye, FiSearch } from "react-icons/fi";
import type { Column } from "../../components/CommonTable";
import CommonTable from "../../components/CommonTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminUsers, type OtherAccount } from "../../adminapi/adminUsers";

interface TableUser {
  id: number;
  ethAddress: string;
  btcAddress: string;
  ethBalance: number;
  btcBalance: number;
  otherAccounts: OtherAccount[];
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
      ethAddress: user.main_account.address,
      btcAddress: user.main_account.btc_address,
      ethBalance: user.main_account.eth_balance,
      btcBalance: user.main_account.btc_balance,
      otherAccounts: user.other_accounts,
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
        <FiEye
          onClick={() =>
            navigate("/admin/users/user-details", {
              state: { accounts: row.otherAccounts },
            })
          }
          className="text-[#25C866] hover:text-[#25C866]/80 cursor-pointer"
        />
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
    </div>
  );
}

export default AdminUsers;
