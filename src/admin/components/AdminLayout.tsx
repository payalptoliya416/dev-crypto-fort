import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import TopNavbar from "./TopNavbar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen bg-[#0f1a2f] items-stretch">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute left-0 top-0 min-h-screen w-64 bg-[#0F1E38] border-r border-[#24324D]">
            <AdminSidebar />
          </div>

        </div>
      )}

      {/* Main Section */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <TopNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        {/* <footer className="px-6 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-gray-400 text-sm">

            <p className="text-center md:text-left">
              Copyright © {currentYear} crypto fort OpenSource Wallet.
            </p>

            <div className="flex gap-6">
              <a href="#" className="hover:text-white">
                Privacy policy
              </a>
              <a href="#" className="hover:text-white">
                Terms use
              </a>
            </div>

          </div>
        </footer> */}

      </div>
    </div>
  );
}

export default AdminLayout;