import wallet from "@/assets/wallet.png";
import AppLogo from "../../component/AppLogo";
import { Link } from "react-router-dom";


function ExistingWallet() {
  return (
       <div
      className="relative min-h-screen w-full bg-[#13192B]
      p-4 sm:p-6.25
      flex justify-center
      items-start sm:items-center"
    >
      {/* ================= TOP LEFT LOGO ================= */}
      <AppLogo/>

      {/* ================= CENTER CARD ================= */}
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
          <Link to="/recovery-phrase" className="block w-full bg-[#25C866] text-white py-3.5 sm:py-4.5 rounded-xl font-semibold">
           Import with Seed Phrase
          </Link>

          <Link to="/seed-phrase" className="block w-full border border-[#202A43] rounded-xl py-3.5 sm:py-4.5 text-[#999AA1]">
          Import with Private Key
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ExistingWallet
