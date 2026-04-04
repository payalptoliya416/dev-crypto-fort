import towerImg from "@/assets/site/defense.png";
import check from "@/assets/site/check.png";

export default function DefenseSection() {
  const points = [
    {
      title: "The Fortress",
      desc: "Your wallet structure",
    },
    {
      title: "Threat Detection",
      desc: "Identify risks & suspicious activity",
    },
    {
      title: "Multi-Layer Protection",
      desc: "Keys, encryption, cold storage logic",
    },
    {
      title: "Instant Control",
      desc: "Full access anytime, no middleman",
    },
  ];

  return (
    <section className="bg-white pb-[80px] md:pb-[110px]">
      <div className="container-custom mx-auto">
        <div className="grid lg:grid-cols-2 gap-[30px] items-start">
          <div className="flex justify-center md:justify-start">
            <img
              src={towerImg}
              alt="defense"
              className="rounded-[35px] mx-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-[40px] leading-[40px] font-extrabold text-[#13192B] mb-[15px]">
              Built Like a{" "}
              <span className="text-[#25C866]">Defense System</span>
            </h2>
            <p className="text-[#52535B] text-lg leading-[26px] mb-[35px]">
              CryptosFort is designed as a structured defense system, where
              every layer works together to secure your assets. Your wallet acts
              as the fortress, built on a non-custodial foundation that gives
              you full control over your keys and transactions. Instead of
              relying on centralized systems, it operates with a security-first
              architecture that minimizes exposure and eliminates unnecessary
              risks.
            </p>
            <div className="space-y-5">
              {points.map((item, i) => (
                <div key={i}>
                  <div className="flex items-start gap-[15px]">
                    <img src={check} alt="check" />
                    <div>
                      <h4 className="text-[#262732E] text-xl lg:text-[22px] md:leading-[22px] font-bold mb-[10px]">
                        {item.title}
                      </h4>
                      <p className={`text-lg md:leading-[18px] text-[#52535B] ${i !== points.length - 1 ? "mb-5 lg:mb-[30px] " : ""}`} >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {i !== points.length - 1 && (
                    <div className="border-b border-[#D4D4D6]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
