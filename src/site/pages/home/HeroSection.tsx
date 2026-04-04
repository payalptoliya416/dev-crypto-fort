import heroright from "@/assets/site/hero-right.png";
import sitebg from "@/assets/site/sitebg.png";
import SiteHeader from "../../common/SiteHeader";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="relative overflow-hidden bg-no-repeat bg-[#13192B]"
      style={{ backgroundImage: `url(${sitebg})`, backgroundSize: "100% 100%" }}
    >
      {/* HEADER */}
      <SiteHeader />

      {/* HERO */}
      <div className="relative pt-[120px] lg:pt-[180px] pb-[80px] md:pb-[170px]">
        <div className="container-custom mx-auto relative z-10">
          <div className="grid grid-cols-12 text-center lg:text-left">
            <div className="col-span-12 lg:col-span-7 xl:col-span-6 text-white">
              <h1
                className="text-4xl md:text-[56px] font-extrabold lg:leading-[74px] mb-[15px]
"
              >
                Secure Your Crypto Assets with{" "}
                <span className="text-[#25C866]">
                  Fortress Level Protection
                </span>
              </h1>

              <p className="text-[#E9E9EB] text-lg leading-[28px] mb-[30px]">
                A non-custodial, open-source wallet built to protect your
                digital assets with multi-layer security, full control, and
                privacy eliminating risks from centralized platforms and
                third-party access.
              </p>

              <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                <Link to="/" className="bg-[#25C866] rounded-xl py-3 px-[22px] text-lg leading-[18px] font-semibold w-full max-w-[208px] sm:max-w-auto">
                  Launch Web Wallet
                </Link>
                <Link to="/" className="bg-[#FFFFFF0F] py-3 px-[22px] rounded-xl text-white text-lg leading-[18px] font-semibold w-full max-w-[208px] sm:max-w-auto">
                  Explore Security
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pl-10 lg:absolute lg:right-0 lg:top-[52%] lg:-translate-y-1/2 mt-10 lg:mt-0">
          <img
            src={heroright}
            alt="hero"
            className="
            w-full
            md:w-[600px]
              lg:w-[638px]
              max-w-none
            "
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
