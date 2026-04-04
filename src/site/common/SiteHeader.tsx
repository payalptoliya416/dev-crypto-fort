import { useEffect, useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";
import logo from "@/assets/logo.png";
import headerbg from "@/assets/site/header.png";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";

type MenuItem = {
  name: string;
  id: string;
};
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");

const menus : MenuItem[] = [
  { name: "Home", id: "top" },
  { name: "Security", id: "security" },
  { name: "Features", id: "features" },
  { name: "How It Works", id: "howwork" },
  { name: "Platforms", id: "plateform" },
  { name: "Open Source", id: "openscouce" },
];

  const handleScroll = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // header height adjust
      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
   <header
  className={`
    fixed top-0 left-0 w-full z-50
    transition-all duration-300
    ${scrolled ? "shadow-lg" : ""}
  `}
  style={
    scrolled
      ? {
          backgroundImage: `url(${headerbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {}
  }
>
      <div className="container-custom mx-auto py-5 flex items-center justify-between text-white">
        {/* LOGO */}
        <Link to="/">
          <img src={logo} alt="logo" className="cursor-pointer" />
        </Link>

        <nav className="hidden xl:flex gap-[30px] text-base leading-[16px] font-medium text-[#F4F4F5]">
          {menus.map((item) => (
            <Link
             key={item.name}
              onClick={() => {
                setActive(item.name);
                handleScroll(item.id);
              }}
              to="/"
                className={`
                relative group transition-all duration-300
                ${
                  active === item.name
                    ? "text-[#25C866]"
                    : "hover:text-[#25C866] text-[#A8A9AD]"
                }
              `}
            >
              {item.name}

              {/* UNDERLINE */}
              <span
                className={`
                    absolute left-1/2 -translate-x-1/2 -bottom-2
                    h-[2px] rounded-full transition-all duration-300

                    ${
                      active === item.name
                        ? "w-[20px] bg-gradient-to-r from-transparent via-[#25C866] to-transparent blur-[0.5px]"
                        : "w-0 group-hover:w-[60px] bg-gradient-to-r from-transparent via-[#25C866] to-transparent"
                    }
                `}
              ></span>
            </Link>
          ))}
        </nav>

        {/* BUTTONS */}
        <div className="hidden xl:flex gap-4">
          <Link to="/"
            className="bg-[#25C866] rounded-xl text-white py-3 px-[22px] text-lg leading-[18px] font-semibold 
            transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[#25C866]/40"
          >
            Web Wallet
          </Link>

          <Link to="/"
            className="bg-[#FFFFFF0F] rounded-xl text-white py-3 px-[22px] text-lg leading-[18px] font-semibold 
             transition-all duration-300 ease-in-out border border-transparent hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-md"
          >
            Coming Soon
          </Link>
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
            <Link
              to="/"
               key={item.name}
              onClick={() => {
                setActive(item.name);
                handleScroll(item.id);
                setOpen(false);
              }}
              className={`
                transition-all duration-200
                ${active === item.name ? "text-[#25C866]" : "text-[#E4E4E7]"}
              `}
            >
              {item.name}
            </Link>
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
