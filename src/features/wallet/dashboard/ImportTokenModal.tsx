import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { isAddress } from "ethers";
import TokenDropdown, { type TokenOption } from "./TokenDropdown";
import Loader from "../../component/Loader";
import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import d3 from "@/assets/Binance.png";
import d9 from "@/assets/tron.svg";

const NETWORK_OPTIONS: TokenOption[] = [
  { value: "eth", label: "Ethereum", symbol: "ETH", icon: d1 },
  { value: "trc20", label: "TRC-20", symbol: "USDT", icon: d5 },
  { value: "usdt", label: "ERC-20", symbol: "USDT", icon: d5 },
  { value: "usdc", label: "USDC (ERC20)", symbol: "USDC", icon: d4 },
  { value: "btc", label: "Bitcoin", symbol: "BTC", icon: d2 },
  { value: "bnb", label: "Binance", symbol: "BNB", icon: d3 },
  { value: "trx", label: "TRON", symbol: "TRX", icon: d9 },
];

interface ImportTokenModalProps {
  open: boolean;
  onClose: () => void;
}

function ImportTokenModal({ open, onClose }: ImportTokenModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(NETWORK_OPTIONS[0].value);
  const [contractAddress, setContractAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [symbolError, setSymbolError] = useState("");
  const [decimalsError, setDecimalsError] = useState("");

  useEffect(() => {
    const address = contractAddress.trim();
    if (!address) {
      setAddressError("");
      return;
    }

    if (!isAddress(address)) {
      setAddressError("Invalid address");
    } else {
      setAddressError("");
    }
  }, [contractAddress]);

  const validateFields = () => {
    let valid = true;
    const symbol = tokenSymbol.trim();
    const decimals = tokenDecimals.trim();

    if (!symbol) {
      setSymbolError("Token symbol is required.");
      valid = false;
    } else if (symbol.length > 11) {
      setSymbolError("Symbol must be 11 characters or fewer.");
      valid = false;
    } else if (!/^[A-Za-z0-9_]+$/.test(symbol)) {
      setSymbolError("Symbol can only contain letters, numbers, or underscore.");
      valid = false;
    } else {
      setSymbolError("");
    }

    if (!decimals) {
      setDecimalsError("Token decimals are required.");
      valid = false;
    } else if (!/^[0-9]+$/.test(decimals)) {
      setDecimalsError("Decimals must be a whole number.");
      valid = false;
    } else {
      const decimalValue = Number(decimals);
      if (!Number.isInteger(decimalValue) || decimalValue < 0 || decimalValue > 18) {
        setDecimalsError("Decimals must be between 0 and 18.");
        valid = false;
      } else {
        setDecimalsError("");
      }
    }

    return valid;
  };

  const handleImport = async () => {
    if (!contractAddress.trim()) {
      setAddressError("Token contract address is required.");
      return;
    }

    if (addressError) {
      return;
    }

    if (!validateFields()) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onClose();
    }, 600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-[560px]">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-[#202A43] text-white border border-[#3C3D47] mb-3 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-4 sm:p-6 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto">
          <h3 className="text-[#25C866] font-medium text-xl mb-2">Import Custom Token</h3>
          <p className="text-sm text-[#7A7D83] mb-5">
            Select a network and paste a token contract address to import into your wallet.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9AA5B9] mb-2">Network</label>
              <TokenDropdown
                value={selectedNetwork}
                onChange={setSelectedNetwork}
                options={NETWORK_OPTIONS}
                placeholder="Select network"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9AA5B9] mb-2">Token contract address</label>
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
            </div>

            {contractAddress.trim() && !addressError && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#9AA5B9] mb-2">Token symbol</label>
                  <input
                    value={tokenSymbol}
                    onChange={(e) => {
                      setTokenSymbol(e.target.value);
                      if (symbolError) {
                        setSymbolError("");
                      }
                    }}
                    placeholder="e.g. MYTOKEN"
                    className={`w-full rounded-xl border px-4 py-3 text-white outline-none bg-[#161F37] ${symbolError ? "border-[#EF4444]" : "border-[#3C3D47]"}`}
                  />
                  {symbolError && (
                    <p className="text-[#EF4444] text-sm mt-2">{symbolError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9AA5B9] mb-2">Token decimal</label>
                  <input
                    value={tokenDecimals}
                    onChange={(e) => {
                      setTokenDecimals(e.target.value);
                      if (decimalsError) {
                        setDecimalsError("");
                      }
                    }}
                    placeholder="0"
                    inputMode="numeric"
                    className={`w-full rounded-xl border px-4 py-3 text-white outline-none bg-[#161F37] ${decimalsError ? "border-[#EF4444]" : "border-[#3C3D47]"}`}
                  />
                  {decimalsError && (
                    <p className="text-[#EF4444] text-sm mt-2">{decimalsError}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleImport}
              disabled={
                loading ||
                Boolean(addressError) ||
                !contractAddress.trim() ||
                Boolean(contractAddress.trim() && !addressError && (!tokenSymbol.trim() || !tokenDecimals.trim()))
              }
              className="w-full rounded-xl bg-[#25C866] py-3 text-sm font-semibold text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader /> : "Import token"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportTokenModal;
