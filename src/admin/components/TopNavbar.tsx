import { FiMenu } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronDown, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { adminLogout, changeAdminPassword } from "../adminapi/adminAuthApi";

type Props = {
  toggleSidebar: () => void;
};

function TopNavbar({ toggleSidebar }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin/transaction") return "Transactions";
    if (path === "/admin/users") return "Active Clients";
    if (path.includes("/admin/users/")) return "User Details";

    return "Dashboard";
  };

  const isUserDetails = location.pathname.includes("/admin/users/");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowChangePassword(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("admin_name");

    if (name) {
      setAdminName(name);
    }
  }, []);

  const resetPasswordVisibility = () => {
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await adminLogout();
    } catch (e) {
      // even if API fails, logout locally
    }

    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");

    toast.success("Logged out successfully");

    navigate("/admin");
    setLogoutLoading(false);
  };

  return (
    <>
      <div className=" px-5 py-4 bg-[#161F37] border-b border-[#24324D]">
        {/* Mobile Menu */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white text-xl me-3"
          >
            <FiMenu />
          </button>

          <div className="hidden md:block">
            {isUserDetails ? (
              <>
                <span
                  onClick={() => navigate("/admin/users")}
                  className="cursor-pointer text-gray-400 hover:text-white"
                >
                  Active Clients
                </span>

                <span className="text-gray-500 mx-1">/</span>

                <span className="text-white">User Details</span>
              </>
            ) : (
              <span className="text-white">{getPageTitle()}</span>
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto relative">
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-5 px-5 py-2 rounded-xl cursor-pointer hover:bg-[#1F2A44] transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">
                  {" "}
                  {adminName || "Admin"}
                </span>

                <IoChevronDown
                  className={`text-gray-400 transition-transform duration-200 ${
                    openMenu ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Dropdown */}
            {openMenu && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 w-56 bg-[#0F1A2F] border border-[#24324D] rounded-xl shadow-2xl overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-[#24324D]">
                  <p className="text-white text-sm font-semibold">User</p>
                  <p className="text-gray-400 text-xs">Administrator</p>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowChangePassword(true);
                      setOpenMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-gray-300 hover:bg-[#1F2A44] hover:text-white transition text-sm cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-[#24324D]">
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-[#1F2A44] transition text-sm cursor-pointer disabled:opacity-50"
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="block md:hidden mt-2">
          {isUserDetails ? (
            <>
              <span
                onClick={() => navigate("/admin/users")}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                Active Clients
              </span>

              <span className="text-gray-500 mx-1">/</span>

              <span className="text-white">User Details</span>
            </>
          ) : (
            <span className="text-white">{getPageTitle()}</span>
          )}
        </div>
      </div>
      {showChangePassword && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-10 px-4"
        >
          <div className="w-full max-w-[500px] rounded-2xl bg-[#0B1220] border border-[#1F2A44] p-8 shadow-xl">
            <h3 className="text-xl text-white font-semibold mb-6 text-center">
              Change Password
            </h3>

            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                oldPassword: Yup.string().required("Old password is required"),
                newPassword: Yup.string()
                  .min(8, "Minimum 8 characters")
                  .required("New password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("newPassword")], "Passwords must match")
                  .required("Confirm password is required"),
              })}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                  const res = await changeAdminPassword({
                    old_password: values.oldPassword,
                    new_password: values.newPassword,
                    confirm_password: values.confirmPassword,
                  });

                  toast.success(res.message);

                  resetForm();
                  setShowChangePassword(false);
                  resetPasswordVisibility();
                } catch (err: any) {
                  toast.error(err.message || "Failed to change password");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label className="text-gray-400 block mb-2 text-left">
                      Old Password
                    </label>

                    <div className="relative">
                      <Field
                        name="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        className="w-full rounded-xl bg-[#0F1A2F] px-5 py-3 text-white border border-[#1F2A44] focus:border-[#25C866] outline-none pr-12"
                      />

                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showOldPassword ? (
                          <IoEyeOffOutline
                            size={20}
                            className="cursor-pointer"
                          />
                        ) : (
                          <IoEyeOutline size={20} className="cursor-pointer" />
                        )}
                      </button>
                    </div>

                    <ErrorMessage
                      name="oldPassword"
                      component="p"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-2 text-left">
                      New Password
                    </label>

                    <div className="relative">
                      <Field
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className="w-full rounded-xl bg-[#0F1A2F] px-5 py-3 text-white border border-[#1F2A44] focus:border-[#25C866] outline-none pr-12"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showNewPassword ? (
                          <IoEyeOffOutline
                            size={20}
                            className="cursor-pointer"
                          />
                        ) : (
                          <IoEyeOutline size={20} className="cursor-pointer" />
                        )}
                      </button>
                    </div>

                    <ErrorMessage
                      name="newPassword"
                      component="p"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-2 text-left">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full rounded-xl bg-[#0F1A2F] px-5 py-3 text-white border border-[#1F2A44] focus:border-[#25C866] outline-none pr-12"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPassword ? (
                          <IoEyeOffOutline
                            size={20}
                            className="cursor-pointer"
                          />
                        ) : (
                          <IoEyeOutline size={20} className="cursor-pointer" />
                        )}
                      </button>
                    </div>

                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        resetPasswordVisibility();
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#374151] hover:bg-[#4B5563] text-white cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-[#25C866] hover:bg-green-500 text-white font-semibold disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
}

export default TopNavbar;
