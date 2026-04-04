import security from "@/assets/site/security.png";
import check from "@/assets/site/check.png";

export default function SecurityVerifySection() {
  return (
    <section className="bg-white py-16 md:py-[110px]">
      <div className="container-custom mx-auto">
        <div className="grid lg:grid-cols-2 gap-[30px] items-start">
          <div>
            <h2 className="text-3xl md:text-[40px] leading-[40px] font-extrabold text-[#262732] mb-[15px]">
              Security You <span className="text-[#25C866]">Can Verify</span>
            </h2>

            <p className="text-[#52535B] text-lg md:leading-[26px] mb-[15px]">
              CryptosFort is built on a foundation of transparency and control,
              not blind trust. Every part of the system is designed to be open,
              auditable, and fully under your ownership, removing the need to
              rely on centralized entities. Instead of handing over control, you
              operate in an environment where security is enforced by design,
              not promises.
            </p>

            <p className="text-[#52535B] text-lg md:leading-[26px] mb-[25px]">
              From how your keys are stored to how transactions are executed,
              every layer is structured to minimize risk and eliminate
              third-party exposure. You are not trusting a platform to protect
              your assets — you are using a system that ensures protection
              through architecture, visibility, and complete user control.
            </p>

            <div className="flex items-center gap-[25px] mb-[20px] flex-wrap">
              <div className="flex items-center gap-[15px] whitespace-nowrap">
                <img src={check} alt="" className="" />
                <h3 className="text-lg md:leading-[20px] font-semibold text-[#262732]">
                  Open-Source Code
                </h3>
              </div>
              <div className="flex items-center">
                <div
                  className="w-px h-8 bg-gradient-to-b from-transparent via-[#262732] to-transparent blur-[0.5px]"
                />
              </div>
              <div className="flex items-center gap-[15px] whitespace-nowrap">
                <img src={check} alt="" className="" />
                <h3 className="text-lg md:leading-[20px] font-semibold text-[#262732]">
                  No KYC Required
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-[25px]  flex-wrap">
              <div className="flex items-center gap-[15px] whitespace-nowrap">
                <img src={check} alt="" className="" />
                <h3 className="text-lg md:leading-[20px] font-semibold text-[#262732]">
                  No Centralized Control
                </h3>
              </div>
              <div className="flex items-center">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#262732] to-transparent blur-[0.5px]"/>
              </div>

              <div className="flex items-center gap-[15px] whitespace-nowrap">
                <img src={check} alt="" className="" />
                <h3 className="text-lg md:leading-[20px] font-semibold text-[#262732]">
                 Keys Stay With You
                </h3>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <img src={security} alt="security" className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
