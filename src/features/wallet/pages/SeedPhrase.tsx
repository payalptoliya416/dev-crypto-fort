
import wrong from "@/assets/wrong.png";
import AppLogo from "../../component/AppLogo";
import { Link } from "react-router-dom";

function SeedPhrase() {
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
        w-full max-w-full sm:max-w-[560px]
        mt-20 sm:mt-0
        rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md
        border border-[#3C3D47]
        px-5 sm:px-12.5
        py-8 sm:py-10
        text-center"
      >
        {/* Title */}
        <h1
          className="text-white font-bold
          text-xl sm:text-[28px]
          leading-7 sm:leading-8.5
          mb-3 sm:mb-3.75"
        >
          Recover Wallet Access
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#7D7E84] mb-6 sm:mb-8.75">
          Use your original 12/24-word recovery phrase to restore your wallet.
        </p>

        <div className="flex justify-center mb-[15px]">
          <button className="bg-[#202A43] rounded-[10px] py-3 px-[22px] text-white text-base font-semibold">
            12 Word
          </button>
        </div>

        <div className="w-full max-w-[640px] mb-4">
          <textarea
            placeholder="Enter seed Phrase"
            rows={4}
            className="
        w-full resize-none
        rounded-[18px]
        border border-[#3C3D47]
        bg-[#161F37]
        p-5 text-white text-lg
        placeholder:text-[#7A7D83] focus:outline-none
      "
          />
        </div>

        {/* Info */}
        <div
          className="border border-[#FFDD1D1A] rounded-md
          text-sm sm:text-lg
          py-2.5 sm:py-3 text-[#FFDD1D]
          flex items-center gap-2 sm:gap-2.5
          px-3 sm:px-4.5 sm:mx-12 bg-[#FFDD1D05] mb-[35px]"
        >
          <img src={wrong} alt="Secure Wallet" className="h-4 sm:h-auto" />
          <span>Never share your recovery phrase.</span>
        </div>
        <div className="sm:mx-11">
          <Link to="/private-key" className="block w-full bg-[#25C866] text-white py-3.5 sm:py-4.5 rounded-xl font-semibold">
            Import Seed Phrase
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SeedPhrase;
