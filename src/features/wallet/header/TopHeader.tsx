import { BiBell, BiSearch } from "react-icons/bi";
import logo from "@/assets/logo.png";
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

export default function TopHeader() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [walletFlowStep, setWalletFlowStep] = useState<
    null | "create" | "recovery" | "password" | "import" | "seed" | "private"
  >(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      const res = await logoutUser(true);

      if (res?.success) {
        console.log(res.message);
      }
      localStorage.removeItem("token");

      navigate("/login");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  return (
    <>
      <div className="w-full bg-[#0F1A2F] mb-[15px]">
        <div className="flex items-center justify-between rounded-xl bg-[#131F3A] p-4 sm:px-5 sm:py-[19px]  border border-[#3C3D47]">
          {/* LEFT : LOGO + NAME */}
          <Link to="/" className={`flex items-center gap-2 z-10`}>
            <img src={logo} alt="Secure Wallet" className="h-6 sm:h-auto" />
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-[15px]">
            {/* SEARCH */}
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

            {/* ICONS */}
            <button
              className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47]  rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={() => setSettingsOpen(true)}
            >
              <IoSettingsOutline size={20} className="text-[#7A7D83]" />
            </button>

            <button className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47]  rounded-[10px] flex justify-center items-center relative cursor-pointer">
              <BiBell size={20} className="text-[#7A7D83]" />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* PROFILE */}
            <div className="relative" ref={dropdownRef}>
              {/* PROFILE BUTTON */}
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="w-10 sm:w-[42px] h-10 sm:h-[42px] bg-[#202A43]
    rounded-[10px] flex justify-center items-center cursor-pointer"
              >
                <img src={avtar} alt="Profile" />
              </button>

              {/* DROPDOWN MENU */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-3 w-[220px] rounded-xl bg-[#161F37] border border-[#3C3D47]
        shadow-lg z-[999] overflow-hidden"
                >
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
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="px-4 py-3 text-left text-sm text-red-400 hover:bg-[#202A43] transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
