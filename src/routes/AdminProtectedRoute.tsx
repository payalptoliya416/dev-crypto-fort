import { Navigate, Outlet } from "react-router-dom";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_TOKEN_EXPIRY_KEY = "admin_token_expiry";
const ADMIN_NAME_KEY = "admin_name";

const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(ADMIN_NAME_KEY);

   localStorage.removeItem("admin_2fa_verified");
};

const isAdminTokenExpired = () => {
  const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  const expiryTime = Number(expiry);
  if (Number.isNaN(expiryTime)) return true;
  return Date.now() >= expiryTime;
};

const AdminProtectedRoute = () => {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const verified = localStorage.getItem("admin_2fa_verified");
  if (!adminToken || isAdminTokenExpired()) {
    clearAdminSession();
    return <Navigate to="/admin" replace />;
  }
  if (verified !== "true") {
    return <Navigate to="/admin/2fa" replace />;
  }
  return <Outlet />;
};

export default AdminProtectedRoute;