import { useState } from "react";
import { IoCheckmarkDone, IoClose } from "react-icons/io5";
import { isAddress } from "ethers";
import { importToken } from "../../../api/customToken";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ButtonLoader from "../../component/ButtonLoader";
import d1 from "@/assets/Ethereum.svg";
import d9 from "@/assets/tron.svg";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        setShowSuccessModal(true);
      }
      if (res.success) {
        // const importedAsset = {
        //   token: res.data.contract_address,
        //   name: res.data.name,
        //   symbol: res.data.symbol,
        //   balance: String(res.data.balance ?? "0"),
        //   network: res.data.network,
        //   contractAddress: res.data.contract_address,
        //   icon: res.data.network?.toLowerCase().includes("tron") ? d9 : d1,
        // };

        // const storedCustomTokens = (() => {
        //   try {
        //     const parsed = JSON.parse(localStorage.getItem("custom_wallet_tokens") || "[]");
        //     return Array.isArray(parsed) ? parsed : [];
        //   } catch {
        //     return [];
        //   }
        // })();

        // const mergedCustomTokens = [
        //   importedAsset,
        //   ...storedCustomTokens.filter((token: any) => token.contractAddress !== importedAsset.contractAddress),
        // ];

        // localStorage.setItem("custom_wallet_tokens", JSON.stringify(mergedCustomTokens));
        window.dispatchEvent(new CustomEvent("custom-token-imported"));

        toast.success(res.message || "Token imported successfully");
      } else {
        toast.error(res.message || "Failed to import token");
      }
    } catch (error: any) {
    const response = error;
      const errorMessage =
      response?.errors?.contract_address?.[0] ||
      response?.message ||
      error?.message ||
      "Something went wrong";
    setIsError(true);
  
    if (response?.data) {
      setTokenDetails(response.data);
    }
    setMessage(errorMessage);

  toast.error(errorMessage);
   
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
    <>
    {!showSuccessModal && (
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
            Import Token
          </h3>
          <p className="text-sm text-[#7A7D83] mb-5">
            Paste a token contract address to import into your wallet.
          </p>
         {!tokenDetails && (
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
            
          </div>
         )}
        </div>
      </div>
    </div>
    )}
    {showSuccessModal && tokenDetails && (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative w-full max-w-md rounded-2xl bg-[#161F37] border border-[#3C3D47] p-6">

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-[#25C866]/15 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#25C866] flex items-center justify-center">
                <IoCheckmarkDone className="text-white text-3xl" />
              </div>
            </div>
          </div>

          <h3 className="text-center text-white text-xl font-semibold">
            Token Imported Successfully
          </h3>

          <p className="text-center text-[#9AA5B9] mt-2">
            Your token has been added to the wallet.
          </p>

         <div className="mt-6">

  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#2E3A5C]">
    <img
      src={
        tokenDetails.network?.toLowerCase().includes("tron")
          ? d9
          : d1
      }
      alt={tokenDetails.symbol}
      className="w-14 h-14"
    />

    <div>
      <h4 className="text-white text-lg font-semibold">
        {tokenDetails.name}
      </h4>

      <p className="text-[#9AA5B9]">
        {tokenDetails.symbol}
      </p>
    </div>
  </div>

  <div className="space-y-4">

    <div className="flex justify-between">
      <span className="text-[#9AA5B9]">Network</span>
      <span className="text-white uppercase">
        {tokenDetails.network}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-[#9AA5B9]">Balance</span>
      <span className="text-[#25C866] font-semibold">
        {Number(tokenDetails.balance).toFixed(4)}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-[#9AA5B9]">Symbol</span>
      <span className="text-white">
        {tokenDetails.symbol}
      </span>
    </div>

    <div>
      <p className="text-[#9AA5B9] mb-2">
        Contract Address
      </p>

      <div className="rounded-lg bg-[#0D1428] border border-[#2E3A5C] p-3">
        <p className="text-white text-sm break-all">
          {tokenDetails.contract_address}
        </p>
      </div>
    </div>

  </div>
</div>

          <button
            onClick={resetModal}
            className="w-full mt-6 py-3 rounded-xl bg-[#25C866] text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    )}
    </>
  );
}

export default ImportTokenModal;
