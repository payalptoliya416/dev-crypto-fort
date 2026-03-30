import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { enable2FA, verify2FA } from "../../../api/login";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function TwoFactorModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1); 
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const resetOTP = () => {
    setOtp(["", "", "", "", "", ""]);
  };

  const fetchQR = async () => {
    try {
      setLoading(true);
      const res = await enable2FA();

      if (res.success) {
        setQrImage(res.data.qr_code_image);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load QR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setStep(1);
      resetOTP();
      fetchQR();
    }
  }, [open]);

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter 6 digit code");
      return;
    }

    try {
      setVerifying(true);

      const res = await verify2FA({ otp: code });

      if (res.status === "error") {
        toast.error(res.message);
        return;
      }

      toast.success("2FA Enabled");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="bg-[#161F37] p-6 rounded-2xl w-[400px] relative mx-3">
        {/* Close */}
        <button
          onClick={() => {
            resetOTP();
            onClose();
          }}
          className="absolute top-2 right-3 text-white text-xl cursor-pointer"
        >
          ✕
        </button>

        {/* ================= STEP 1 (QR) ================= */}
        {step === 1 && (
          <>
            <h3 className="text-white text-lg mb-4 text-center">
              Secure Your Wallet
            </h3>

            <div className="w-[200px] h-[200px] mx-auto mb-4 bg-[#0F172A] flex items-center justify-center rounded-lg">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : qrImage ? (
                <img src={qrImage} className="w-full h-full object-contain" />
              ) : (
                <p className="text-gray-400">No QR</p>
              )}
            </div>

            <p className="text-gray-400 text-sm text-center mb-4">
              Scan this QR using Google Authenticator
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-[#25C866] text-white py-2 rounded-lg cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ================= STEP 2 (OTP) ================= */}
        {step === 2 && (
          <>
            <h3 className="text-white text-lg mb-2 text-center">Verify 2FA</h3>

            <p className="text-gray-400 text-sm text-center mb-4">
              Enter 6-digit code
            </p>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    const newOtp = [...otp];
                    newOtp[i] = val;
                    setOtp(newOtp);

                    // 👉 move forward
                    if (val && i < 5) {
                      document.getElementById(`otp-${i + 1}`)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      const newOtp = [...otp];

                      // 👉 current empty hoy to pacho jao
                      if (!otp[i] && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }

                      // 👉 clear current
                      newOtp[i] = "";
                      setOtp(newOtp);
                    }
                  }}
                  className="w-10 h-10 text-center bg-[#0F172A] text-white rounded-lg"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full bg-[#25C866] py-2 rounded-lg text-white cursor-pointer"
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
