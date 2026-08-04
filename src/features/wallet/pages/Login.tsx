import AuthLayout from "../../layout/AuthLayout";
import lock from "@/assets/lock.png";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../api/login";
import { useDispatch, useSelector } from "react-redux";
import { setToken, unlockWallet } from "../../../redux/authSlice";
import type { RootState } from "../../../redux/store/store";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import {
  hasEncryptedSeedPhrase,
  decryptSeedPhrase,
  clearEncryptedSeedPhrase,
} from "../../../utils/walletCrypto";
import CommonConfirmModal from "../../component/CommonConfirmModal";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const unlocked = useSelector((state: RootState) => state.auth.unlocked);
  const [loading, setLoading] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setHasWallet(hasEncryptedSeedPhrase());
  }, []);

  useEffect(() => {
    if (token && unlocked) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, unlocked, navigate]);

  // Initial values & validation schemas based on whether we are unlocking or logging in fresh
  const initialValuesUnlock = {
    password: "",
  };

  const validationSchemaUnlock = Yup.object({
    password: Yup.string().required("PIN / Password is required"),
  });

  const initialValuesLogin = {
    seed_phrase: "",
  };

  const validationSchemaLogin = Yup.object({
    seed_phrase: Yup.string().required("Seed phrase is required"),
  });

  const handleUnlock = async (values: typeof initialValuesUnlock) => {
    try {
      setLoading(true);
      const decryptedPhrase = decryptSeedPhrase(values.password);
      if (!decryptedPhrase) {
        toast.error("Incorrect PIN / Password");
        setLoading(false);
        return;
      }

      const res = await loginUser({
        seed_phrase: decryptedPhrase,
      });

      if (res.success) {
        const data = res.data;

        if ("requires_2fa" in data && data.requires_2fa) {
          dispatch(
            setToken({
              token: null,
              expiresIn: 0,
              userId: data.user_id,
            })
          );
          toast.success(res.message || "2FA verification required");
          navigate("/login-verify-2fa", { replace: true });
          return;
        }

        if ("token" in data && data.token) {
          dispatch(
            setToken({
              token: data.token,
              expiresIn: data.expires_in,
              userId: data.user_id,
            })
          );
          dispatch(unlockWallet());
          toast.success(res.message || "Login successful");
          navigate("/dashboard", { replace: true });
          return;
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid Seed Phrase");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values: typeof initialValuesLogin) => {
    try {
      setLoading(true);
      const seedPhrase = values.seed_phrase.trim();
      const res = await loginUser({
        seed_phrase: seedPhrase,
      });

      if (res.success) {
        const data = res.data;

        if ("requires_2fa" in data && data.requires_2fa) {
          dispatch(
            setToken({
              token: null,
              expiresIn: 0,
              userId: data.user_id,
            })
          );
          toast.success(res.message || "2FA verification required");
          navigate("/create-password-local", {
            replace: true,
            state: { seedPhrase, requires2fa: true, userId: data.user_id },
          });
          return;
        }

        if ("token" in data && data.token) {
          toast.success(res.message || "Proceed to set your password");
          navigate("/create-password-local", {
            replace: true,
            state: {
              seedPhrase,
              initialToken: data.token,
              expiresIn: data.expires_in,
              userId: data.user_id,
            },
          });
          return;
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid Seed Phrase");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearEncryptedSeedPhrase();
    setHasWallet(false);
    toast.success("Saved wallet cleared from this device");
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
          {hasWallet ? "Unlock Wallet" : "Login"}
        </h1>

        {hasWallet ? (
          /* Unlock Mode */
          <Formik
            initialValues={initialValuesUnlock}
            validationSchema={validationSchemaUnlock}
            onSubmit={handleUnlock}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div>
                  <label className="text-[#7A7D83] mb-2 block text-lg text-left">
                    PIN / Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your PIN/Password"
                      className={`w-full rounded-[18px] border bg-[#161F37] px-5 py-3 text-white text-lg placeholder:text-[#7A7D83] focus:outline-none focus:border-[#25C866] ${
                        errors.password && touched.password
                          ? "border-[#ef4343]"
                          : "border-[#3C3D47]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-semibold transition cursor-pointer ${
                    loading
                      ? "bg-green-400 cursor-not-allowed opacity-70"
                      : "bg-[#25C866] hover:bg-green-500"
                  } text-white`}
                >
                  {loading ? "Unlocking..." : "Unlock"}
                </button>

                <div className="pt-4 border-t border-[#3C3D47]/40 mt-4">
                  <p className="text-[#7A7D83] text-sm mb-2">Want to use a different wallet?</p>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full py-3 rounded-xl font-semibold border border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343]/10 transition cursor-pointer text-sm"
                  >
                    Reset & Import Different Seed Phrase
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          /* Initial Login Mode */
          <Formik
            initialValues={initialValuesLogin}
            validationSchema={validationSchemaLogin}
            onSubmit={handleLogin}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
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
                      className={`w-full resize-none rounded-[18px] border bg-[#161F37] px-5 py-4 text-white text-lg placeholder:text-[#7A7D83] focus:outline-none focus:border-[#25C866] ${
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
                  className={`w-full py-4 rounded-xl font-semibold transition cursor-pointer ${
                    loading
                      ? "bg-green-400 cursor-not-allowed opacity-70"
                      : "bg-[#25C866] hover:bg-green-500"
                  } text-white`}
                >
                  {loading ? "Logging in..." : "Continue"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {!hasWallet && (
          <p className="text-[#7A7D83] text-sm sm:text-base mt-6">
            Don’t have a wallet?{" "}
            <Link
              to="/"
              className="text-[#25C866] font-semibold hover:underline cursor-pointer transition-all duration-500"
            >
              Register
            </Link>
          </p>
        )}
      </div>

      <CommonConfirmModal
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset Saved Wallet?"
        description="Are you sure you want to reset the saved wallet? You will need your 12-word seed phrase to log in again."
        confirmText="Yes, Reset"
        cancelText="Cancel"
      />
    </AuthLayout>
  );
}

export default Login;
