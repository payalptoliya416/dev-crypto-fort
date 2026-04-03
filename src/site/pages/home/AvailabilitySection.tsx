import w1 from "@/assets/site/w1.png";
import w2 from "@/assets/site/w2.png";
import w3 from "@/assets/site/w3.png";
import wbg from "@/assets/site/w-bg.png";
import bg from "@/assets/site/bg.png";

export default function AvailabilitySection() {
  const data = [
    {
      icon: w1,
      title: "Web Wallet",
      btn: "Launch Wallet",
      active: true,
      badge: "Live Now",
    },
    {
      icon: w2,
      title: "Android",
      btn: "Coming Soon",
    },
    {
      icon: w3,
      title: "IOS",
      btn: "Coming Soon",
    },
  ];

  return (
    <section
      className="relative py-[60px] bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${wbg})`, backgroundSize: "100% 100%" }}
    >
      <div className="relative container-custom mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-center text-3xl md:text-[40px] leading-[40px] font-extrabold text-white mb-[15px]">
            Available <span className="text-[#25C866]">Everywhere</span>
          </h2>
          <p className="text-[#BEBEC2] text-lg font-semibold">
            Access your wallet on web today, with mobile platforms launching
            soon.
          </p>
        </div>

        <div className="grid gap-[30px] md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="
                relative text-center p-10  rounded-[32px]
                transition-all duration-300 hover:border-[#25C866]/40
               hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_30px_rgba(37,200,102,0.12)]
              "
               style={{ backgroundImage: `url(${bg})`, backgroundSize: "100% 100%" }}
            >
              {item.badge && (
                <div className="absolute -top-4 left-1/2 bg-[#3E5D5B] text-white text-base font-semibold leading-[16px] py-2 px-[15px] rounded-full backdrop-blur-md -translate-x-1/2 z-20">
                  {item.badge}
                </div>
              )}

              <div className="w-[70px] md:w-[90px] h-[70px] md:h-[90px] mx-auto rounded-2xl bg-[#25C866]/10 flex items-center justify-center mb-[25px]">
                <img src={item.icon} className="" />
              </div>
              <h3 className="text-[22px] leading-[22px] font-bold text-white mb-[15px]">
                {item.title}
              </h3>
              <div className="relative rounded-[32px] p-[1px] bg-gradient-to-r from-white/0 via-white/20 to-white/0 mb-[30px]" />

              <button
                className={`
                  px-[22px] py-2 sm:py-[12px] rounded-[12px] text-lg leading-[18px] font-semibold transition-all
                  ${
                    item.active
                      ? "bg-[#25C866] text-white hover:bg-[#22b35a]"
                      : "bg-white/10 text-white"
                  }
                `}
              >
                {item.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
