import { BiSearch } from "react-icons/bi";
import logo from "@/assets/logo.png";
import logo2 from "@/assets/logo2.png";
import avtar from "@/assets/avtar.png";
import { Link, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import SettingsModal from "../dashboard/SettingsModal";
import AccountModal from "../dashboard/AccountModal";
import SendTokenModal from "../dashboard/SendTokenModal";
import ConfirmTransactionModal from "../dashboard/ConfirmTransactionModal";
import CreateWalletPopup from "../popup/CreateWalletPopup";
import RecoveryPhrasePopup from "../popup/RecoveryPhrasePopup";
import SecureWalletPopup from "../popup/SecureWalletPopup";
import ExistingWalletPopup from "../popup/ExistingWalletPopup";
import SeedPhrasePopup from "../popup/SeedPhrasePopup";
import PrivateKeyPopup from "../popup/PrivateKeyPopup";
import { logoutUser } from "../../../api/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { resetActiveWallet } from "../../../redux/activeWalletSlice";
import { persistor } from "../../../redux/store/store";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function TopHeader() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [walletFlowStep, setWalletFlowStep] = useState<
    null | "create" | "recovery" | "password" | "import" | "seed" | "private"
  >(null);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
    } catch (error) {
      console.log("Logout API failed");
    } finally {
      dispatch(resetActiveWallet());
      await persistor.purge();
      dispatch(logout());
      navigate("/login");
    }
  };

  const [isSmall, setIsSmall] = useState(window.innerWidth < 375);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 375);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* <div className="relative hidden sm:block">
              <BiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7D83]"
              />
              <input
                type="text"
                placeholder="Search..."
                className="border border-[#3C3D47] rounded-[10px] bg-[#161F37] py-[13px] pl-[41px] pr-[15px] placeholder:text-[#7A7D83] text-white text-base leading-[16px] focus:outline-none focus:border-[#25C866] h-[42px]
              "
              />
            </div> */}
      {/* <button className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47]  rounded-[10px] flex justify-center items-center relative cursor-pointer">
              <BiBell size={20} className="text-[#7A7D83]" />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button> */}

      <div className="w-full bg-[#0F1A2F] mb-[15px]">
        <div className="flex items-center justify-between rounded-xl bg-[#131F3A] p-4 sm:px-5 sm:py-[19px]  border border-[#3C3D47]">
          <Link
            to={token ? "/dashboard" : "/"}
            className={`flex items-center gap-2 z-10`}
          >
            <img
              src={isSmall ? logo2 : logo}
              alt="Secure Wallet"
              className="pe-1"
            />
          </Link>
          <Tooltip.Provider delayDuration={200}>
            <div className="flex items-center gap-2 sm:gap-[15px]">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47]  rounded-[10px] flex justify-center items-center cursor-pointer"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <IoSettingsOutline size={20} className="text-[#7A7D83]" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="bottom"
                  className="bg-[#202A43] text-white text-xs px-3 py-2 rounded-md shadow-lg"
                >
                  Settings
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link to="/balance"  className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47] rounded-[10px] flex justify-center items-center cursor-pointer">
                    <MdOutlineAccountBalanceWallet size={20} className="text-[#7A7D83]" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="bottom"
                  className="bg-[#202A43] text-white text-xs px-3 py-2 rounded-md shadow-lg"
                >
                  Assets
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link to="/transaction" className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47] rounded-[10px] flex justify-center items-center cursor-pointer">
                    <GoHistory size={20} className="text-[#7A7D83]" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="bottom"
                  className="bg-[#202A43] text-white text-xs px-3 py-2 rounded-md shadow-lg"
                >
                  History
                </Tooltip.Content>
              </Tooltip.Root>

              <div className="relative" ref={dropdownRef}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="w-10 sm:w-[42px] h-10 sm:h-[42px] bg-[#202A43] rounded-[10px] flex justify-center items-center cursor-pointer"
                    >
                      <img src={avtar} alt="Profile" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="bottom"
                    className="bg-[#202A43] text-white text-xs px-3 py-2 rounded-md shadow-lg"
                  >
                    Profile
                  </Tooltip.Content>
                </Tooltip.Root>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-[220px] rounded-xl bg-[#161F37] border border-[#3C3D47] shadow-lg z-[999] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#3C3D47]">
                      <p className="text-white font-semibold text-sm">
                        My Profile
                      </p>
                      <p className="text-[#7A7D83] text-xs">Wallet Settings</p>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setShowModal(true);
                        }}
                        className="px-4 py-3 text-left text-sm text-white hover:bg-[#202A43] transition cursor-pointer"
                      >
                        Accounts
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                        }}
                        disabled={loggingOut}
                        className="px-4 py-3 text-left text-sm text-red-400 hover:bg-[#202A43] transition cursor-pointer disabled:opacity-60 flex items-center gap-2"
                      >
                        {loggingOut ? (
                          <>
                            <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                            Logging out...
                          </>
                        ) : (
                          "Logout"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tooltip.Provider>
        </div>
        <div className="relative block sm:hidden mt-4">
          <BiSearch
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7D83]"
          />
          <input
            type="text"
            placeholder="Search..."
            className="border border-[#3C3D47] rounded-[10px] bg-[#161F37] py-[13px] pl-[41px] pr-[15px] placeholder:text-[#7A7D83] text-white text-base leading-[16px] focus:outline-none focus:border-[#25C866] h-[42px] w-full
                    "
          />
        </div>
      </div>
      {/* SIDEBAR */}
      {/* <button
                onClick={() => setSidebarOpen(true)}
                className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47] rounded-[10px] flex justify-center items-center cursor-pointer"
              >
                <HiOutlineBars3 size={20} className="text-[#7A7D83]" />
              </button> */}
      {/* {sidebarOpen && (
        <div className="fixed inset-0 z-[999] flex">
          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative w-[260px] bg-[#131F3A] h-full border-r border-[#3C3D47] p-5 z-10">
            <h2 className="text-white text-lg font-semibold mb-6">Menu</h2>

            <div className="flex flex-col gap-4">
              <button className="text-left text-white hover:text-[#25C866] transition">
                Assets
              </button>

              <button className="text-left text-white hover:text-[#25C866] transition">
                History
              </button>

              <button className="text-left text-white hover:text-[#25C866] transition">
                Settings
              </button>
            </div>
          </div>
        </div>
      )} */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* ---------------------- */}
      <AccountModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAddAccount={() => {
          setShowModal(false);
          setWalletFlowStep("create");
        }}
      />
      {/* ---------------------- */}
      <SendTokenModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onNext={() => {
          setSendOpen(false);
          setConfirmOpen(true);
        }}
      />
      {/* ---------------------- */}
      <ConfirmTransactionModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      {/* ---------------------- */}

      {walletFlowStep && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-5">
          {/* Overlay */}
          <div
            onClick={() => setWalletFlowStep(null)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full flex justify-center">
            {walletFlowStep === "create" && (
              <CreateWalletPopup
                onClose={() => setWalletFlowStep(null)}
                onNext={() => setWalletFlowStep("recovery")}
                onImport={() => setWalletFlowStep("import")}
              />
            )}

            {walletFlowStep === "recovery" && (
              <RecoveryPhrasePopup
                onNext={() => setWalletFlowStep("password")}
                onClose={() => setWalletFlowStep(null)}
              />
            )}

            {walletFlowStep === "password" && (
              <SecureWalletPopup
                onFinish={() => setWalletFlowStep(null)}
                onClose={() => setWalletFlowStep(null)}
              />
            )}

            {walletFlowStep === "import" && (
              <ExistingWalletPopup
                onSeedNext={() => setWalletFlowStep("seed")}
                onKeyNext={() => setWalletFlowStep("private")}
                onClose={() => setWalletFlowStep(null)}
              />
            )}

            {walletFlowStep === "seed" && (
              <SeedPhrasePopup
                onFinish={() => setWalletFlowStep(null)}
                onClose={() => setWalletFlowStep(null)}
              />
            )}

            {walletFlowStep === "private" && (
              <PrivateKeyPopup
                onFinish={() => setWalletFlowStep(null)}
                onClose={() => setWalletFlowStep(null)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
