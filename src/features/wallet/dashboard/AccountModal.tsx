import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import {
  getWallets,
  updateWalletLabel,
  type Wallet,
} from "../../../api/walletApi";
import { useEffect, useState } from "react";
import Loader from "../../component/Loader";
import { formatBalance } from "../../component/format";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { setActiveWallet } from "../../../redux/activeWalletSlice";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onAddAccount: () => void;
  onUpdateWallet?: (wallet: Wallet) => void;
}

function AccountModal({ open, onClose, onAddAccount }: AccountModalProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleCopy = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    } catch {
      toast.error("Failed to copy!");
    }
  };
  const dispatch = useDispatch();
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const refreshWallets = async () => {
    try {
      setLoading(true);
      const res = await getWallets();
      if (res.success) {
        setWallets(res.data);

        // active wallet sync
        if (activeWallet) {
          const updated = res.data.find((w) => w.id === activeWallet.id);
          if (updated) {
            dispatch(setActiveWallet(updated));
          }
        }
      }
    } catch {
      toast.error("Failed to refresh wallets");
    } finally {
      setLoading(false);
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
        setLoading(true);
        const res = await getWallets();
        if (res.success) {
          setWallets(res.data);
          if (res.data.length > 0 && !activeWallet) {
            dispatch(setActiveWallet(res.data[0]));
          }
        }
      } catch {
        toast.error("Failed to load wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-5">
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
          <div
            className="
  rounded-2xl bg-[#161F37] border border-[#3C3D47]
  p-4 sm:p-5
  z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]
  max-h-[85vh] sm:max-h-[90vh]
  flex flex-col
"
          >
            <h3 className="text-[#25C866] font-medium text-base sm:text-lg mb-[15px]">
              Account
            </h3>

            {/* Account List */}
            <div className="space-y-3 overflow-y-auto scroll-thin flex-1 pr-1">
              {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                  <Loader />
                </div>
              ) : wallets.length > 0 ? (
                wallets.map((wallet, index) => (
                  <div
                    key={wallet.id}
                    onClick={() => dispatch(setActiveWallet(wallet))}
                    className={`
    border rounded-xl cursor-pointer
    p-4 sm:p-5
    ${
      activeWallet?.id === wallet.id
        ? "border-[#25C866] bg-[#25C86614]"
        : "border-[#25C8661A]"
    }
  `}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                      {/* LEFT */}
                      <div className="min-w-0">
                        <p className="text-white text-base sm:text-lg mb-1 truncate">
                          {wallet.label?.trim()
                            ? wallet.label
                            : `Account ${index + 1}`}
                        </p>
                        <p className="text-sm text-[#7A7D83] truncate">
                          {wallet.address.slice(0, 6)}...
                          {wallet.address.slice(-4)}
                        </p>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <p className="text-white text-base sm:text-lg whitespace-nowrap">
                          {formatBalance(wallet.balance)} ETH
                        </p>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect =
                                e.currentTarget.getBoundingClientRect();

                              setMenuPosition({
                                top: rect.bottom + 6,
                                left: rect.right - 170,
                              });

                              setOpenMenuId(
                                openMenuId === wallet.id ? null : wallet.id,
                              );
                            }}
                            className="
                          border border-[#FFFFFF0D] w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] rounded-xl flex justify-center items-center cursor-pointer"
                          >
                            <BsThreeDotsVertical
                              size={20}
                              className="text-[#7A7D83]"
                            />
                          </button>

                          {openMenuId === wallet.id && menuPosition && (
                            <div
                              style={{
                                top: menuPosition.top,
                                left: menuPosition.left,
                              }}
                              className="fixed w-[170px] rounded-xl bg-[#0F172A] border border-[#FFFFFF0D] shadow-lg
                            z-[9999]"
                            >
                              <button
                                onClick={() => {
                                  handleCopy(wallet.address);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#25C8661A] rounded-t-xl cursor-pointer"
                              >
                                Copy Address
                              </button>

                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setEditingWallet(wallet);
                                  setLabelInput(wallet.label || "");
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#25C8661A] rounded-b-xl cursor-pointer"
                              >
                                Update Label
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#7A7D83] text-sm">No accounts found</p>
              )}
            </div>

            <button
              onClick={onAddAccount}
              className="w-full mt-[30px] py-3 sm:py-[18px] rounded-xl bg-[#25C866] text-white font-bold hover:opacity-90 transition cursor-pointer text-base sm:text-lg"
            >
              Add New Account
            </button>
          </div>
        </div>
      </div>
      {editingWallet && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-2">
          <div className="w-full max-w-[420px] rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 shadow-xl">
            <h4 className="text-white text-base sm:text-lg font-medium mb-4">
              Update Wallet Label
            </h4>

            <input
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Enter wallet label"
              className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-[#3C3D47] text-white outline-none focus:border-[#25C866]"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingWallet(null)}
                disabled={updating}
                className="px-4 py-2 text-[#7A7D83] hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={updating}
                onClick={async () => {
                  if (!labelInput.trim()) {
                    toast.error("Label cannot be empty");
                    return;
                  }

                  try {
                    setUpdating(true);

                    const res = await updateWalletLabel({
                      id: editingWallet.id,
                      label: labelInput.trim(),
                    });

                    if (!res.success) {
                      toast.error("Failed to update label");
                      return;
                    }

                    toast.success("Label updated");

                    await refreshWallets();
                    setEditingWallet(null);
                  } catch (err: any) {
                    toast.error(
                      err?.errors?.id?.[0] || err?.message || "Update failed",
                    );
                  } finally {
                    setUpdating(false);
                  }
                }}
                className="px-6 py-2 rounded-xl bg-[#25C866] text-white font-medium disabled:opacity-60 cursor-pointer"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountModal;
