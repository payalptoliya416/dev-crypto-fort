import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import { verify2FA } from "../../../api/login";

function Verify2FA() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    otp: ["", "", "", "", "", ""],
  };

  const validationSchema = Yup.object({
    otp: Yup.array()
      .of(
        Yup.string()
          .matches(/^[0-9]$/, "Must be digit")
          .required(),
      )
      .length(6),
  });

  const handleSubmit = async (values: any) => {
    const otpCode = values.otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Enter 6 digit code");
      return;
    }

    try {
      setLoading(true);

     const res = await verify2FA({ otp: otpCode });

      if (res.status === "error") {
        toast.error(res.message);
        return;
      }

      toast.success(res.message || "2FA Verified");
      navigate("/dashboard");

    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: any, index: number, setFieldValue: any) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      setFieldValue(`otp[${index}]`, value);
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (
    e: any,
    index: number,
    values: any,
    setFieldValue: any,
  ) => {
    if (e.key === "Backspace") {
      if (!values.otp[index]) {
        const prev = document.getElementById(`otp-${index - 1}`);
        if (prev) (prev as HTMLInputElement).focus();
      } else {
        setFieldValue(`otp[${index}]`, "");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className=" w-full max-w-full sm:max-w-137.5 bg-[#0f1a2f]/80 border border-[#3C3D47] rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Verify 2FA</h2>

          <p className="text-base text-[#7A7D83] mb-6">
            Enter 6-digit code from Google Authenticator
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex flex-col items-center gap-6">
                {/* OTP Inputs */}
                <div className="flex gap-3">
                  {values.otp.map((_: any, index: number) => (
                    <Field
                      key={index}
                      id={`otp-${index}`}
                      name={`otp[${index}]`}
                      maxLength={1}
                      className="w-10 h-10 text-center text-lg font-semibold rounded-lg bg-[#0F172A] border border-[#2E3A5C] text-white focus:outline-none focus:ring-2 focus:ring-[#25C866]"
                      onInput={(e: any) => handleInput(e, index, setFieldValue)}
                      onKeyDown={(e: any) =>
                        handleKeyDown(e, index, values, setFieldValue)
                      }
                    />
                  ))}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-lg bg-[#25C866] text-white font-medium transition cursor-pointer
                    ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
                <Link
                  to="/create-password"
                  className="text-[#25C866] text-base font-normal underline"
                >
                  back to create wallet{" "}
                </Link>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Verify2FA;
