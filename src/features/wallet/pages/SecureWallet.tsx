
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheck } from "react-icons/fa";
import type { FieldProps } from "formik";
import { useState } from "react";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import { useNavigate } from "react-router-dom";
import AppLogo from "../../component/AppLogo";

function SecureWallet() {
  const [showModal, setShowModal] = useState(false);
 const navigate = useNavigate();

  const initialValues = {
    password: "",
    confirmPassword: "",
    agree: false,
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    agree: Yup.boolean().oneOf([true], "Required"),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log(values);
    setShowModal(true);
  };

  return (
    <>
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
        w-full max-w-full sm:max-w-137.5
        mt-20 sm:mt-0
        rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md
        border border-[#3C3D47]
        px-5 sm:px-11.25
        py-8 sm:py-12.5"
      >
        <h1 className="text-white font-bold text-xl sm:text-[28px] leading-7 sm:leading-8.5 mb-3 sm:mb-3.75 text-center">
          Secure Your Wallet
        </h1>

        <p className="text-base sm:text-lg text-[#7D7E84] mb-11.25 text-center">
          Store it safely - losing it locks you out.
        </p>

        {/* ================= FORM ================= */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="mb-4">
              {/* Password */}
              <div className="mb-6.25">
                <label className="text-[#7A7D83] mb-2.5 text-lg block">
                  Create password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter create password"
                  className="border border-[#3C3D47] rounded-xl
                  bg-[#161F37] px-5 py-4
                  text-[#52535B] text-lg w-full"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6.25">
                <label className="text-[#7A7D83] mb-2.5 text-lg block">
                  Confirm password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter confirm password"
                  className="border border-[#3C3D47] rounded-xl
                  bg-[#161F37] px-5 py-4
                  text-[#52535B] text-lg w-full"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* ================= CUSTOM CHECKBOX ================= */}
              <div className="mb-6">
                <Field name="agree">
  {({ field, form }: FieldProps<boolean>) => (
    <label className="flex gap-2.5 cursor-pointer select-none">

      {/* hidden native checkbox */}
      <input
        type="checkbox"
        name={field.name}
        checked={field.value}
        onChange={() => form.setFieldValue("agree", !field.value)}
        onBlur={field.onBlur}
        className="hidden"
      />

      {/* custom checkbox */} 
      <div>
      <div
        className={`w-5 h-5 rounded-[7px]
        border border-[#434548]
        flex items-center justify-center
        ${field.value ? "bg-[#25C866] border-[#25C866]" : ""}`}
        onClick={() => form.setFieldValue("agree", !field.value)}
      >
        {field.value && <FaCheck className="text-white text-[12px]" />}
      </div>
      </div>

      <p className="text-[#7A7D83] text-base">
        I understand that losing the password cannot reset access
      </p>
    </label>
  )}
</Field>

                <ErrorMessage
                  name="agree"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Button */}
              <div className="px-10">
                <button
                  type="submit"
                  className="w-full bg-[#25C866] text-white
                  py-3.5 sm:py-4.5 rounded-xl font-semibold cursor-pointer"
                >
                  Set Password
                </button>
              </div>
            </Form>
          )}
        </Formik>


      </div>
    </div>

<CommonSuccessModal
  open={showModal}
  onClose={() => setShowModal(false)}
  title="Password Verified"
  description="Your password has been set. You now have full access to your wallet."
  buttonText="Go to Dashboard"
  onButtonClick={() => {
    navigate("/")
  }}
/>
    </>
  );
}

export default SecureWallet;
