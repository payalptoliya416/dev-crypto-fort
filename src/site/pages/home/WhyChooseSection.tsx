import c1 from "@/assets/site/c1.png";
import c2 from "@/assets/site/c2.png";
import c3 from "@/assets/site/c3.png";
import c4 from "@/assets/site/c4.png";

export default function WhyChooseSection() {
  const data = [
    {
      icon: c1,
      title: "Built for Security First",
      desc: "Designed to protect your assets at every level not just store them.",
    },
    {
      icon: c2,
      title: "Defense-Driven Architecture",
      desc: "Structured like a fortress system, with layered protection instead of single-point security.",
    },
    {
      icon: c3,
      title: "Fully Transparent & Open",
      desc: "Open-source foundation that allows anyone to verify and trust the system.",
    },
    {
      icon: c4,
      title: "No Third-Party Dependency",
      desc: "Complete control without relying on exchanges, institutions, or intermediaries.",
    },
  ];

  return (
    <section className="bg-white py-[90px] md:py-[110px]">
      <div className="container-custom mx-auto">
        
        <div className="text-center mb-[35px] max-w-[700px] mx-auto">
           <h2 className="text-center text-3xl md:text-[40px] leading-[40px] font-extrabold text-[#262732] mb-[15px]">
           Why Choose{" "}
            <span className="text-[#25C866]">CryptosFort?</span>
          </h2>
         <p className="text-[#52535B] text-lg font-semibold">
            Built with a security-first mindset, CryptosFort goes beyond traditional wallets by combining control, transparency, and a defense-driven architecture.
          </p>
        </div>

        <div className="grid gap-[30px] md:grid-cols-2">
          {data.map((item, i) => (
            <div
              key={i}
              className="
                bg-[#F4F4F566] rounded-2xl border border-[#E9E9EB]
                p-8 text-center
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
              "
            >
              
              <div className="w-[84px] h-[84px] mx-auto mb-[30px] rounded-[20px] bg-[#25C866]/10 flex items-center justify-center">
                <img
                  src={item.icon}
                  alt="icon"
                  className=""
                />
              </div>

              <h3 className="text-[22px] lg:leading-[22px] font-bold text-[#262732] mb-[15px]">
                {item.title}
              </h3>

              <p className="text-lg leading-[26px] text-[#52535B] font-medium mx-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}