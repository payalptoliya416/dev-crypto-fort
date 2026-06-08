import { NavLink } from "react-router-dom";
import logo from "@/assets/logo_svg.svg";
import { FiRepeat, FiUsers } from "react-icons/fi";
import { MdOutlineAddCircleOutline } from "react-icons/md";

function AdminSidebar() {
  return (
    <div className="w-64 h-full bg-[#0F1E38] border-r border-[#24324D] flex flex-col">
      <div className="px-6 py-[18.5px] border-b border-[#24324D]">
        <img src={logo} alt="logo" className="w-full max-w-[200px]" />
      </div>

      <nav className="flex flex-col gap-2 mt-6 px-4">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
            ${
              isActive
                ? "bg-[#1C2E4A] text-white"
                : "text-gray-400 hover:bg-[#15243D] hover:text-white"
            }`
          }
        >
          <FiUsers size={18} />
          Active Clients
        </NavLink>
        <NavLink
          to="/admin/transaction"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
            ${
              isActive
                ? "bg-[#1C2E4A] text-white"
                : "text-gray-400 hover:bg-[#15243D] hover:text-white"
            }`
          }
        >
          <FiRepeat size={18} />
          Transaction
        </NavLink>
        <NavLink
          to="/admin/custom-tokens"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
            ${
              isActive
                ? "bg-[#1C2E4A] text-white"
                : "text-gray-400 hover:bg-[#15243D] hover:text-white"
            }`
          }
        >
        <MdOutlineAddCircleOutline size={18} />
          Add Custom Token
        </NavLink>
      </nav>
    </div>
  );
}

export default AdminSidebar;
