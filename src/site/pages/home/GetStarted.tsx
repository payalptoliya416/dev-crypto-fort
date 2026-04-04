import pbg from "@/assets/site/pbg.png";
import one from "@/assets/site/1.png";
import two from "@/assets/site/2.png";
import three from "@/assets/site/3.png";
import step1 from "@/assets/site/step1.png";
import step2 from "@/assets/site/step2.png";
import step3 from "@/assets/site/step3.png";
import line from "@/assets/site/line.png";
import p1 from "@/assets/site/p1.png";
import p2 from "@/assets/site/p2.png";
import p3 from "@/assets/site/p3.png";
import p4 from "@/assets/site/p4.png";

function GetStarted() {
  return (
    <>
      <section
        className="bg-white py-[60px] bg-cover md:bg-[100%_100%] relative"
        style={{
          backgroundImage: `url(${pbg})`,
        }}
      >
        <div>
          <img src={p3} alt="" className="absolute bottom-[10%] left-[5%]" />
        </div>
        <div className="container-custom mx-auto relative">
           <img src={p1} alt="" className="absolute top-0 right-0" />
            <img src={p2} alt="" className="absolute top-[20%] left-[20%]" />
            <img src={p4} alt="" className="absolute bottom-[10%] right-[15%]" />
          <div className="text-center mb-[35px] mx-auto">
            <h2 className="text-center text-3xl md:text-[40px] leading-[40px] font-extrabold text-white mb-[15px]">
              Get Started in <span className="text-[#25C866]">Minutes</span>
            </h2>
            <p className="text-[#BEBEC2] text-lg font-semibold">
              Set up your wallet, secure your access, and start managing your
              crypto all in a few simple steps.
            </p>
          </div>
          <div className="relative grid md:grid-cols-3 gap-12 pt-6 md:pt-[160px] pb-[0px] lg:pb-[80px] xl:pb-[140px]">
           <img src={line} alt="" className="absolute top-0 left-0 w-full hidden md:block" />
           
            {/* STEP 1 (BOTTOM) */}
            <div className="md:-translate-y-3 lg:translate-y-16 xl:translate-y-32 md:pl-8 lg:pl-16 xl:pl-20 flex justify-center items-center flex-col md:block text-center md:text-left">
              <img src={one} className="mb-4 opacity-40" />

              <div className="w-[55px] h-[55px] rounded-[15px] flex justify-center items-center bg-[#25C866] mb-[16px]">
                <img src={step1} />
              </div>

              <h3 className="text-[22px] font-bold text-[#25C866] mb-[12px]">
                Create Your Wallet
              </h3>

              <p className="text-lg font-medium text-[#A8A9AD]">
                Set up your wallet instantly with a simple and secure onboarding
                process.
              </p>
            </div>

            {/* STEP 2 (CENTER) */}
            <div className="md:-translate-y-28 lg:-translate-y-16 xl:-translate-y-7 md:pl-2 lg:pl-10 xl:pl-12 flex justify-center items-center flex-col md:block text-center md:text-left">
              <img src={two} className="mb-4 opacity-40" />

              <div className="w-[55px] h-[55px] rounded-[15px] flex justify-center items-center bg-[#25C866] mb-[16px]">
                <img src={step2} />
              </div>

              <h3 className="text-[22px] font-bold text-[#25C866] mb-[12px]">
                Secure Your Access
              </h3>

              <p className="text-lg font-medium text-[#A8A9AD]">
                Generate and safely store your private keys to ensure full
                control and ownership.
              </p>
            </div>

            {/* STEP 3 (TOP) */}
            <div className="md:-translate-y-48 lg:-translate-y-40 xl:-translate-y-36 md:pl-2 lg:pl-5 xl:pl-10 flex justify-center items-center flex-col md:block text-center md:text-left">
              <img src={three} className="mb-4 opacity-40" />

              <div className="w-[55px] h-[55px] rounded-[15px] flex justify-center items-center bg-[#25C866] mb-[16px]">
                <img src={step3} />
              </div>

              <h3 className="text-[22px] font-bold text-[#25C866] mb-[12px]">
                Manage & Protect Assets
              </h3>

              <p className="text-lg font-medium text-[#A8A9AD]">
                Send, receive, and monitor your crypto with built-in protection
                at every step.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default GetStarted;
