import TopHeader from "../wallet/header/TopHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full flex justify-center font-noto p-4 sm:p-5">
      <div className="w-full max-w-[1080px]">
        <TopHeader />

        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
