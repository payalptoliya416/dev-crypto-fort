import { IoClose } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import { getWallets } from "../../../api/walletApi";

interface ReceiveTokenModalProps {
  open: boolean;
  onClose: () => void;
}

function ReceiveTokenModal({ open, onClose }: ReceiveTokenModalProps) {
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );

  const [wallets, setWallets] = useState<any[]>([]);

  const [selectedToken, setSelectedToken] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("eth");
 const address = selectedAddress;
  useEffect(() => {
    if (!open) return;  

    const fetchWallets = async () => {
      try {
        const res = await getWallets();
        if (res.success && res.data) {
          setWallets(res.data);
        }
      } catch {
        toast.error("Failed to load wallets");
      }
    };

    fetchWallets();
  }, [open]);
  useEffect(() => {
    if (!wallets.length || !activeWallet?.id) return;

    const currentWallet = wallets.find(
      (wallet) => wallet.id === activeWallet.id,
    );

    if (!currentWallet) return;

    if (selectedToken === "eth") {
      setSelectedAddress(currentWallet.address || "");
    } else if (selectedToken === "btc") {
      setSelectedAddress(currentWallet.btc_address || "");
    } else {
      setSelectedAddress("");
    }
  }, [selectedToken, wallets, activeWallet]);
useEffect(() => {
  if (open) {
    setSelectedToken("eth");
  }
}, [open]);
  const handleCopy = async () => {
    if (!address) {
      toast.error("Address not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    } catch {
      toast.error("Failed to copy!");
    }
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
            bg-[#202A43] text-white border border-[#3C3D47] mb-[10px]
            shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div
          className="rounded-2xl bg-[#161F37] border border-[#3C3D47] 
          p-6 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]  max-h-[90vh] overflow-y-auto"
        >
          <h3 className="text-[#25C866] font-medium text-base sm:text-lg mb-[15px]">
            Receive
          </h3>

          <div className="mb-6">
            <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
              Select Token
            </label>

            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-5 py-4 text-base sm:text-lg text-white outline-none"
            >
              <option value="">Select token</option>
              <option value="eth">Ethereum</option>
              <option value="btc">Bitcoin</option>
            </select>
          </div>

          <div className="flex justify-center mb-[30px]">
            <div className="border border-[#3C3D47] rounded-xl bg-[#202A43] p-4 sm:p-[26px]">
              {address && (
                <QRCode
                  value={address}
                  bgColor="#202A43"
                  fgColor="#ffffff"
                  size={180} // mobile
                  className="sm:hidden"
                />
              )}
              {address && (
                <QRCode
                  value={address}
                  bgColor="#202A43"
                  fgColor="#ffffff"
                  size={220} // desktop
                  className="hidden sm:block"
                />
              )}
            </div>
          </div>

          <div className="mb-[15px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <p className="text-white text-base sm:text-lg font-medium shrink-0">
                Your Address:
              </p>

              <div className="flex items-center gap-2 min-w-0 sm:max-w-[70%]">
                <p className="text-[#7A7D83] text-sm truncate flex-1 min-w-0">
                  {address || "--"}
                </p>

                <FiCopy
                  onClick={handleCopy}
                  className="shrink-0 cursor-pointer text-[#7A7D83] hover:text-white"
                />
              </div>
            </div>
          </div>

          <div className="border border-[#FFDD1D1A] bg-[#FFDD1D05] rounded-[6px] px-[15px] py-3 w-full sm:w-max">
            <p className="text-[#FFDD1D] text-base sm:text-lg font-medium">
              Only send ETH / ERC-20 tokens to this address.
            </p>
          </div>
          {/* <button
            className="w-full mt-[30px] py-3 sm:py-[18px] rounded-xl bg-[#25C866] 
            text-white font-bold hover:opacity-90 transition cursor-pointer text-base sm:text-lg"
          >
            Confirm &amp; Send
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default ReceiveTokenModal;
