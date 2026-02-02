import { ErrorMessage, Field, Form, Formik } from "formik";
import right from "@/assets/right.png";
import { useState } from "react";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../component/AppLogo";
import { importWallet } from "../../../api/importWallet";
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function PrivateKey() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  // ✅ API Call Function Outside
  const handleImportKey = async (privateKey: string) => {
    setApiError("");

    try {
      setLoading(true);

      // ✅ API Call
      const res = await importWallet({
        type: "key", // ✅ key pass thase
        data: privateKey.trim(),
      });

      toast.success(res.message);

      setShowModal(true);
    } catch (err: any) {
      // ✅ API Error Show Below Input
      setApiError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="relative min-h-screen w-full bg-[#13192B] flex items-center justify-center px-4 sm:px-6">
        {/* LOGO */}
        <AppLogo />

        {/* FORM CARD */}
        <Formik
          initialValues={{ private_key: "" }}
          validate={(values) => {
            const errors: any = {};
            if (!values.private_key.trim()) {
              errors.private_key = "Private key is required";
            }
            return errors;
          }}
          onSubmit={(values) => handleImportKey(values.private_key)}
        >
          {() => (
            <Form
              className="
              w-full max-w-md sm:max-w-xl
              rounded-2xl
              bg-[#0f1a2f]/80 backdrop-blur-md
              border border-[#3C3D47]
              px-5 sm:px-10
              py-8 sm:py-10
              text-center
            "
            >
              {/* Title */}
              <h1 className="text-white font-bold text-xl sm:text-2xl mb-3">
                Private Key Wallet Import
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#7D7E84] mb-6">
                Enter your private key to restore your wallet. Never share it
                with anyone.
              </p>

              {/* Input */}
              <div className="mb-4">
                <Field name="private_key">
                  {({ field }: any) => (
                    <div className="relative">
                      <input
                        {...field}
                        type={showKey ? "text" : "password"}
                        placeholder="Paste private key"
                        onChange={(e) => {
                          field.onChange(e);
                          setApiError(""); // ✅ clear API error while typing
                        }}
                        className="
                                w-full rounded-xl
                                border border-[#3C3D47]
                                bg-[#161F37]
                                px-4 py-3 pr-12
                                text-white
                                placeholder:text-[#52535B]
                                focus:outline-none focus:border-[#25C866]
                              "
                      />

                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="
                                absolute right-4 top-1/2
                                -translate-y-1/2
                                text-gray-400 cursor-pointer
                              "
                      >
                        {showKey ? (
                          <IoEyeOffOutline size={20} />
                        ) : (
                          <IoEyeOutline size={20} />
                        )}
                      </button>
                    </div>
                  )}
                </Field>

                <ErrorMessage
                  name="private_key"
                  component="p"
                  className="text-[#ef4343] text-sm mt-1 text-left"
                />
                {apiError && (
                  <p className="text-[#ef4343] text-sm mt-1 text-left">
                    {apiError}
                  </p>
                )}
              </div>
              <div
                className="
                mb-6
                border border-[#FFDD1D1A]
                rounded-lg
                text-[#FFDD1D]
                text-xs sm:text-sm
                py-2 px-3
                flex items-center gap-2 justify-center
              "
              >
                <img src={right} alt="Secure" className="h-4" />
                <span>Your keys never leave your device.</span>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`cursor-pointer
                  w-full text-white
                  py-3 sm:py-4
                  rounded-xl font-semibold transition
                  ${
                    loading
                      ? "bg-green-400 cursor-not-allowed opacity-70"
                      : "bg-[#25C866] hover:bg-green-500"
                  }
                `}
              >
                {loading ? "Importing..." : "Import Wallet"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <CommonSuccessModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Access Unlocked"
        description="Your funds are now accessible. Continue to your dashboard."
        buttonText="Go to Dashboard"
        onButtonClick={() => {
          navigate("/");
        }}
      />
    </>
  );
}

export default PrivateKey;
