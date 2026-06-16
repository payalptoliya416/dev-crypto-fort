import { useEffect, useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import CurrencyDropdown from "./CurrencyDropdown";
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
import { setActiveWallet } from "../../../redux/activeWalletSlice";
import Loader from "../../component/Loader";
import { useRef } from "react";
import WalletTrendCard from "./WalletTrendCard";
import { io } from "socket.io-client";
import { getBalanceHistory } from "../../../api/importWallet";
import { getPrices } from "../../../api/publicApi";

export default function WalletSummary({
  refreshWallets,
}: {
  refreshWallets: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [sendOpen, setSendOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const dispatch = useDispatch();
  const currency = useSelector((state: RootState) => state.currency.value);
  const [period, setPeriod] = useState("24H");
  const [openPeriod, setOpenPeriod] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const periods = ["12H", "24H", "1W", "1M", "3M", "6M", "1Y", "ALL"];
  const [priceHistory, setPriceHistory] = useState<any>(null);
  const [balanceHistory, setBalanceHistory] = useState<any>(null);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const handleCurrencyChange = (val: string) => {
    dispatch(setCurrency(val));
  };

  useEffect(() => {
    const socket = io("https://socket.cryptosfort.com", {
      transports: ["websocket"],
    });

    socket.on("priceHistory", (data) => {
      setPriceHistory(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        setIsPriceLoading(true);

        const res = await getPrices({
          base: currency,
          symbols: "ETH,BTC,USDT,BNB,TRX,USDC",
        });

        if (res?.success) {
          setMarketPrices(res.prices || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsPriceLoading(false);
      }
    };

    loadPrices();
  }, [currency]);

  const getCurrentMarketPrice = (symbol: string) => {
    const item = marketPrices.find((p: any) => p.symbol === symbol);

    return Number(item?.price || 0);
  };
  // const getTokenPrice = (symbol: string) => {
  //   return Number(
  //     priceHistory?.data?.[currency]?.[symbol]?.[0]?.price || 0
  //   );
  // };

  const totalValue =
    Number(activeWallet?.eth_balance || 0) * getCurrentMarketPrice("ETH") +
    Number(activeWallet?.btc_balance || 0) * getCurrentMarketPrice("BTC") +
    Number(activeWallet?.bnb_balance || 0) * getCurrentMarketPrice("BNB") +
    Number(activeWallet?.trx_balance || 0) * getCurrentMarketPrice("TRX") +
    Number(activeWallet?.usdt_balance || 0) * getCurrentMarketPrice("USDT") +
    Number(activeWallet?.usdc_balance || 0) * getCurrentMarketPrice("USDC");

  const customTokenTotal =
    activeWallet?.custom_tokens?.reduce((sum: number, token: any) => {
      const marketPrice = token.is_eth
        ? getCurrentMarketPrice("ETH")
        : getCurrentMarketPrice("USDT");

      const balance = Number(token.balance || 0);
      const tokenValue = balance * marketPrice;

      return sum + tokenValue;
    }, 0) || 0;

  const finalTotal = totalValue + customTokenTotal;

  const formattedTotal = formatBalance(finalTotal, { isFiat: true });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = localStorage.getItem("user_id");

        if (!userId || !activeWallet?.id) return;

        const res = await getBalanceHistory({
          user_id: Number(userId),
          wallet_id: Number(activeWallet.id),
        });
        setBalanceHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [activeWallet?.id]);

  const customTokenMap = useMemo(() => {
    const map: Record<string, boolean> = {};

    activeWallet?.custom_tokens?.forEach((token: any) => {
      map[token.symbol] = token.is_eth;
    });

    return map;
  }, [activeWallet]);
  const chartData = useMemo(() => {
    if (!balanceHistory) {
      return [];
    }

    const parseTime = (s: string) => {
      if (!s) return 0;
      return new Date(s.replace(" ", "T")).getTime();
    };

    const buildBuckets = () => {
      const now = Date.now();

      let range = 12 * 60 * 60 * 1000;
      let interval = 60 * 60 * 1000;

      switch (period) {
        case "12H":
          range = 12 * 60 * 60 * 1000;
          interval = 60 * 60 * 1000;
          break;

        case "24H":
          range = 24 * 60 * 60 * 1000;
          interval = 60 * 60 * 1000;
          break;

        case "1W":
          range = 7 * 24 * 60 * 60 * 1000;
          interval = 6 * 60 * 60 * 1000;
          break;

        case "1M":
          range = 30 * 24 * 60 * 60 * 1000;
          interval = 24 * 60 * 60 * 1000;
          break;

        case "3M":
          range = 90 * 24 * 60 * 60 * 1000;
          interval = 3 * 24 * 60 * 60 * 1000;
          break;

        case "6M":
          range = 180 * 24 * 60 * 60 * 1000;
          interval = 7 * 24 * 60 * 60 * 1000;
          break;

        case "1Y":
          range = 365 * 24 * 60 * 60 * 1000;
          interval = 30 * 24 * 60 * 60 * 1000;
          break;

        case "ALL": {
          const createdAt = activeWallet?.created_date
            ? new Date(activeWallet.created_date).getTime()
            : now;

          range = now - createdAt;

          const totalDays = Math.ceil(range / (24 * 60 * 60 * 1000));

          if (totalDays <= 90) {
            interval = 24 * 60 * 60 * 1000;
          } else if (totalDays <= 365) {
            interval = 7 * 24 * 60 * 60 * 1000;
          } else {
            interval = 30 * 24 * 60 * 60 * 1000;
          }

          break;
        }
      }

      const cutoffTime = now - range;

      const buckets: number[] = [];

      for (let t = cutoffTime; t <= now; t += interval) {
        buckets.push(t);
      }

      const lastBucket = buckets[buckets.length - 1];

      if (!lastBucket || now - lastBucket > 60 * 1000) {
        buckets.push(now);
      }

      return buckets;
    };

    const priceMap: Record<string, any[]> = {};
    if (priceHistory?.data?.[currency]) {
      Object.keys(priceHistory.data[currency]).forEach((k) => {
        priceMap[k] = priceHistory.data[currency][k] || [];
      });
    }

    const buckets = buildBuckets();

    const finalData = buckets.map((bucketTime) => {
      let total = 0;

      Object.entries(balanceHistory).forEach(([symbol, balances]: any) => {
        const isCustomToken = Object.prototype.hasOwnProperty.call(
          customTokenMap,
          symbol,
        );

        const marketSymbol = isCustomToken
          ? customTokenMap[symbol]
            ? "ETH"
            : "USDT"
          : symbol;
        const prices = priceMap[marketSymbol] || [];

        const candidateBalances = balances
          .map((b: any) => ({
            ...b,
            _t: parseTime(b.recorded_at),
          }))
          .filter((b: any) => b._t <= bucketTime)
          .sort((a: any, b: any) => b._t - a._t);

        const latestBalance = candidateBalances[0];
        if (!latestBalance) return;

        // Find candidate prices that were recorded before or at bucketTime
        const candidatePrices = prices
          .map((p: any) => ({
            ...p,
            _t: parseTime(p.recorded_at),
          }))
          .filter((p: any) => p._t <= bucketTime)
          .sort((a: any, b: any) => b._t - a._t);

        // Fallback to the oldest price record if bucketTime is before any price recordings
        const matchedPrice =
          candidatePrices[0] ||
          prices
            .map((p: any) => ({
              ...p,
              _t: parseTime(p.recorded_at),
            }))
            .sort((a: any, b: any) => a._t - b._t)[0] || {
            price: getCurrentMarketPrice(marketSymbol),
          };

        if (!matchedPrice) {
          return;
        }

        total +=
          Number(latestBalance.balance) * Number(matchedPrice.price || 0);
      });

      return {
        date: new Date(bucketTime).toISOString(),
        value: total,
      };
    });

    if (finalData.length > 0) {
      finalData[finalData.length - 1] = {
        ...finalData[finalData.length - 1],
        value: finalTotal,
      };
    }

    return finalData;
  }, [
    balanceHistory,
    priceHistory,
    marketPrices,
    currency,
    customTokenMap,
    finalTotal,
    period,
  ]);

  const portfolioChange = useMemo(() => {
    if (chartData.length < 2) return 0;

    const previousTotal = Number(chartData[0]?.value || 0);

    const currentTotal = finalTotal;

    if (previousTotal <= 0 || currentTotal <= 0) {
      return 0;
    }

    const change = ((currentTotal - previousTotal) / previousTotal) * 100;

    return Number(change.toFixed(2));
  }, [chartData, finalTotal, period]);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        periodRef.current &&
        !periodRef.current.contains(event.target as Node)
      ) {
        setOpenPeriod(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  <div className="flex sm:items-center gap-3 flex-col sm:flex-row">
                    <div>
                      <h2 className="text-white mb-1 text-sm">Total Worth :</h2>
                      <h2 className="text-[#25C866] text-2xl font-semibold mb-[15px]">
                        {getSymbol(currency)}
                        {formattedTotal}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-white text-xs px-2 py-1 rounded ${
                            portfolioChange >= 0 ? "bg-[#25C866]" : "bg-red-500"
                          }`}
                        >
                          {portfolioChange >= 0 ? "▲" : "▼"}
                          {Math.abs(portfolioChange).toFixed(2)}%
                        </span>

                        <div ref={periodRef} className="relative inline-block">
                          <button
                            onClick={() => setOpenPeriod(!openPeriod)}
                            className="bg-[#202A43] border border-[#3C3D47] rounded-lg py-1 px-3 flex items-center gap-2 text-white text-xs cursor-pointer"
                          >
                            <span>{period}</span>
                            <FaChevronDown
                              className={`text-[8px] transition ${
                                openPeriod ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {openPeriod && (
                            <div className="absolute left-0 mt-2 w-full rounded-lg bg-[#131F3A] border border-[#2A3553] shadow-xl z-50">
                              {periods.map((item) => (
                                <button
                                  key={item}
                                  onClick={() => {
                                    setPeriod(item);
                                    setOpenPeriod(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-[#AEB4C2] hover:bg-[#1A2440] hover:text-white cursor-pointer"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:flex-1 min-w-0 h-[90px]">
                    <WalletTrendCard history={chartData} />
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
      <SwapModal
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        onSuccess={refreshWallets}
      />
    </>
  );
}
