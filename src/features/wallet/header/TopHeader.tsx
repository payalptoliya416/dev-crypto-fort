import { BiBell, BiSearch } from "react-icons/bi";
import logo from "@/assets/logo.png";
import avtar from "@/assets/avtar.png";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import SettingsModal from "../dashboard/SettingsModal";

export default function TopHeader() {
    const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <>
    <div className="w-full bg-[#0F1A2F] mb-[15px]">
      <div
        className="flex items-center justify-between rounded-xl bg-[#131F3A] p-4 sm:px-5 sm:py-[19px]  border border-[#3C3D47]">
        {/* LEFT : LOGO + NAME */}
        <Link
          to="/"
          className={`flex items-center gap-2 z-10`}
        >
          <img
            src={logo}
            alt="Secure Wallet"
            className="h-6 sm:h-auto"
          />
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-[15px]">
          {/* SEARCH */}
          <div className="relative hidden sm:block">
            <BiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7D83]"
            />
            <input
              type="text"
              placeholder="Search..."
              className="border border-[#3C3D47] rounded-[10px] bg-[#161F37] py-[13px] pl-[41px] pr-[15px] placeholder:text-[#7A7D83] text-white text-base leading-[16px] focus:outline-none h-[42px]
              "
            />
          </div>

          {/* ICONS */}
          <button className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47]  rounded-[10px] flex justify-center items-center cursor-pointer"   onClick={() => setSettingsOpen(true)}>
            <IoSettingsOutline size={20} className="text-[#7A7D83]" />
          </button>

          <button className="w-10 sm:w-[42px] h-10 sm:h-[42px] border border-[#3C3D47]  rounded-[10px] flex justify-center items-center relative cursor-pointer">
            <BiBell size={20} className="text-[#7A7D83]" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* PROFILE */}
          <button className="w-10 sm:w-[42px] h-10 sm:h-[42px] bg-[#202A43] rounded-[10px] flex justify-center items-center relative cursor-pointer">
            <img src={avtar} alt="" />
          </button>
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
              className="border border-[#3C3D47] rounded-[10px] bg-[#161F37] py-[13px] pl-[41px] pr-[15px] placeholder:text-[#7A7D83] text-white text-base leading-[16px] focus:outline-none h-[42px] w-full
              "
            />
      </div>
    </div>
     <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
