import securityIcon from "@/assets/site/f1.png";
import ownershipIcon from "@/assets/site/f2.png";
import privateIcon from "@/assets/site/f3.png";

export default function FeaturesSection() {
  const features = [
    {
      icon: securityIcon,
      title: "Fortified Security",
      desc: "Multi-layer protection designed to defend your assets from threats, breaches, and unauthorized access.",
    },
    {
      icon: ownershipIcon,
      title: "Full Ownership",
      desc: "You control your private keys. No intermediaries, no restrictions, no dependency on third parties.",
    },
    {
      icon: privateIcon,
      title: "Private by Design",
      desc: "No KYC. No tracking. Your data and transactions remain fully under your control.",
    },
  ];

  return (
    <section className="bg-white py-[80px] md:pb-[110px]">
      <div className="container-custom mx-auto">
        <h2 className="text-center text-3xl md:text-[40px] leading-[40px] font-extrabold text-[#262732] mb-[35px]">
          Your Wallet. Your <span className="text-[#25C866]">Fortress.</span>
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="bg-[#F4F4F566] rounded-[30px] border border-[#E9E9EB] p-[30px] text-center
              transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-[70px] sm:w-[84px] h-[70px] sm:h-[84px] mx-auto mb-[30px] rounded-[20px] bg-[#25C8661A] flex items-center justify-center">
                <img src={item.icon} alt="icon" />
              </div>

              <h3 className="text-[22px] md:leading-[22px] font-bold text-[#262732] mb-[15px]">
                {item.title}
              </h3>
              <p className="text-lg leading-[26px] text-[#52535B] font-medium mb-0">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
