import lock from "@/assets/lock.png";
import AuthLayout from "../../features/layout/AuthLayout";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLogin } from "../adminapi/adminAuthApi";

interface LoginFormValues {
  email: string;
  password: string;
}

function AdminLogin() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");

    if (adminToken) {
      navigate("/admin/users");
    }
  }, [navigate]);

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter valid email address")
      .required("Email address is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

 const handleSubmit = async (
  values: LoginFormValues,
  { resetForm }: FormikHelpers<LoginFormValues>
) => {

  try {
    setLoading(true);

    const res = await adminLogin(values);

    localStorage.setItem("admin_token", res.data.token);
    localStorage.setItem("admin_name", res.data.name);

    toast.success(res.message);

    navigate("/admin/users");

    resetForm();

  } catch (error: any) {

    toast.error(error.message || "Login failed");

  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <AuthLayout>
        <div
          className="w-full max-w-full sm:max-w-[560px] mt-20 sm:mt-0 rounded-2xl bg-[#0f1a2f]/80 backdrop-blur-md
          border border-[#3C3D47] px-5 sm:px-12.5 py-8 sm:py-10 text-center"
        >
          <div className="flex justify-center mb-6">
            <img src={lock} alt="Login" className="h-20" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-6">
            Admin Login
          </h2>
          <Formik<LoginFormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label className="text-[#7A7D83] mb-2 block text-lg text-left">
                    Email Address
                  </label>

                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full rounded-xl bg-[#161F37]
                    px-5 py-3 text-white placeholder:text-[#52535B]
                    border text-lg
                    ${
                      errors.email && touched.email
                        ? "border-[#ef4343]"
                        : "border-[#3C3D47]"
                    }`}
                  />

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-[#ef4343] text-sm mt-1 text-left"
                  />
                </div>

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
                      px-5 py-3 text-white placeholder:text-[#52535B]
                      border text-lg
                      ${
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
                    className="text-[#ef4343] text-sm mt-1 text-left"
                  />
                </div>
                {/* <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="text-[#25C866] text-sm hover:underline cursor-pointer"
              >
                Change Password
              </button>
                </div> */}
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
    
    </>
  );
}

export default AdminLogin;
