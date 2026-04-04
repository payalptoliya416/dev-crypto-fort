import e1 from "@/assets/site/e1.png";
import e2 from "@/assets/site/e2.png";
import e3 from "@/assets/site/e3.png";
import e4 from "@/assets/site/e4.png";
import e5 from "@/assets/site/e5.png";
import e6 from "@/assets/site/e6.png";
import debg from "@/assets/site/de-bg.png";
import bg from "@/assets/site/bg.png";

export default function FeaturesGridSection() {
  const features = [
    {
      icon: e1,
      title: "Non-Custodial Wallet",
      desc: "You own your private keys. Full control with zero reliance on third parties.",
    },
    {
      icon: e2,
      title: "Open Source Transparency",
      desc: "Fully open-source code that anyone can audit, verify, and trust.",
    },
    {
      icon: e3,
      title: "Multi-Asset Support",
      desc: "Manage multiple cryptocurrencies in one secure, unified wallet.",
    },
    {
      icon: e4,
      title: "Fast Transactions",
      desc: "Execute transactions quickly with optimized performance and low friction.",
    },
    {
      icon: e5,
      title: "Secure Key Management",
      desc: "Advanced encryption ensures your keys stay protected at all times.",
    },
    {
      icon: e6,
      title: "Cross-Platform Ready",
      desc: "Access your wallet on web today. Mobile apps coming soon.",
    },
  ];

  return (
    <section className="relative py-[60px] overflow-hidden bg-[#0b1f1a]  bg-no-repeat"
      style={{ backgroundImage: `url(${debg})`, backgroundSize: "100% 100%" }} >
      <div className="relative container-custom mx-auto">
        <div className="text-center mb-[35px]">
          <h2 className="text-center text-3xl md:text-[40px] leading-[40px] font-extrabold text-[#25C866] mb-[15px]">
            Everything You Need.
            <span className="text-white"> Nothing You Don’t</span>
          </h2>
          <p className="text-[#BEBEC2] text-lg font-semibold">
            Built with a focus on security, control, and simplicity – without
            unnecessary complexity.
          </p>
        </div>
        <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="relative py-5 md:py-[40px] px-5 md:px-[28px] text-center rounded-[30px]
                transition-all duration-300 hover:border-[#25C866]/40 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_30px_rgba(37,200,102,0.12)] 
                bg-no-repeat"
                 style={{ backgroundImage: `url(${bg})`, backgroundSize: "100% 100%" }} >
              <div className="w-[84px] h-[84px] mx-auto mb-6 rounded-[20px] bg-[#25C8661A] backdrop-blur-sm flex items-center justify-center">
                <img src={item.icon} alt="icon" className="" />
              </div>
              <h3 className="text-[22px] md:leading-[22px] font-bold text-white mb-[15px]">
                {item.title}
              </h3>
              <p className="text-lg leading-[26px] text-[#A8A9AD] font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
