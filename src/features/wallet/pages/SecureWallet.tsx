import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaCheck } from "react-icons/fa";
import type { FieldProps } from "formik";
import { useState } from "react";
import CommonSuccessModal from "../../component/CommonSuccessModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import { setWalletPassword } from "../../../api/setWalletPassword";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import AuthLayout from "../../layout/AuthLayout";

function SecureWallet() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const wallet = useSelector((state: RootState) => state.wallet.wallet);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
const [loading, setLoading] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: "",
    acknowledge_password_loss: false,
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    acknowledge_password_loss: Yup.boolean().oneOf([true], "Required"),
  });

 const handleSubmit = async (values: typeof initialValues) => {
  try {
    if (!wallet) {
      toast.error("Wallet not found!");
      return;
    }

    setLoading(true);

    const payload = {
      wallet_id: wallet.wallet_id,
      address: wallet.address,
      password: values.password,
      password_confirmation: values.confirmPassword,
      acknowledge_password_loss: values.acknowledge_password_loss,
    };

    // ✅ API Call
    const res = await setWalletPassword(payload);

    toast.success(res.message);

    // ✅ Show Modal ONLY on Success
    setShowModal(true);

  } catch (error: any) {
    toast.error(error.message);

    // ❌ Modal will NOT open
    setShowModal(false);

  } finally {
    setLoading(false);
  }
};

  return (
   
        <>
<AuthLayout>
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
            {({ errors, touched }) => (
              <Form className="mb-4">
                {/* Password */}
                <div className="mb-6.25">
                  <label className="text-[#7A7D83] mb-2.5 text-lg block">
                    Create password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter create password"
                      className={`border border-[#3C3D47] rounded-xl  bg-[#161F37] px-5 py-4 text-white placeholder:text-[#52535B] text-lg w-full ${
                        errors.password && touched.password
                          ? "border-[#ef4343]"
                          : "border-[#3C3D47]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-400 cursor-pointer
                  "
                    >
                      {showPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-[#ef4343] text-sm mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-6.25">
                  <label className="text-[#7A7D83] mb-2.5 text-lg block">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Enter confirm password"
                      className={`border rounded-xl
                  bg-[#161F37] px-5 py-4 text-white
                  placeholder:text-[#52535B] text-lg w-full ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-[#ef4343]"
                      : "border-[#3C3D47]"
                  }`} 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-gray-400 cursor-pointer
                  "
                    >
                      {showConfirm ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-[#ef4343] text-sm mt-1"
                  />
                </div>

                {/* ================= CUSTOM CHECKBOX ================= */}
                <div className="mb-6">
                  <Field name="acknowledge_password_loss">
                    {({ field, form }: FieldProps<boolean>) => (
                      <label className="flex gap-2.5 cursor-pointer select-none">
                        {/* hidden native checkbox */}
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={field.value}
                          onChange={() =>
                            form.setFieldValue("acknowledge_password_loss", !field.value)
                          }
                          onBlur={field.onBlur}
                          className="hidden"
                        />

                        {/* custom checkbox */}
                        <div>
                          <div
                            className={`w-5 h-5 rounded-[7px]
                            border border-[#434548]
                            flex items-center justify-center
                               ${
                          errors.acknowledge_password_loss && touched.acknowledge_password_loss
                            ? "border-[#ef4343]"
                            : "border-[#434548]"
                        }
                            ${field.value ? "bg-[#25C866] border-[#25C866]" : ""}`}
                            onClick={() =>
                              form.setFieldValue("acknowledge_password_loss", !field.value)
                            }
                          >
                            {field.value && (
                              <FaCheck className="text-white text-[12px]" />
                            )}
                          </div>
                        </div>

                        <p className="text-[#7A7D83] text-base">
                          I understand that losing the password cannot reset
                          access
                        </p>
                      </label>
                    )}
                  </Field>

                  <ErrorMessage
                    name="acknowledge_password_loss"
                    component="p"
                    className="text-[#ef4343] text-sm mt-1"
                  />
                </div>

                {/* Button */}
               <div className="px-10">
  <button
    type="submit"
    disabled={loading}
    className={`block w-full text-white py-3.5 sm:py-4.5 rounded-xl font-semibold cursor-pointer transition
      ${
        loading
          ? "bg-green-400 cursor-not-allowed opacity-70"
          : "bg-[#25C866] hover:bg-green-500"
      }`}
  >
    {loading ? "Setting Password..." : "Set Password"}
  </button>
</div>
              </Form>
            )}
          </Formik>
        </div>
      <CommonSuccessModal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Password Verified"
        description="Your password has been set. You now have full access to your wallet."
        buttonText="Go to Dashboard"
        onButtonClick={() => {
          navigate("/");
        }}
      />
</AuthLayout>
        </>
  );
}

export default SecureWallet;
