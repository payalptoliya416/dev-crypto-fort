
import { ErrorMessage, Field, Form, Formik } from "formik";
import right from "@/assets/right.png";
import { useState } from "react";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import {  useNavigate } from "react-router-dom";
import AppLogo from "../../component/AppLogo";

function PrivateKey() {
    const [showModal, setShowModal] = useState(false);
     const navigate = useNavigate();

  return (
    <>
    <div className="relative min-h-screen w-full bg-[#13192B] flex items-center justify-center px-4 sm:px-6">

      {/* LOGO */}
      <AppLogo/>

      {/* FORM CARD */}
      <Formik
        initialValues={{ private_key: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.private_key) {
            errors.private_key = "Private key is required";
          } else if (values.private_key.length < 10) {
            errors.private_key = "Private key is too short";
          }
          return errors;
        }}
        onSubmit={(values) => {
          console.log("Private Key:", values.private_key);
          setShowModal(true);
        }}
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
              Enter your private key to restore your wallet. Never share it with anyone.
            </p>

            {/* Input */}
            <div className="mb-4">
              <Field
                name="private_key"
                type="password"
                placeholder="Paste private key"
                className="
                  w-full rounded-xl
                  border border-[#3C3D47]
                  bg-[#161F37]
                  px-4 py-3
                  text-white
                  placeholder:text-[#52535B]
                  focus:outline-none focus:border-[#25C866]
                "
              />
              <ErrorMessage
                name="private_key"
                component="p"
                className="text-red-500 text-sm mt-1 text-left"
              />
            </div>

            {/* Info */}
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
              className=" cursor-pointer
                w-full bg-[#25C866]
                text-white
                py-3 sm:py-4
                rounded-xl
                font-semibold
                hover:bg-[#20b25a]
                transition
              "
            >
              Import Wallet
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
    navigate("/")
  }}
/>
    </>
  );
}

export default PrivateKey;
