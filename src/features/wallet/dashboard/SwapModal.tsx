import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useState } from "react";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import { swapToken } from "../../../api/transactionApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

function SwapModal({ open, onClose }: Props) {
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
  const resetForm = () => {
    setFromCurrency("");
    setToCurrency("");
    setAmount("");
    setErrors({});
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
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount: Number(amount),
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

            <select
              value={fromCurrency}
              onChange={(e) => {
                setFromCurrency(e.target.value);
                if (errors.fromCurrency) {
                  setErrors((prev) => ({
                    ...prev,
                    fromCurrency: undefined,
                  }));
                }
              }}
              className={`w-full bg-[#161F37] border rounded-xl px-5 py-3 text-white outline-none
              ${errors.fromCurrency ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
            >
              <option value="">Select currency</option>
              <option value="eth">ETH</option>
              <option value="usdt">USDT</option>
              <option value="btc">BTC</option>
            </select>

            {errors.fromCurrency && (
              <p className="text-[#ef4343] text-sm mt-1">
                {errors.fromCurrency}
              </p>
            )}
          </div>

          {/* To Currency */}
          <div className="mb-5">
            <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
              To Currency
            </label>

            <select
              value={toCurrency}
              onChange={(e) => {
                setToCurrency(e.target.value);
                if (errors.toCurrency) {
                  setErrors((prev) => ({
                    ...prev,
                    toCurrency: undefined,
                  }));
                }
              }}
              className={`w-full bg-[#161F37] border rounded-xl px-5 py-3 text-white outline-none
              ${errors.toCurrency ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
            >
              <option value="">Select currency</option>
              <option value="eth">Ethereum</option>
              <option value="usdt">ERC-20</option>
            </select>

            {errors.toCurrency && (
              <p className="text-[#ef4343] text-sm mt-1">{errors.toCurrency}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
              Amount
            </label>

            <input
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (!/^\d*\.?\d*$/.test(value)) return;

                setAmount(value);

                if (errors.amount) {
                  setErrors((prev) => ({ ...prev, amount: undefined }));
                }
              }}
              placeholder="Enter amount"
              className={`w-full bg-transparent border rounded-xl px-5 py-3 text-white outline-none
              ${errors.amount ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
            />

            {errors.amount && (
              <p className="text-[#ef4343] text-sm mt-1">{errors.amount}</p>
            )}
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
