import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
import type { Column } from "../../components/CommonTable";
import { getCustomTokens } from "../../adminapi/adminTransactions";
import AddCustomTokenModal from "./AddCustomTokenModal";
import { FaUsers } from "react-icons/fa";
import { TooltipWrapper } from "../../components/TooltipWrapper";
import toast from "react-hot-toast";
import { TbCopy } from "react-icons/tb";

interface CustomToken {
  id: number;
  name: string;
  symbol: string;
  contractAddress: string;
  icon: string;
}

function CustomTokenList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [data, setData] = useState<CustomToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const fetchTokens = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getCustomTokens(pageNumber, search);

      const mapped: CustomToken[] =
        res?.data?.tokens?.map((token) => ({
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          contractAddress: token.contract_address,
          icon: token.token_image_url,
        })) || [];

      setData(mapped);

      setPage(res?.data?.pagination?.current_page || 1);
      setLastPage(res?.data?.pagination?.last_page || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens(page);
  }, [page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTokens(1);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const columns: Column<CustomToken>[] = [
    {
      header: "Icon",
      accessor: (row) => (
        <img
          src={row.icon}
          alt={row.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    {
      header: "Token Name",
      accessor: "name",
    },
    {
      header: "Symbol",
      accessor: "symbol",
    },
    {
      header: "Contract Address",
      accessor: (row) => (
        <span
          onClick={() => handleCopy(row.contractAddress)}
          className="text-xs cursor-pointer hover:text-[#25C866] flex gap-2 items-center"
        >
          {truncateAddress(row.contractAddress)}
          <TbCopy />
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-3">
          <TooltipWrapper content="View Details">
            <button
              onClick={() =>
                navigate("/admin/custom-tokens/details", {
                  state: {
                    tokenId: row.id,
                  },
                })
              }
              className="text-blue-400 cursor-pointer"
            >
              <FaUsers size={24} className="text-[#25C866]" />
            </button>
          </TooltipWrapper>
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="bg-[#16233A] border border-[#24324D] shadow-lg rounded-[10px]">
          <div className="flex justify-between items-center p-5 border-b border-[#24324D]">
            <h3 className="text-lg font-semibold text-white">Custom Tokens</h3>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25C866] text-white font-medium hover:opacity-90 cursor-pointer"
            >
              <FiPlus /> Import Token
            </button>
          </div>

          <div className="p-5">
            <div className=" justify-end flex">
              <div className="relative mb-5">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />

                <input
                  type="search"
                  placeholder="Search token..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-[#24324D] bg-[#16233A] text-white rounded-lg text-sm sm:w-72 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

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
      </div>
      {showAddModal && (
        <AddCustomTokenModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchTokens(page);
          }}
        />
      )}
    </>
  );
}

export default CustomTokenList;
