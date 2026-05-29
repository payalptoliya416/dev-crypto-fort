import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CurrencyDropdown from "./CurrencyDropdown";
import vector from "@/assets/vector.png";
import { FiUpload } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { LuArrowLeftRight } from "react-icons/lu";
import SendTokenModal from "./SendTokenModal";
import ConfirmTransactionModal from "./ConfirmTransactionModal";
import ReceiveTokenModal from "./ReceiveTokenModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { setCurrency } from "../../../redux/currencySlice";
import { formatBalance } from "../../component/format";
import SwapModal from "./SwapModal";
import { getWallets, type Wallet } from "../../../api/walletApi";
import { getPrices } from "../../../api/publicApi";
import { setActiveWallet } from "../../../redux/activeWalletSlice";
import Loader from "../../component/Loader";
import { useRef } from "react";

export default function WalletSummary({ refreshWallets }: { refreshWallets: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [sendOpen, setSendOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [isPriceLoading, setIsPriceLoading] = useState(true);
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  console.log("activeWallet",activeWallet)
  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.currency.value);

  const handleCurrencyChange = (val: string) => {
    dispatch(setCurrency(val));
  };
  
  const ethBalanceNumber = Number(activeWallet?.eth_balance || 0);
  const usdcBalanceNumber = Number(activeWallet?.usdc_balance || 0);
  const usdtBalanceNumber = Number(activeWallet?.usdt_balance || 0);

const customTokenTotal =
  activeWallet?.custom_tokens?.reduce(
    (sum: number, token: any) =>
      sum + Number(token.balance || 0),
    0
  ) || 0;

const totalValue =
  ethBalanceNumber * ethPrice +
  usdcBalanceNumber +
  usdtBalanceNumber +
  customTokenTotal;

  const formattedBalance = formatBalance(ethBalanceNumber);
  const formattedTotal = formatBalance(totalValue, { isFiat: true });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Check if prices are already stored in localStorage
    const cachedPrices = localStorage.getItem(`ethPricesByCurrency`);

    if (cachedPrices) {
      try {
        const parsedPrices: Record<string, any> = JSON.parse(cachedPrices);
        if (parsedPrices[currency]?.price) {
          setEthPrice(parseFloat(parsedPrices[currency].price) || 0);
          setIsPriceLoading(false);
          return;
        }
      } catch (e) {
        console.error("Error parsing cached prices:", e);
      }
    }

    const fetchPrice = async () => {
      setIsPriceLoading(true);
      try {
        const response = await getPrices({
          symbols: "ETH",
          base: currency,
        });

        if (
          response.success &&
          response.prices &&
          Array.isArray(response.prices) &&
          response.prices.length > 0
        ) {
          const price = parseFloat(response.prices[0].price) || 0;
          setEthPrice(price);

          // cache karo
          const cachedPrices: Record<string, any> = {};
          try {
            const existing = localStorage.getItem("ethPricesByCurrency");
            if (existing) Object.assign(cachedPrices, JSON.parse(existing));
          } catch {}
          cachedPrices[currency] = { price: response.prices[0].price };
          localStorage.setItem("ethPricesByCurrency", JSON.stringify(cachedPrices));
        } else {
          setEthPrice(0);
        }
      } catch (error) {
        console.error("Error fetching prices");
        setEthPrice(0);
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchPrice();
  }, [currency]);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await getWallets();
        if (res.success) {
          setWallets(res.data);
        }
      } catch {
        console.log("Failed to load wallets");
      }
    };

    fetchWallets();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  <div className="relative inline-block" ref={dropdownRef}>
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-[5px]
                            text-[#7A7D83] text-sm leading-[14px]
                            hover:text-white transition cursor-pointer"
                    >
                      <span>
                        {activeWallet
                          ? activeWallet.label?.trim()
                            ? activeWallet.label
                            : `Account ${wallets.findIndex((w) => w.id === activeWallet.id) + 1}`
                          : "Select Account"}
                      </span>
                      <FaChevronDown className="text-[8px]" />
                    </button>

                    {open && (
                      <div className="absolute left-0 mt-2 w-40 max-h-60 overflow-y-auto rounded-lg bg-[#131F3A] border border-[#2A3553] shadow-lg z-50">
                        {wallets.map((wallet, index) => (
                          <button
                            key={wallet.id}
                            onClick={() => {
                              dispatch(setActiveWallet(wallet));
                              setOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-[#AEB4C2] hover:bg-[#1A2440]
                                    hover:text-white transition cursor-pointer"
                          >
                            {wallet.label?.trim()
                              ? wallet.label
                              : `Account ${index + 1}`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <CurrencyDropdown
                    value={currency}
                    onChange={handleCurrencyChange}
                  />
                </div>
              </div>
              {isPriceLoading ? (
                <div className="flex justify-center items-center py-[25px]">
                  <Loader />
                </div>
              ) : (
                <>
                  <h2 className="text-[#25C866] text-3xl xl:text-5xl font-semibold mb-[15px]">
                    {getSymbol(currency)}{formattedTotal}
                  </h2>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-[10px] text-white text-xl">
                      <img src={vector} alt="vector" />
                      <span>{formattedBalance} ETH</span>
                    </div>
                  </div>
                </>
              )}
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
              <div
                className="col-span-12 sm:col-span-4 mt-6 sm:mt-0 border border-[#3C3D47] rounded-[10px] p-[15px] flex flex-col justify-center items-center cursor-pointer"
                onClick={() => setSwapOpen(true)}
              >
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
        onSuccess={refreshWallets}
      />
      {/* ---------------------- */}
      <ReceiveTokenModal
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
      />
      {/* ------------ */}
      <SwapModal open={swapOpen} onClose={() => setSwapOpen(false)} onSuccess={refreshWallets} />
    </>
  );
}
