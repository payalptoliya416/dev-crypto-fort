import AppLogo from "../component/AppLogo";


type AuthLayoutProps = {
  children: React.ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="
        relative min-h-screen w-full
        bg-[#13192B]
        p-4 sm:p-6.25
        flex justify-center
        items-start sm:items-center
      "
    >
      {/* ================= TOP LEFT LOGO ================= */}
      <AppLogo />

      {/* ================= PAGE CONTENT ================= */}
      {children}
    </div>
  );
}

export default AuthLayout;
