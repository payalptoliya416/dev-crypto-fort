import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store/store";

function ProtectedRoute() {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
