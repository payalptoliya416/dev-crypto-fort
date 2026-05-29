import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { isAddress } from "ethers";
import { importToken } from "../../../api/customToken";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ButtonLoader from "../../component/ButtonLoader";
interface ImportTokenModalProps {
  open: boolean;
  onClose: () => void;
}

function ImportTokenModal({ open, onClose }: ImportTokenModalProps) {
  const [contractAddress, setContractAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const validAddress = isAddress(contractAddress.trim());
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    try {
      setLoading(true);

      const address = contractAddress.trim();

      if (!address) {
        setAddressError("Token contract address is required.");
        return;
      }

      if (!isAddress(address)) {
        setAddressError("Invalid address");
        return;
      }

      if (!activeWallet?.id) return;

      const res = await importToken({
        wallet_id: activeWallet.id,
        contract_address: address,
      });
      setMessage(res.message);
      setIsError(!res.success);
      if (res.data) {
        setTokenDetails(res.data);
      }

      if (res.success) {
        toast.success(res.message || "Token imported successfully");
        console.log(res.data);
      } else {
        toast.error(res.message || "Failed to import token");
      }
    } catch (error: any) {
      const response = error?.data;

      setIsError(true);

      if (response) {
        setTokenDetails(response);
      }

      setMessage(response?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setContractAddress("");
    setAddressError("");
    setTokenDetails(null);
    setMessage("");
    setIsError(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
      <div
        onClick={resetModal}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm "
      />
      <div className="relative w-full max-w-[560px]">
        <div className="flex justify-end">
          <button
            onClick={resetModal}
            className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-[#202A43] text-white border border-[#3C3D47] mb-3 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-4 sm:p-6 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto">
          <h3 className="text-[#25C866] font-medium text-xl mb-2">
            Import Custom Token
          </h3>
          <p className="text-sm text-[#7A7D83] mb-5">
            Paste a token contract address to import into your wallet.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9AA5B9] mb-2">
                Token contract address
              </label>
              <input
                value={contractAddress}
                onChange={(e) => {
                  setContractAddress(e.target.value);
                  if (addressError) {
                    setAddressError("");
                  }
                }}
                placeholder="0x..."
                className={`w-full rounded-xl border px-4 py-3 text-white outline-none bg-[#161F37] ${addressError ? "border-[#EF4444]" : "border-[#3C3D47]"}`}
              />
              {addressError && (
                <p className="text-[#EF4444] text-sm mt-2">{addressError}</p>
              )}
              {contractAddress.trim() && !validAddress && (
                <p className="text-yellow-500 text-sm mt-2">
                  Please enter a valid contract address
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={loading || !contractAddress.trim() || !validAddress}
              className="w-full rounded-xl bg-[#25C866] py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center min-h-11 cursor-pointer"
            >
              {loading ? <ButtonLoader /> : "Import token"}
            </button>
            {message && (
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                  isError
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20"
                }`}
              >
                <span>{message}</span>
              </div>
            )}
            {tokenDetails && (
              <div className="mt-4 rounded-2xl border border-[#2E3A5C] bg-[#111A33] p-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#2E3A5C]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25C866]/15">
                    <span className="text-[#25C866] text-lg font-bold">
                      {tokenDetails.symbol?.charAt(0) || "T"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {tokenDetails.name}
                    </h4>
                    <p className="text-[#9AA5B9] text-sm">
                      {tokenDetails.symbol}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9AA5B9]">Network</span>
                    <span className="text-white font-medium uppercase">
                      {tokenDetails.network}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#9AA5B9]">Balance</span>
                    <span className="text-[#25C866] font-semibold">
                      {Number(tokenDetails.balance).toFixed(4)}
                    </span>
                  </div>

                  <div>
                    <p className="text-[#9AA5B9] mb-2">Contract Address</p>

                    <div className="rounded-lg bg-[#0D1428] border border-[#2E3A5C] p-3">
                      <p className="text-white text-sm break-all">
                        {tokenDetails.contract_address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportTokenModal;
