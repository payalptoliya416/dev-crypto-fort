import lock from "@/assets/lock.png";
import right from "@/assets/right.png";
import AppLogo from "../../component/AppLogo";
import { Link } from "react-router-dom";

function CreateWallet() {
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
          <img src={lock} alt="Secure Wallet" className="h-20 sm:h-auto" />
        </div>

        {/* Title */}
        <h1
          className="text-white font-bold
          text-xl sm:text-[28px]
          leading-7 sm:leading-8.5
          mb-3 sm:mb-3.75"
        >
          Secure Your Digital Assets
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#7D7E84] mb-6 sm:mb-8.75">
          Create a new wallet or import an existing one.
        </p>

        {/* Buttons */}
        <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-7.5">
          <Link to="/recovery-phrase" className="block w-full bg-[#25C866] text-white py-3.5 sm:py-4.5 rounded-xl font-semibold">
            Create New Wallet
          </Link>

          <Link to="/existing-wallet" className="block w-full border border-[#202A43] rounded-xl py-3.5 sm:py-4.5 text-[#999AA1]">
            Import Existing Wallet
          </Link>
        </div>

        {/* Info */}
        <div
          className="border border-[#FFDD1D1A] rounded-md
          text-[#FFDD1D]
          text-sm sm:text-lg
          py-2.5 sm:py-3
          flex items-center gap-2 sm:gap-2.5
          px-3 sm:px-4.5"
        >
          <img src={right} alt="Secure Wallet" className="h-4 sm:h-auto" />
          <span>Your keys never leave your device.</span>
        </div>
      </div>
    </div>
  );
}

export default CreateWallet;
