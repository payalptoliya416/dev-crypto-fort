import DashboardLayout from "../../layout/DashboardLayout"
import AssetsTab from "./AssetsTab"
import WalletSummary from "./WalletSummary"

function Dashboard() {
  return (
    <>
      <DashboardLayout>
        <WalletSummary/>
        <AssetsTab/>
      </DashboardLayout>
    </>
  )
}

export default Dashboard
