import { useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";
import logo from "@/assets/logo.png";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");

  const menus = [
    "Home",
    "Security",
    "Features",
    "How It Works",
    "Open Source",
    "Docs",
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="container-custom mx-auto py-5 flex items-center justify-between text-white">
        {/* LOGO */}
        <a href="/">
          <img src={logo} alt="logo" className="cursor-pointer" />
        </a>

        <nav className="hidden xl:flex gap-[25px] text-base leading-[16px] font-medium text-[#F4F4F5]">
          {menus.map((item) => (
            <a
              key={item}
              href="/"
              onClick={() => setActive(item)}
              className={`
                relative group transition-all duration-300
                ${active === item ? "text-[#25C866]" : "hover:text-[#25C866] text-[#A8A9AD]"}
            `}
            >
              {item}

              {/* UNDERLINE */}
              <span
                className={`
                    absolute left-1/2 -translate-x-1/2 -bottom-2
                    h-[2px] rounded-full transition-all duration-300

                    ${
                      active === item
                        ? "w-[20px] bg-gradient-to-r from-transparent via-[#25C866] to-transparent blur-[0.5px]"
                        : "w-0 group-hover:w-[60px] bg-gradient-to-r from-transparent via-[#25C866] to-transparent"
                    }
                `}
              ></span>
            </a>
          ))}
        </nav>

        {/* BUTTONS */}
        <div className="hidden xl:flex gap-4">
          <button
            className="bg-[#25C866] rounded-xl text-white py-3 px-[22px] text-lg leading-[18px] font-semibold 
            transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#25C866] cursor-pointer"
          >
            Web Wallet
          </button>

          <button
            className="bg-[#FFFFFF0F] rounded-xl text-white py-3 px-[22px] text-lg leading-[18px] font-semibold 
            transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer"
          >
            Coming Soon
          </button>
        </div>

        {/* MOBILE */}
        <button className="xl:hidden" onClick={() => setOpen(!open)}>
          {open ? <IoIosCloseCircleOutline size={26} /> : <RiMenu3Fill size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
        <div
        className={`
          fixed top-0 right-0 h-full w-[75%] max-w-[320px]
          bg-[#0b1f1a]/40 backdrop-blur-xl
          transform transition-all duration-300 z-50

          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* CLOSE BUTTON */}
        <div className="flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <IoIosCloseCircleOutline size={32}  className="text-white"/>
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-5 px-6 mt-4 text-base">
          {menus.map((item) => (
            <a
              key={item}
              onClick={() => {
                setActive(item);
                setOpen(false);
              }}
              className={`
                transition-all duration-200
                ${active === item ? "text-[#25C866]" : "text-[#E4E4E7]"}
              `}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 px-6 mt-8">
          <button  className="bg-[#25C866] rounded-xl text-white py-3 px-[22px] text-lg leading-[18px] font-semibold 
            transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#25C866] cursor-pointer">
            Web Wallet
          </button>

          <button  className="bg-[#FFFFFF0F] rounded-xl text-white py-3 px-[22px] text-lg leading-[18px] font-semibold 
            transition-all duration-300 hover:bg-white/10 hover:scale-105 cursor-pointer">
            Coming Soon
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
