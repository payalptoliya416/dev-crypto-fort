import { Outlet } from "react-router-dom";

function UserAdminLayout() {
  return (
    <div className="bg-[#13192B]">
      <Outlet />
    </div>
  );
}

export default UserAdminLayout;