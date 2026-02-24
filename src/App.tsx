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
import ProtectedRoute from "./routes/ProtectedRoute";

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
          <Route path="/" element={<CreateWallet />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recovery-phrase" element={<RecoveryPhrase />} />
          <Route path="/create-password" element={<SecureWallet />} />

          <Route path="/existing-wallet" element={<ExistingWallet />} />
          <Route path="/private-key" element={<PrivateKey />} />
          <Route path="/seed-phrase" element={<SeedPhrase />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/transaction" element={<Transaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
