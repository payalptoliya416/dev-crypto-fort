import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import wrong from "@/assets/wrong.png";

interface Props {
  input: string;
  password?: string;
  confirmPassword?: string;
  error: string;
  loading: boolean;
  setInput: (v: string) => void;
  setPassword?: (v: string) => void;
  setConfirmPassword?: (v: string) => void;
  onImport: () => void;
}

function SeedPhraseUI({
  input,
  password = "",
  confirmPassword = "",
  error,
  loading,
  setInput,
  setPassword,
  setConfirmPassword,
  onImport,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
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

      <div className="w-full max-w-[640px] mb-4 space-y-4">
        <div>
          <label className="text-[#7A7D83] mb-2 block text-base text-left">
            Recovery Phrase (12 Words)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter seed Phrase"
            rows={3}
            className="
              w-full resize-none
              rounded-[18px]
              border border-[#3C3D47]
              bg-[#161F37]
              p-5 text-white text-lg
              placeholder:text-[#7A7D83] focus:outline-none focus:border-[#25C866]
            "
          />
        </div>

        {setPassword && setConfirmPassword && (
          <>
            <div>
              <label className="text-[#7A7D83] mb-2 block text-base text-left">
                Create Wallet Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password/PIN for this device"
                  className="
                    w-full
                    rounded-[18px]
                    border border-[#3C3D47]
                    bg-[#161F37]
                    p-5 text-white text-lg
                    placeholder:text-[#7A7D83] focus:outline-none focus:border-[#25C866]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#7A7D83] mb-2 block text-base text-left">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password/PIN"
                  className="
                    w-full
                    rounded-[18px]
                    border border-[#3C3D47]
                    bg-[#161F37]
                    p-5 text-white text-lg
                    placeholder:text-[#7A7D83] focus:outline-none focus:border-[#25C866]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  {showConfirm ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

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
          onClick={onImport}
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
  );
}

export default SeedPhraseUI;
