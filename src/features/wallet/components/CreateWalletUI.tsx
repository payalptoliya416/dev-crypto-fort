import lock from "@/assets/lock.png";
import right from "@/assets/right.png";

interface Props {
  loading: boolean;
  onCreateWallet: () => void;
  onImportWallet: () => void;
  onLogin: () => void;
}

function CreateWalletUI({
  loading,
  onCreateWallet,
  onImportWallet,
  onLogin,
}: Props) {
  return (
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
        <button
          onClick={onCreateWallet}
          disabled={loading}
          className={`block w-full text-white py-3.5 sm:py-4.5 rounded-xl font-semibold cursor-pointer  ${
            loading
              ? "bg-green-400 cursor-not-allowed opacity-70"
              : "bg-[#25C866] hover:bg-green-500"
          }`}
        >
          {loading ? "Creating Wallet..." : "Create New Wallet"}
        </button>

        <button
          onClick={onImportWallet}
          className="block w-full border border-[#202A43] rounded-xl py-3.5 sm:py-4.5 text-[#999AA1] cursor-pointer"
        >
          Import Existing Wallet
        </button>
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

      <p className="text-[#7A7D83] text-sm sm:text-base mt-4">
        Already have a wallet?{" "}
        <button
          onClick={onLogin}
          className="text-[#25C866] font-semibold hover:underline cursor-pointer transition-all duration-500"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default CreateWalletUI;
