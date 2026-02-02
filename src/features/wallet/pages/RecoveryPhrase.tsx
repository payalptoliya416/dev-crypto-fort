
import right from "@/assets/right.png";
import { IoCopyOutline } from "react-icons/io5";
import { useState } from "react";
import toast from "react-hot-toast";
import AppLogo from "../../component/AppLogo";
import { Link } from "react-router-dom";

function RecoveryPhrase() {

  // 🔹 API thi aavta recovery words (example)
  const [words] = useState<string[]>([
    "harbor", "desk", "orbit", "guitar",
    "crisp", "ocean", "filter", "charge",
    "panel", "dawn", "rocket", "maple"
  ]);

  // 🔹 Copy handler
const handleCopy = async () => {
  const textToCopy = words.join(" ");
  try {
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Recovery phrase copied!", { icon: "✅" });
  } catch {
    toast.error("Failed to copy recovery phrase", { icon: "❌" });
  }
};

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
        w-full max-w-full sm:max-w-162.5
        mt-20 sm:mt-0
        rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md
        border border-[#3C3D47]
        px-5 sm:px-16.5
        py-8 sm:py-12.5
        text-center"
      >
        <h1 className="text-white font-bold text-xl sm:text-[28px] leading-7 sm:leading-8.5 mb-3 sm:mb-3.75">
          Secure Your Digital Assets
        </h1>

        <p className="text-base sm:text-lg text-[#7D7E84] mb-6 sm:mb-8.75">
          Your wallet depends on this phrase - keep it secure, never share.
        </p>

        {/* ================= RECOVERY WORDS ================= */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6.25">
          {words.map((word, i) => (
            <div
              key={i}
              className="w-full sm:w-38.5
              py-2 sm:py-4.25
              px-2 sm:px-5
              flex items-center gap-2 sm:gap-3.75
              text-sm sm:text-xl
              rounded-xl bg-[#202A43]"
            >
              <span className="text-white font-semibold">{i + 1}.</span>
              <span className="text-[#52535B] font-normal">{word}</span>
            </div>
          ))}
        </div>

        {/* ================= COPY BUTTON ================= */}
        <div className="flex justify-end mt-3.75">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 cursor-pointer
            text-white text-sm sm:text-lg font-semibold
            border border-[#434548] bg-[#202A43]
            rounded-[10px]
            py-2 sm:py-3 px-2 sm:px-3.75"
          >
            <IoCopyOutline />
            <span>Copy</span>
          </button>
        </div>

        {/* Warning */}
        <div
          className="border border-[#FFDD1D1A] rounded-md mt-5.5 mb-7.25
          text-[#FFDD1D]
          text-sm sm:text-lg
          py-2.5 sm:py-3
          flex items-center gap-2 sm:gap-2.5
          px-3 sm:px-4.5 lg:mx-10"
        >
          <img src={right} alt="Secure Wallet" className="h-4 sm:h-auto" />
          <span>Losing this means losing access forever.</span>
        </div>

        <div className="px-10 lg:mx-16">
          <Link to="/create-password" className="block w-full bg-[#25C866] text-white py-3.5 sm:py-4.5 rounded-xl font-semibold">
            Confirm Recovery Phrase
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecoveryPhrase;
