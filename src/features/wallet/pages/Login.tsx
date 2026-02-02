import AuthLayout from "../../layout/AuthLayout";
import lock from "@/assets/lock.png";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../../api/login"; // ✅ API Import

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Initial Values
  const initialValues = {
    password: "",
  };

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  // ✅ Submit Handler with API Call
  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);

      // ✅ API Call
      const res = await loginUser({
        password: values.password,
      });

      toast.success(res.message);

      // ✅ Redirect after success
      navigate("/");

    } catch (err: any) {
      toast.error(err.message || "Invalid Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div
        className="
          w-full max-w-full sm:max-w-[560px]
          mt-20 sm:mt-0
          rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md
          border border-[#3C3D47]
          px-5 sm:px-12.5
          py-8 sm:py-10
          text-center
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <img src={lock} alt="Login" className="h-20" />
        </div>

        {/* Title */}
        <h1 className="text-white font-bold text-xl sm:text-[28px] mb-6">
          Login
        </h1>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="text-[#7A7D83] mb-2 block text-lg text-left">
                  Password
                </label>

                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className={`w-full rounded-xl bg-[#161F37]
                      px-5 py-4 text-white placeholder:text-[#52535B]
                      border text-lg
                      ${
                        errors.password && touched.password
                          ? "border-[#ef4343]"
                          : "border-[#3C3D47]"
                      }`}
                  />

                  {/* Eye Icon */}
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

                {/* Error */}
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-[#ef4343] text-sm mt-1 text-left"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold transition cursor-pointer
                  ${
                    loading
                      ? "bg-green-400 cursor-not-allowed opacity-70"
                      : "bg-[#25C866] hover:bg-green-500"
                  }
                  text-white`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
}

export default Login;
