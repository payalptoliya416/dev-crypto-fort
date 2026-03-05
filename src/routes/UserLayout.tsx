import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div style={{ background: "#13192B", minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
};

export default UserLayout;