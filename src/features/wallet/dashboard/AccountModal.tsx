import toast from "react-hot-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  onAddAccount: () => void; 
}

const accounts = [
  {
    name: "Ethereum Mainnet",
    address: "0xA3f9...4E912",
    balance: "10.25 ETH",
    active: true,
  },
  {
    name: "Account 1",
    address: "0xF65...46924",
    balance: "5.50 ETH",
    active: false,
  },
  {
    name: "Account 2",
    address: "0xH82...4K432",
    balance: "15.05 ETH",
    active: false,
  },
];

function AccountModal({ open, onClose ,onAddAccount}: AccountModalProps) {
  if (!open) return null;

const handleCopy = async (address: string) => {
  try {
    await navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  } catch {
    toast.error("Failed to copy!");
  }
};

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center  overflow-y-auto p-5">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-[560px]">
        <div className="flex justify-end">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#202A43] text-white hover:bg-[#2a3553] border border-[#3C3D47] mb-[10px] shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer" >
          <IoClose size={20} />
        </button>
        </div>
      <div className=" rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]  max-h-[90vh] overflow-y-auto">
        <h3 className="text-[#25C866] font-medium text-lg mb[15px]">
          Account
        </h3>

        {/* Account List */}
        <div className="space-y-3">
          {accounts.map((acc, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-5 rounded-xl border border-[#25C8661A]
              ${acc.active ? "bg-[#25C8660D]" : "bg-transparent"}`}
            >
              {/* Left */}
              <div>
                <p className="text-white text-lg font-normal mb-[5px]">{acc.name}</p>
                <p className="text-sm text-[#7A7D83]">{acc.address}</p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <p className="text-white text-lg">{acc.balance}</p>

                <button  onClick={() => handleCopy(acc.address)} className="border border-[#FFFFFF0D] w-[46px] h-[46px] rounded-[14px] flex justify-center items-center cursor-pointer">
                  <BsThreeDotsVertical size={20} className="text-[#7A7D83]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onAddAccount}
          className="w-full mt-[30px] py-[18px] rounded-xl bg-[#25C866] text-white font-bold hover:opacity-90 transition cursor-pointer text-lg"
        >
          Add New Account
        </button>
      </div>
      </div>
      </div>
  );
}

export default AccountModal;
