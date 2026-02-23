import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CurrencyDropdown from "./CurrencyDropdown";
import vector from "@/assets/vector.png";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { LuArrowLeftRight } from "react-icons/lu";
import SendTokenModal from "./SendTokenModal";
import ConfirmTransactionModal from "./ConfirmTransactionModal";
import ReceiveTokenModal from "./ReceiveTokenModal";

export default function WalletSummary() {
  const [open, setOpen] = useState(false);
  const accounts = ["Account 1", "Account 2", "Account 3"];
  const [sendOpen, setSendOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
const [currency, setCurrency] = useState("USD");
const [ethPrice, setEthPrice] = useState(0);

const ethBalance = 28.05605;
const totalValue = ethBalance * ethPrice;

useEffect(() => {
  const fetchPrice = async () => {
     const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur,gbp,aed,aud,cad,nok,nzd,chf,btc`
      );
    const data = await res.json();
    setEthPrice(data.ethereum[currency.toLowerCase()]);
  };

  fetchPrice();
}, [currency]);

const getSymbol = (cur: string) => {
  const symbols: any = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
    AUD: "A$",
    CAD: "C$",
    NOK: "kr",
    NZD: "NZ$",
    CHF: "CHF",
    BTC: "₿",
  };

  return symbols[cur] || "";
};

  return (
    <>
      <div className="w-full rounded-2xl bg-[#161F37] border border-[#3C3D47] p-4 sm:p-5 mb-[15px]">
        <div className="grid grid-cols-12 lg:gap-[55px] items-center">
          <div
            className="col-span-12 lg:col-span-6 relative after:content-[''] lg:after:absolute after:top-[10%] after:-right-5
           after:h-[80%] after:w-[1px] after:bg-[#3C3D47]"
          >
            <div>
              <div className="flex justify-between items-start mb-[15px]">
                <div>
                  <p className="text-[#25C866] text-lg leading-[18px] font-medium mb-[6px]">
                    My Wallet
                  </p>
                  <div className="relative inline-block">
                    {/* Trigger */}
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-[5px]
                            text-[#7A7D83] text-sm leading-[14px]
                            hover:text-white transition cursor-pointer"
                    >
                      <span>Account 1</span>
                      <FaChevronDown className="text-[8px]" />
                    </button>

                    {/* Dropdown */}
                    {open && (
                      <div
                        className="
                                absolute left-0 mt-2
                                w-28
                                rounded-lg
                                bg-[#131F3A]
                                border border-[#2A3553]
                                shadow-lg
                                z-50
                            "
                      >
                        {accounts.map((acc) => (
                          <button
                            key={acc}
                            onClick={() => {
                              setOpen(false);
                            }}
                            className="
                                    w-full text-left
                                    px-3 py-2
                                    text-xs text-[#AEB4C2]
                                    hover:bg-[#1A2440]
                                    hover:text-white
                                    transition
                                "
                          >
                            {acc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                 <CurrencyDropdown value={currency} onChange={setCurrency} />
                </div>
              </div>
             <h2 className="text-[#25C866] text-3xl xl:text-5xl font-semibold mb-[15px]">
              {getSymbol(currency)}
              {totalValue?.toLocaleString()}
            </h2>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-[10px] text-white text-xl">
                  <img src={vector} alt="vector" />
                 <span>{ethBalance} ETH</span>
                </div>
                <div className="bg-[#25C8660D] rounded-lg py-[6px] px-[10px] flex items-center gap-[5px] text-[#25C866] text-xs">
                  <FaArrowTrendUp className="" /> +79.79 (2.85%)
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 mt-6 lg:mt-0">
            <div className="grid grid-cols-12 sm:gap-5">
              <div
                className="col-span-12 sm:col-span-4 border border-[#3C3D47] rounded-[10px] p-[15px] flex flex-col justify-center items-center cursor-pointer"
                onClick={() => setSendOpen(true)}
              >
                <div className="w-10 md:w-[52px] h-10 sm:h-[50px] rounded-[10px] flex justify-center items-center bg-[#202A43] text-white mb-[15px]">
                  <FiUpload className="text-base sm:text-[22px]" />
                </div>
                <h4 className="text-white smtext-base :text-xl">Send</h4>
              </div>
              <div
                className="col-span-12 sm:col-span-4 mt-6 sm:mt-0 border border-[#3C3D47] rounded-[10px] p-[15px] flex flex-col justify-center items-center cursor-pointer"
                onClick={() => setReceiveOpen(true)}
              >
                <div className="w-10 md:w-[52px] h-10 sm:h-[50px] rounded-[10px] flex justify-center items-center bg-[#202A43] text-white mb-[15px]">
                  <HiOutlineDownload className="text-base sm:text-[22px]" />
                </div>
                <h4 className="text-white smtext-base :text-xl">Receive</h4>
              </div>
              <div className="col-span-12 sm:col-span-4 mt-6 sm:mt-0 border border-[#3C3D47] rounded-[10px] p-[15px] flex flex-col justify-center items-center cursor-pointer">
                <div className="w-10 md:w-[52px] h-10 sm:h-[50px] rounded-[10px] flex justify-center items-center bg-[#202A43] text-white mb-[15px]">
                  <LuArrowLeftRight className="text-base sm:text-[22px]" />
                </div>
                <h4 className="text-white smtext-base :text-xl">Swap</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------- */}
      <SendTokenModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onNext={() => {
          setSendOpen(false);
          setConfirmOpen(true);
        }}
      />
      {/* ---------------------- */}
      <ConfirmTransactionModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      {/* ---------------------- */}
      <ReceiveTokenModal
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
      />

    </>
  );
}
