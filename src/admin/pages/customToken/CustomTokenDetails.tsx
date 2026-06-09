import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
import type { Column } from "../../components/CommonTable";
import { getCustomTokenDetails } from "../../adminapi/adminTransactions";
import { TbCopy } from "react-icons/tb";
import toast from "react-hot-toast";

interface Token {
  id: number;
  network: string;
  contract_address: string;
  name: string;
  symbol: string;
  decimals: number;
  is_eth: boolean;
  token_image_url: string;
  created_at: string;
}

interface User {
  id: number | string;
  balance_id: number;
  wallet_id: number;
  eth_address: string;
  user_id: number;
  user_name: string | null;
  user_email: string | null;
  balance: string;
  updated_at: string;
}

function CustomTokenDetails() {
  const location = useLocation();

  const tokenId = location.state?.tokenId;
  const [token, setToken] = useState<Token | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const truncateAddress = (address: string) =>
    `${address.slice(0, 8)}...${address.slice(-6)}`;

  const fetchTokenDetails = async (pageNumber = 1) => {
    try {
      setLoading(true);

      if (!tokenId) return;

      const res = await getCustomTokenDetails(tokenId, pageNumber, "");
      const mappedUsers: User[] = (res.data.users || []).map((user) => ({
        id: user.balance_id,
        balance_id: user.balance_id,
        wallet_id: user.wallet_id,
        eth_address: user.eth_address,
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        balance: user.balance,
        updated_at: user.updated_at,
      }));

      setToken(res.data.token);
      setUsers(mappedUsers);

      setPage(res.data.pagination.current_page || 1);

      setLastPage(res.data.pagination.last_page || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenDetails();
  }, [tokenId]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const columns: Column<User>[] = [
    {
      header: "ETH Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.eth_address)}
          className="text-xs cursor-pointer hover:text-[#25C866] flex gap-2 items-center"
        >
          {truncateAddress(row.eth_address)}
          <TbCopy />
        </span>
      ),
    },
    {
      header: "Balance",
      accessor: "balance",
    },
    {
      header: "Updated At",
      accessor: (row) => new Date(row.updated_at).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      {token && (
        <div className="bg-[#16233A] border border-[#24324D] rounded-[10px] p-5">
          <div className="flex items-center gap-3">
            <img
              src={token.token_image_url}
              alt={token.name}
              className="w-20 h-20 rounded-full object-cover border border-[#24324D]"
            />

            <div>
              <h2 className="text-lg sm:text-2xl font-semibold text-white">
                {token.name}
              </h2>

              <p className="text-[#25C866] mt-1">{token.symbol}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div>
              <p className="text-gray-400 text-sm">Network</p>

              <p className="text-white mt-1 uppercase">{token.network}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Decimals</p>

              <p className="text-white mt-1">{token.decimals}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">Contract Address</p>

              <p className="text-white mt-1 break-all">
                {token.contract_address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#16233A] border border-[#24324D] rounded-[10px]">
        <div className="p-5 border-b border-[#24324D]">
          <h3 className="text-lg font-semibold text-white">
            Users Holding This Token
          </h3>
        </div>

        <CommonTable
          columns={columns}
          data={users}
          loading={loading}
          page={page}
          lastPage={lastPage}
          onPageChange={(p) => fetchTokenDetails(p)}
        />
      </div>
    </div>
  );
}

export default CustomTokenDetails;
