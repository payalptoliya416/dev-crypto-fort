import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../../features/layout/AuthLayout";
import toast from "react-hot-toast";
import { login2FA, verify2FA } from "../../adminapi/adminAuthApi";

export default function Admin2FA() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    showScanner = false,
    adminId = 0,
    qrCode = "",
    secret = "",
  } = (location.state as {
    showScanner?: boolean;
    adminId?: number;
    qrCode?: string;
    secret?: string;
  }) || {};

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const onVerify = async (code: string) => {
    try {
      setLoading(true);

      if (showScanner) {
        const res = await verify2FA({
          otp: code,
        });

        toast.success(res.message);

        navigate("/admin/users");
      } else {
        const res = await login2FA({
          admin_id: adminId,
          otp: code,
        });

        const expiresInSec = res.data.expires_in ?? 86400;
        const expiryAt = Date.now() + expiresInSec * 1000;

        localStorage.setItem("admin_token", res.data.token);
        localStorage.setItem("admin_name", res.data.name);
        localStorage.setItem("admin_token_expiry", expiryAt.toString());

        toast.success(res.message);

        navigate("/admin/users");
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (updated.join("").length === 6) {
      onVerify(updated.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <AuthLayout>
      <div
        className="w-full sm:max-w-[560px] mt-14 sm:mt-0 rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md border border-[#3C3D47]
        px-5 sm:px-8 py-7 sm:py-8 text-center mx-4">
        <h2 className="text-base sm:text-xl font-semibold text-white">
          Secure Your Wallet with 2FA
        </h2>

        {showScanner && (
          <div className="mt-6 flex flex-col items-center">
            <div className="bg-[#161F37] border border-[#3C3D47] rounded-xl p-2 shadow-lg">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain rounded-lg"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs text-[#7A7D83] mb-2">Manual setup key</p>

              <div className="bg-[#161F37] border border-[#3C3D47] rounded-lg px-2 py-2">
                <p className="text-[#E5E7EB] text-xs sm:text-sm font-medium tracking-wider break-all">
                  {secret}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm sm:text-base text-[#A3A8B4]">
          Enter the 6-digit Google Authenticator code to continue.
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 mt-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
               w-10 h-10
                sm:w-12 sm:h-12
                lg:w-14 lg:h-14
                rounded-lg
                bg-[#161F37]
                border border-[#3C3D47]
                text-white
                text-lg sm:text-xl
                text-center
                outline-none
                focus:border-[#25C866]
                focus:ring-2
                focus:ring-[#25C866]/30
              "
            />
          ))}
        </div>

        <button
          disabled={loading}
          onClick={() => onVerify(otp.join(""))}
          className={`
                mt-8
                w-full
                py-2 sm:py-3
                rounded-xl
                font-semibold
                transition
                ${
                  loading
                    ? "bg-green-400 cursor-not-allowed opacity-70"
                    : "bg-[#25C866] hover:bg-green-500"
                }
                text-white
                `}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </AuthLayout>
  );
}
