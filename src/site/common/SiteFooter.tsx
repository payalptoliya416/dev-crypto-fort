
import logo from "@/assets/logo.png";
import footerlogo from "@/assets/site/footer-logo.png";
import footerbg from "@/assets/site/footerbg.png";
import l1 from "@/assets/site/l1.svg";
import l2 from "@/assets/site/l2.svg";
import l3 from "@/assets/site/l3.svg";
import l4 from "@/assets/site/l4.svg";

export default function SiteFooter() {
  const socials = [
    { icon: l1, link: "https://facebook.com" },
    { icon: l2, link: "https://youtube.com" },
    { icon: l3, link: "https://twitter.com" },
    { icon: l4, link: "https://t.me" },
  ];
  return (
    <footer className="relative bg-[#13192B] pt-[84px] bg-no-repeat"  style={{ backgroundImage: `url(${footerbg})`, backgroundSize: "100% 100%" }}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] lg:max-w-[800px] xl:max-w-[1030px]">
        <div className="bg-[#25C866] rounded-[40px] py-10 sm:py-[60px] px-6 text-center shadow-lg">
          <h2 className="text-2xl md:text-[38px] leading-[38px] font-extrabold text-[#262732] mb-[30px]">
            Take Control of Your{" "}
            <span className="text-white">Crypto Today</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button className="bg-[#262732] text-white px-[22px] py-3 rounded-[12px] text-lg leading-[18px] font-semibold hover:bg-black transition">
              Launch Web Wallet
            </button>

            <button className="bg-[#FFFFFF26] text-white px-[22px] py-3 rounded-[12px] text-lg leading-[18px] font-semibold backdrop-blur-md hover:bg-white/30 transition">
              View Documentation
            </button>
          </div>
        </div>
      </div>
      <div className="relative container-custom mx-auto text-center">
        <div className="flex justify-center items-center my-[50px]">
          <img src={footerlogo} className="hidden md:block" />
          <img src={logo} className="md:hidden" />
        </div>
        <div className="flex flex-wrap justify-center gap-5 md:gap-[60px] text-[#E9E9EB] text-xl font-medium mb-[50px]">
          <a href="#" className="hover:text-white transition">
            Docs
          </a>
          <a href="#" className="hover:text-white transition">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms of Use
          </a>
        </div>
        <div className="h-px bg-[#939399]/20" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#9CA3AF] text-sm py-5">
          <div className="flex gap-4">
            {socials.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[28px] h-[28px] rounded-full bg-[#FFFFFF0D] text-[#E9E8E8] flex items-center justify-center hover:bg-white/20 hover:text-white transition"
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
