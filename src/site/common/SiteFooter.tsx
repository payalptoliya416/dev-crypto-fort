import logo from "@/assets/logo.png";
import footerlogo from "@/assets/site/footer-logo.png";
import footerbg from "@/assets/site/footerbg.png";
import l1 from "@/assets/site/l1.svg";
import l2 from "@/assets/site/l2.svg";
import l3 from "@/assets/site/l3.svg";
import l4 from "@/assets/site/l4.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

type MenuItem = {
  name: string;
  id: string;
};

export default function SiteFooter() {
  const socials = [
    { icon: l1, link: "https://facebook.com" },
    { icon: l2, link: "https://youtube.com" },
    { icon: l3, link: "https://twitter.com" },
    { icon: l4, link: "https://t.me" },
  ];

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

  return (
    <footer
      className="relative bg-[#13192B] pt-[84px] bg-no-repeat"
      style={{
        backgroundImage: `url(${footerbg})`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] lg:max-w-[800px] xl:max-w-[1030px]">
        <div className="bg-[#25C866] rounded-[40px] py-10 sm:py-[60px] px-6 text-center shadow-lg">
          <h2 className="text-2xl md:text-[38px] leading-[38px] font-extrabold text-[#262732] mb-[30px]">
            Take Control of Your{" "}
            <span className="text-white">Crypto Today</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/"
              className="bg-[#262732] text-white px-[22px] py-3 rounded-[12px] text-lg leading-[18px] font-semibold  transition-all duration-300 ease-in-out
      hover:bg-black hover:scale-105 hover:-translate-y-1
      hover:shadow-lg hover:shadow-black/40"
            >
              Launch Web Wallet
            </Link>
            <Link
              to="/"
              className="bg-[#FFFFFF26] text-white px-[22px] py-3 rounded-[12px] text-lg leading-[18px] font-semibold backdrop-blur-md   transition-all duration-300 ease-in-out
      hover:bg-white/30 hover:scale-105 hover:-translate-y-1
      hover:shadow-lg hover:shadow-white/20 border border-transparent hover:border-white/20"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </div>
      <div className="relative container-custom mx-auto text-center">
        <div className="flex justify-center items-center my-[50px]">
          <a href="/">
            <img src={footerlogo} className="hidden md:block" />
            <img src={logo} className="md:hidden" />
          </a>
        </div>
        
        <nav className="flex gap-[30px] text-xl leading-[20px] font-medium text-[#fff] flex-wrap justify-center mb-[43px]">
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
                    : "hover:text-[#25C866] text-[#fff]"
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

        {/* <div className="flex flex-wrap justify-center gap-5 md:gap-[60px] text-[#E9E9EB] text-xl font-medium mb-[50px]">
          <Link
            to="/"
            className="relative transition-all duration-300 hover:text-white
    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
    after:bg-[#25C866] after:transition-all after:duration-300 hover:after:w-full"
          >
            Docs
          </Link>

          <Link
            to="/"
            className="relative transition-all duration-300 hover:text-white
    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
    after:bg-[#25C866] after:transition-all after:duration-300 hover:after:w-full"
          >
            GitHub
          </Link>

          <Link
            to="/"
            className="relative transition-all duration-300 hover:text-white
    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
    after:bg-[#25C866] after:transition-all after:duration-300 hover:after:w-full"
          >
            Privacy Policy
          </Link>

          <Link
            to="/"
            className="relative transition-all duration-300 hover:text-white
    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0
    after:bg-[#25C866] after:transition-all after:duration-300 hover:after:w-full"
          >
            Terms of Use
          </Link>
        </div> */}

        <div className="h-px bg-[#939399]/20" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#9CA3AF] text-sm py-5">
          <div className="flex gap-4">
            {socials.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
        w-[28px] h-[28px] rounded-full bg-[#FFFFFF0D] text-[#E9E8E8]
        flex items-center justify-center
        transition-colors duration-200
        hover:bg-white/20 hover:text-white
      "
              >
                <img src={item.icon} alt="" />
              </a>
            ))}
          </div>
          <p className="text-[#BEBEC2] text-lg font-medium">
            © {new Date().getFullYear()} CryptosFort. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
