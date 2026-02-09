import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { getWallets, type Wallet } from "../../../api/walletApi";
import { useEffect, useState } from "react";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onAddAccount: () => void;
  onUpdateWallet?: (wallet: Wallet) => void;
}

function AccountModal({ open, onClose, onAddAccount }: AccountModalProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    } catch {
      toast.error("Failed to copy!");
    }
  };
useEffect(() => {
  const closeMenu = () => setOpenMenuId(null);
  window.addEventListener("click", closeMenu);
  return () => window.removeEventListener("click", closeMenu);
}, []);
  useEffect(() => {
    if (!open) return;

    const fetchWallets = async () => {
      try {
        const res = await getWallets();
        if (res.success) {
          setWallets(res.data);
        }
      } catch {
        toast.error("Failed to load wallets");
      }
    };

    fetchWallets();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center  overflow-y-auto p-5">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-[560px]">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202A43] text-white hover:bg-[#2a3553] border border-[#3C3D47] mb-[10px] shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>
        <div className=" rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] max-h-[90vh] flex flex-col">
          <h3 className="text-[#25C866] font-medium text-lg mb-[15px]">
            Account
          </h3>

          {/* Account List */}
          <div className="space-y-3 overflow-y-auto scroll-thin flex-1 pr-1">
            {wallets.map((wallet, index) => (
              <div
               key={wallet.id}
               className="flex justify-between items-center p-5 rounded-xl border border-[#25C8661A] bg-transparent"
              >
                {/* Left */}
                <div>
                  <p className="text-white text-lg font-normal mb-[5px]">
                    {wallet.label?.trim()
                      ? wallet.label
                      : `Account ${index + 1}`}
                  </p>
                  <p className="text-sm text-[#7A7D83]">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  {/* <p className="text-white text-lg">{wallet.balance}</p> */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === wallet.id ? null : wallet.id);
                    }}
                      className="border border-[#FFFFFF0D] w-[46px] h-[46px] rounded-[14px] flex justify-center items-center cursor-pointer"
                    >
                      <BsThreeDotsVertical
                        size={20}
                        className="text-[#7A7D83]"
                      />
                    </button>
                    {openMenuId === wallet.id && (
                      <div className="absolute right-0 top-[52px] w-[170px] rounded-xl bg-[#0F172A] border border-[#FFFFFF0D] shadow-lg z-50">
                        <button
                          onClick={() => {
                            handleCopy(wallet.address);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#25C8661A] rounded-t-xl cursor-pointer">
                          Copy Address
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#25C8661A] rounded-b-xl cursor-pointer">
                          Update Label
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onAddAccount}
            className="w-full mt-[30px] py-[18px] rounded-xl bg-[#25C866] text-white font-bold hover:opacity-90 transition cursor-pointer text-lg"
          >
            Add New Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountModal;
