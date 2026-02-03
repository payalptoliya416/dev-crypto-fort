import wallet from "@/assets/wallet.png";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";

function ExistingWallet() {
   const navigate = useNavigate();
  return (
    <AuthLayout>
      <div
        className="
        w-full max-w-full sm:max-w-118.25
        mt-20 sm:mt-0
        rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md
        border border-[#3C3D47]
        px-5 sm:px-12.5
        py-8 sm:py-10
        text-center"
      >
        {/* Lock Image */}
        <div className="flex justify-center mb-6 sm:mb-8.75">
          <img src={wallet} alt="Secure Wallet" className="h-20 sm:h-auto" />
        </div>

        {/* Title */}
        <h1
          className="text-white font-bold
          text-xl sm:text-[28px]
          leading-7 sm:leading-8.5
          mb-3 sm:mb-3.75"
        >
          Import Existing Wallet
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#7D7E84] mb-6 sm:mb-8.75">
          Choose the method to restore your wallet.
        </p>

        {/* Buttons */}
        <div className="space-y-4 sm:space-y-5">
          <button
           onClick={() => navigate("/seed-phrase", { state: { type: "phrase" } })}
            className="block w-full bg-[#25C866] text-white py-3.5 sm:py-4.5 rounded-xl font-semibold cursor-pointer"
          >
            Import with Seed Phrase
          </button>

          <button
            onClick={() => navigate("/private-key", { state: { type: "key" } })}
            className="block w-full border border-[#202A43] rounded-xl py-3.5 sm:py-4.5 text-[#999AA1] cursor-pointer"
          >
            Import with Private Key
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ExistingWallet;
