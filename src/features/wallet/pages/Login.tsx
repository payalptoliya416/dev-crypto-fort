import AuthLayout from "../../layout/AuthLayout";
import lock from "@/assets/lock.png";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/login";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../redux/authSlice";
import type { RootState } from "../../../redux/store/store";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const initialValues = {
    seed_phrase: "",
  };
  const validationSchema = Yup.object({
    seed_phrase: Yup.string().required("Seed phrase is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);

      const res = await loginUser({
        seed_phrase: values.seed_phrase,
      });

      if (res.success) {
        const data = res.data;

        if ("requires_2fa" in data && data.requires_2fa) {
          dispatch(
            setToken({
              token: null,
              expiresIn: 0,
              userId: data.user_id,
            }),
          );

          toast.success(res.message || "2FA verification required");
          navigate("/user/login-verify-2fa", { replace: true });
          return;
        }

        if ("token" in data && data.token) {
          dispatch(
            setToken({
              token: data.token,
              expiresIn: data.expires_in,
              userId: data.user_id,
            }),
          );

          toast.success(res.message || "Login successful");
          navigate("/user/dashboard", { replace: true });
          return;
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid Seed Phrase");
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
        <div className="flex justify-center mb-6">
          <img src={lock} alt="Login" className="h-20" />
        </div>

        <h1 className="text-white font-bold text-xl sm:text-[28px] mb-6">
          Login
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div>
                <label className="text-[#7A7D83] mb-2 block text-lg text-left">
                  Seed Phrase
                </label>

                <div className="relative">
                  <Field
                    as="textarea"
                    name="seed_phrase"
                    placeholder="Enter seed phrase"
                    rows={4}
                    className={`w-full resize-none
              rounded-[18px]
              border
              bg-[#161F37]
              p-5 text-white text-lg
              placeholder:text-[#7A7D83]
              focus:outline-none focus:border-[#25C866]
              ${
                errors.seed_phrase && touched.seed_phrase
                  ? "border-[#ef4343]"
                  : "border-[#3C3D47]"
              }`}
                  />
                </div>

                <ErrorMessage
                  name="seed_phrase"
                  component="p"
                  className="text-[#ef4343] text-sm mt-1 text-left"
                />
              </div>

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
        <p className="text-[#7A7D83] text-sm sm:text-base mt-4">
          Don’t have a wallet?{" "}
          <Link
            to="/user"
            className="text-[#25C866] font-semibold hover:underline cursor-pointer transition-all duration-500"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
