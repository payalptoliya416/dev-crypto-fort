import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import {
  getGasFee,
  getSwapQuote,
  swapToken,
} from "../../../api/transactionApi";
import TokenDropdown, { type TokenOption } from "./TokenDropdown";
import d1 from "@/assets/Ethereum.svg";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import { formatBalance, formatBalanceDecimal } from "../../component/format";
import Loader from "../../component/Loader";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

function SwapModal({ open, onClose, onSuccess }: Props) {
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );

  const wallet_id = activeWallet?.id;

  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fromCurrency?: string;
    toCurrency?: string;
    amount?: string;
  }>({});
  const [gasLoading, setGasLoading] = useState(false);
  const [gasFeeEth, setGasFeeEth] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState("");
  const [debouncedAmount, setDebouncedAmount] = useState("");
  const gasIncludedTokens = ["eth"];
  // const gasIncludedTokens = ["eth", "usdt", "usdc"];
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 800);

    return () => clearTimeout(timer);
  }, [amount]);

  const getBalance = () => {
    switch (fromCurrency) {
      case "eth":
        return activeWallet?.eth_balance || 0;

      case "usdt":
        return activeWallet?.usdt_balance || 0;

      case "usdc":
        return activeWallet?.usdc_balance || 0;

      default:
        return 0;
    }
  };

  const availableBalance = Number(getBalance());

  const swapOptions: TokenOption[] = [
    { value: "eth", label: "Ethereum", symbol: "ETH", icon: d1 },
    { value: "usdt", label: "ERC-20", symbol: "USDT", icon: d5 },
    { value: "usdc", label: "USDC (ERC20)", symbol: "USDC", icon: d4 },
  ];

  useEffect(() => {
    if (fromCurrency && toCurrency && fromCurrency === toCurrency) {
      setToCurrency("");
    }
  }, [fromCurrency, toCurrency]);

  const resetForm = () => {
    setFromCurrency("");
    setToCurrency("");
    setAmount("");
    setErrors({});
    setGasFeeEth(null);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!fromCurrency) {
      newErrors.fromCurrency = "Select from currency";
    }

    if (!toCurrency) {
      newErrors.toCurrency = "Select to currency";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (fromCurrency && toCurrency && fromCurrency === toCurrency) {
      newErrors.toCurrency = "Currencies must be different";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizeCurrency = (currency: string) => {
  return currency.toLowerCase();
};

  const fetchGasFee = async () => {
    try {
      setGasLoading(true);

      const res = await getGasFee();
      // const res = await getGasFee({ token: selectedToken, amount });
      if (res.success && res.data) {
        const gasEth = res.data.gas_fee_eth ?? res.data.gas_eth ?? "0";

        setGasFeeEth(gasEth);
      }
    } catch {
      console.error("Failed to get gas fee");
    } finally {
      setGasLoading(false);
    }
  };

  const fetchSwapQuote = async () => {
    if (!fromCurrency || !toCurrency || !amount) {
      setReceiveAmount("");
      return;
    }

    try {
      setQuoteLoading(true);

      const res = await getSwapQuote({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount: Number(debouncedAmount),
      });
      if (res.success) {
        setReceiveAmount(String(res.amount_out || 0));
      }
    } catch (error: any) {
      const apiError =
        error?.response?.data?.errors?.amount?.[0] ||
        error?.response?.data?.message ||
        error?.errors?.amount?.[0] ||
        error?.message ||
        "Failed to get quote";

      setErrors((prev) => ({
        ...prev,
        amount: apiError,
      }));

      setReceiveAmount("");
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromCurrency && toCurrency && amount) {
        fetchSwapQuote();
      } else {
        setReceiveAmount("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fromCurrency, toCurrency, debouncedAmount]);

  useEffect(() => {
    if (!open || !fromCurrency) {
      setGasFeeEth(null);
      return;
    }

    fetchGasFee();
  }, [open, fromCurrency]);

  const handleSwap = async () => {
    if (!validate()) return;

    if (!wallet_id) {
      toast.error("Wallet not found. Please refresh.");
      return;
    }
    try {
      setLoading(true);

      const payload = {
        wallet_id,
        from_currency: normalizeCurrency(fromCurrency),
        to_currency: normalizeCurrency(toCurrency),
         amount: Number(debouncedAmount),
      };

      const res = await swapToken(payload);

      if (!res.success && res.errors?.amount) {
        setErrors((prev) => ({
          ...prev,
          amount: res.errors?.amount?.[0],
        }));
        return;
      }

      if (!res.success && res.message) {
        toast.error(res.message);
        return;
      }

      if (res.success) {
        toast.success(res.message || "Swap successful");
        resetForm();
        onClose();
        await onSuccess?.();
      }
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (error?.response?.data) {
        const res = error.response.data;

        if (res?.errors?.amount?.length) {
          setErrors((prev) => ({
            ...prev,
            amount: res.errors.amount[0],
          }));
          return;
        }

        if (res?.message) {
          message = res.message;
        }
      }

      // Case 2: Your privateApi throws direct response
      else if (error?.errors?.amount?.length) {
        setErrors((prev) => ({
          ...prev,
          amount: error.errors.amount[0],
        }));
        return;
      } else if (error?.message) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const nativeTokenSymbols: Record<string, string> = {
    eth: "ETH",
    trc20: "TRX",
    usdt: "ETH",
    usdc: "ETH",
    btc: "BTC",
    bnb: "BNB",
    trx: "TRX",
  };

  const gasFeeInEth = gasFeeEth ? Number(gasFeeEth) : 0;

  const selectedNativeSymbol =
    fromCurrency && nativeTokenSymbols[fromCurrency]
      ? nativeTokenSymbols[fromCurrency]
      : "ETH";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto px-3 sm:px-5">
      <div
        onClick={() => {
          resetForm();
          onClose();
        }}
        className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[560px]">
        <div className="flex justify-end">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full 
            bg-[#202A43] text-white border border-[#3C3D47] mb-[10px]
            cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 shadow-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-[#25C866] font-medium text-base sm:text-lg mb-[20px]">
            Swap Token
          </h3>

          {/* From Currency */}
          <div className="mb-5">
            <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
              From Currency
            </label>

            <TokenDropdown
              value={fromCurrency}
              onChange={(value) => {
                setFromCurrency(value);
                if (errors.fromCurrency) {
                  setErrors((prev) => ({
                    ...prev,
                    fromCurrency: undefined,
                  }));
                }
              }}
              options={swapOptions.filter(
                (option) => option.value !== toCurrency,
              )}
              placeholder="Select currency"
              hasError={Boolean(errors.fromCurrency)}
            />

            {errors.fromCurrency && (
              <p className="text-[#ef4343] text-sm mt-1">
                {errors.fromCurrency}
              </p>
            )}
          </div>
          <div className="flex justify-between text-base text-[#7A7D83] mb-5 flex-wrap">
            <p>Available Balance</p>
            <p>
              {formatBalance(Number(availableBalance || 0))}{" "}
              {fromCurrency.toUpperCase()}
            </p>
          </div>
          {/* To Currency */}
          <div className="mb-5">
            <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
              To Currency
            </label>

            <TokenDropdown
              value={toCurrency}
              onChange={(value) => {
                setToCurrency(value);
                if (errors.toCurrency) {
                  setErrors((prev) => ({
                    ...prev,
                    toCurrency: undefined,
                  }));
                }
              }}
              options={swapOptions.filter(
                (option) => option.value !== fromCurrency,
              )}
              placeholder="Select currency"
              hasError={Boolean(errors.toCurrency)}
            />

            {errors.toCurrency && (
              <p className="text-[#ef4343] text-sm mt-1">{errors.toCurrency}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-base sm:text-lg text-[#7A7D83] block">
              Amount
            </label>
            <div className="flex gap-2">
              <input
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^\d*\.?\d*$/.test(value)) return;

                  setAmount(value);

                  if (errors.amount) {
                    setErrors((prev) => ({
                      ...prev,
                      amount: undefined,
                    }));
                  }
                }}
                placeholder="Enter amount"
                className={`w-full bg-transparent border rounded-xl px-5 py-3 text-white outline-none
                 ${errors.amount ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (!fromCurrency || gasFeeEth === null || gasLoading) return;

                  const bal = Number(availableBalance || 0);
                  const gas = Number(gasFeeEth || 0);

                  const isNativeToken =
                    gasIncludedTokens.includes(fromCurrency);

                  const maxSendable = isNativeToken ? bal - gas : bal;

                  const finalAmount = maxSendable > 0 ? maxSendable : 0;

                  setAmount(
                    finalAmount > 0 ? formatBalanceDecimal(finalAmount) : "0",
                  );
                  // if (maxSendable <= 0) {
                  //   setErrors((prev) => ({
                  //     ...prev,
                  //     amount: "Insufficient balance after gas fee",
                  //   }));

                  //   return;
                  // }
                  
                  setAmount(
                    finalAmount > 0 ? formatBalanceDecimal(finalAmount) : "0",
                  );

                  setErrors((prev) => ({
                    ...prev,
                    amount: undefined,
                  }));
                }}
                disabled={!fromCurrency || gasLoading || gasFeeEth === null}
                className="px-4 py-2 bg-[#202A43] border border-[#3C3D47] text-white rounded-xl hover:bg-[#2a3555] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                MAX
              </button>
            </div>

            {errors.amount && (
              <p className="text-[#ef4343] text-sm mt-1">{errors.amount}</p>
            )}

            {toCurrency && (
              <p className="text-[#25C866] text-sm mt-3">
                {quoteLoading
                  ? "Calculating..."
                  : `You will get: ${formatBalanceDecimal(
                      Number(receiveAmount || 0),
                    )} ${toCurrency.toUpperCase()}`}
              </p>
            )}
          </div>
          <div className="mt-[25px] space-y-5 text-sm">
            <div className="flex justify-between text-white text-base sm:text-lg font-medium">
              <p>Gas Fee ({selectedNativeSymbol})</p>
              {gasLoading ? (
                <div className="w-10 h-5 overflow-hidden">
                  <Loader />
                </div>
              ) : (
                <p>
                  {gasFeeEth
                    ? `${formatBalance(gasFeeEth)} ${selectedNativeSymbol}`
                    : "--"}
                </p>
              )}
            </div>
       <div className="flex justify-between text-white text-base sm:text-lg font-medium">
  <p>Total</p>

  <p>
    {Number(amount) > 0 ? (
      fromCurrency === "eth" ? (
        `${formatBalance(
          Number(amount || 0) + gasFeeInEth
        )} ${selectedNativeSymbol}`
      ) : (
        `${formatBalance(
          Number(amount || 0)
        )} ${fromCurrency.toUpperCase()} + ${formatBalance(
          gasFeeInEth
        )} ${selectedNativeSymbol}`
      )
    ) : (
      "--"
    )}
  </p>
</div>
          </div>

          <button
            onClick={handleSwap}
            disabled={loading}
            className="w-full mt-[30px] py-3 rounded-xl bg-[#25C866] 
            text-white font-bold cursor-pointer text-base sm:text-lg
            flex items-center justify-center gap-2
            disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Swapping...
              </>
            ) : (
              "Swap Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwapModal;
