import type { Column } from "../../components/CommonTable";
import CommonTable from "../../components/CommonTable";

interface Transaction {
  id: number;
  clientName: string;
  email: string;
  action: string;
  timestamp: string;
}

function AdminDashboard() {
  const data: Transaction[] = [
    {
      id: 1,
      clientName: "Testname Surnametest",
      email: "cacokif578@fandoe.com",
      action: "Internal ETH deposit of 0.00012943580466465 ETH received.",
      timestamp: "Mar 05, 2026, 03:30 PM",
    },
    {
      id: 2,
      clientName: "Testname Surnametest",
      email: "cacokif578@fandoe.com",
      action: "Internal ETH deposit of 0.00051706261394543 ETH received.",
      timestamp: "Mar 05, 2026, 12:20 PM",
    },
    {
      id: 3,
      clientName: "Testname Surnametest",
      email: "cacokif578@fandoe.com",
      action: "Internal ETH deposit of 0.00041591127460163 ETH received.",
      timestamp: "Mar 05, 2026, 12:00 PM",
    },
  ];

  const columns: Column<Transaction>[] = [
    {
      header: "Client Name",
      accessor: "clientName",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Action",
      accessor: "action",
    },
    {
      header: "Timestamp",
      accessor: "timestamp",
    },
   
  ];

  return (
    <div>
      <div className="bg-[#16233A] border border-[#24324D] shadow-lg rounded-[10px]">
        <div className="flex justify-between items-center p-5 border-b border-bordercolor flex-wrap gap-4">
          <h3 className="text-lg font-semibold text-white">
            Transactions History
          </h3>

          <input
            type="search"
            placeholder="Search by name or email..."
            className="border border-[#24324D] bg-[#16233A] text-white rounded-lg px-4 py-2 text-sm w-full sm:w-72 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <CommonTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default AdminDashboard;
