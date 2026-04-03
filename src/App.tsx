import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateWallet from "./features/wallet/pages/CreateWallet";
import RecoveryPhrase from "./features/wallet/pages/RecoveryPhrase";
import SecureWallet from "./features/wallet/pages/SecureWallet";
import { Toaster } from "react-hot-toast";
import PrivateKey from "./features/wallet/pages/PrivateKey";
import SeedPhrase from "./features/wallet/pages/SeedPhrase";
import ExistingWallet from "./features/wallet/pages/ExistingWallet";
import Dashboard from "./features/wallet/dashboard/Dashboard";
import Balance from "./features/wallet/balance/Balance";
import Transaction from "./features/wallet/transaction/Transaction";
import Login from "./features/wallet/pages/Login";
import NotFound from "./routes/NotFound";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./admin/pages/dashboard/AdminDashboard";
import AdminLayout from "./admin/components/AdminLayout";
import AdminUsers from "./admin/pages/users/AdminUsers";
import InnerUsers from "./admin/pages/users/InnerUsers";
import TwoFactorSetup from "./features/wallet/auth/TwoFactorSetup";
import Verify2FA from "./features/wallet/auth/Verify2FA";
import LoginVerify2FA from "./features/wallet/auth/LoginVerify2FA";
import UserProtectedRoute from "./routes/UserProtectedRoute";
import SiteRoute from "./routes/SiteRoute";
import UserAdminLayout from "./routes/UserAdminLayout";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#202A43",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SiteRoute/>} />
          
          <Route element={<UserAdminLayout />}>
          <Route path="/user">
            <Route index element={<CreateWallet />} />
            <Route path="login" element={<Login />} />
            <Route path="recovery-phrase" element={<RecoveryPhrase />} />
            <Route path="create-password" element={<SecureWallet />} />
            <Route path="setup-2fa" element={<TwoFactorSetup />} />
            <Route path="verify-2fa" element={<Verify2FA />} />
            <Route path="login-verify-2fa" element={<LoginVerify2FA />} />

            <Route path="existing-wallet" element={<ExistingWallet />} />
            <Route path="private-key" element={<PrivateKey />} />
            <Route path="seed-phrase" element={<SeedPhrase />} />

            <Route element={<UserProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="balance" element={<Balance />} />
              <Route path="transaction" element={<Transaction />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/user-details" element={<InnerUsers />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
