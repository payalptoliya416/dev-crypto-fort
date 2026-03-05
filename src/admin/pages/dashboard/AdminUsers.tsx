import { FiEye, FiSearch } from "react-icons/fi";
import type { Column } from "../../components/CommonTable";
import CommonTable from "../../components/CommonTable";
import toast from "react-hot-toast";

interface User {
  id: number;
  ethAddress: string;
  btcAddress: string;
  ethBalance: string;
  btcBalance: string;
}

function AdminUsers() {
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

  const users: User[] = [
    {
      id: 1,
      ethAddress: "0xH8z04K4324K432",
      btcAddress: "bc1q9xbc1q9x82k3",
      ethBalance: "2.45 ETH",
      btcBalance: "0.34 BTC",
    },
  ];

  const columns: Column<User>[] = [
    {
      header: "ETH Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.ethAddress)}
          className="cursor-pointer hover:text-[#25C866]"
          title="Click to copy"
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
          title="Click to copy"
        >
          {truncateAddress(row.btcAddress)}
        </span>
      ),
    },
    {
      header: "ETH Balance",
      accessor: "ethBalance",
    },
    {
      header: "BTC Balance",
      accessor: "btcBalance",
    },
    {
      header: "View",
      accessor: () => (
        <FiEye className="text-[#25C866] hover:text-[#25C866]/80 cursor-pointer" />
      ),
    },
  ];

  return (
    <div>
      <div className="bg-[#13213A] border border-[#24324D] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#24324D] flex-wrap gap-4">
          <h3 className="text-white text-lg font-semibold">Active Clients</h3>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />

              <input
                type="search"
                placeholder="Search by name or email..."
                className="pl-9 pr-4 py-2 text-sm bg-[#15243D] border border-[#24324D] rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <CommonTable columns={columns} data={users} />
      </div>
    </div>
  );
}

export default AdminUsers;
