import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import toast from "react-hot-toast";
import { disable2FA, enable2FA } from "../../../api/login";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";

function TwoFactorSetup() {
  const navigate = useNavigate();
  const [qrImage , setQrImage] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await enable2FA();

        if (res.success) {
          setQrImage(res.data.qr_code_image);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load QR");
      }
    };

    fetchQR();
  }, []);

  const handleSkip = async () => {
  try {
    if (!userId) {
      toast.error("User not found");
      return;
    }

    const res = await disable2FA({ user_id: userId });

    if (res.success) {
      toast.success(res.message);
      navigate("/dashboard", { replace: true });
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to disable 2FA");
  }
};

  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className=" w-full max-w-full sm:max-w-137.5 bg-[#0f1a2f]/80 border border-[#3C3D47] rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-white mb-6">
            Secure Your Wallet with 2FA
          </h2>

          {/* QR Box */}
          <div className="w-[220px] h-[220px] mx-auto bg-[#0F172A] border border-[#2E3A5C] rounded-xl flex items-center justify-center mb-6">
            {qrImage ? (
              <img
                src={qrImage}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-[#7A7D83] text-sm">No QR code found</p>
            )}
          </div>

          {/* Info */}
          <p className="text-base text-[#7A7D83] mb-4">
            Scan this QR code using Google Authenticator or similar app
          </p>

          {/* Button */}
          <div className="flex gap-3 justify-center mt-4">
            {/* Skip */}
            <button
              onClick={handleSkip}
              className="px-6 py-2 rounded-lg border border-[#3C3D47] text-[#7A7D83] hover:bg-[#202A43] transition cursor-pointer"
            >
              Skip
            </button>

            {/* Next */}
            <button
              onClick={() => navigate("/verify-2fa")}
              className="px-6 py-2 rounded-lg bg-[#25C866] text-white hover:opacity-90 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default TwoFactorSetup;
