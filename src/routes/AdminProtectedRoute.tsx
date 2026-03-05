import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const adminToken = localStorage.getItem("admin_token");

  return adminToken ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminProtectedRoute;