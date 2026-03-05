import { FiMenu } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import avatar from "@/assets/admin/user.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type Props = {
  toggleSidebar: () => void;
};

function TopNavbar({ toggleSidebar }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);
const modalRef = useRef<HTMLDivElement>(null);
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
  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 bg-[#161F37] border-b border-[#24324D]">
        {/* Mobile Menu */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white text-xl"
        >
          <FiMenu />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto relative">
          {/* Notification */}
          {/* <button className="text-white text-xl bg-[#1c2745] p-3 rounded-full">
            <FiBell />
          </button> */}

          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-3 bg-[#1c2745] px-3 py-2 rounded-full cursor-pointer"
          >
            <img src={avatar} className="w-8 h-8 rounded-full object-cover" />

            <span className="text-white font-medium">User</span>
          </div>

          {openMenu && (
            <div   ref={dropdownRef} className="absolute right-0 top-14 w-52 bg-[#0F1A2F] border border-[#24324D] rounded-xl shadow-xl overflow-hidden">
              <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-[#1F2A44] transition">
                Settings
              </button>

              <button
                onClick={() => {
                  setShowChangePassword(true);
                  setOpenMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-200 hover:bg-[#1F2A44] transition"
              >
                Change Password
              </button>

              <div className="border-t border-[#24324D]" />

              <button className="w-full text-left px-4 py-3 text-red-400 hover:bg-[#1F2A44] transition">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showChangePassword && (
        <div   ref={modalRef} className="fixed inset-0 bg-black/80 flex items-center justify-center z-0 px-4">
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
                  .min(6, "Minimum 6 characters")
                  .required("New password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("newPassword")], "Passwords must match")
                  .required("Confirm password is required"),
              })}
              onSubmit={(values) => {
                console.log(values);
                setShowChangePassword(false);
              }}
            >
              {() => (
                <Form className="space-y-5">
                  <div>
                    <label className="text-gray-400 block mb-2 text-left">
                      Old Password
                    </label>
                    <Field
                      name="oldPassword"
                      type="password"
                      className="w-full rounded-xl bg-[#0F1A2F] px-5 py-3 text-white border border-[#1F2A44] focus:border-[#25C866] outline-none"
                    />
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
                    <Field
                      name="newPassword"
                      type="password"
                      className="w-full rounded-xl bg-[#0F1A2F] px-5 py-3 text-white border border-[#1F2A44] focus:border-[#25C866] outline-none"
                    />
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
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="w-full rounded-xl bg-[#0F1A2F] px-5 py-3 text-white border border-[#1F2A44] focus:border-[#25C866] outline-none"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowChangePassword(false)}
                      className="flex-1 py-3 rounded-xl bg-[#374151] hover:bg-[#4B5563] text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-[#25C866] hover:bg-green-500 text-white font-semibold"
                    >
                      Update
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
