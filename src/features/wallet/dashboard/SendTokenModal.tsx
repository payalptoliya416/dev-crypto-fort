import { IoClose } from "react-icons/io5";
import type { RootState } from "../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getGasFee } from "../../../api/transactionApi";
import ButtonLoader from "../../component/ButtonLoader";
import Loader from "../../component/Loader";
import { formatBalance } from "../../component/format";
import { setTransactionData } from "../../../redux/transactionSlice";
interface SendTokenModalProps {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
}

function SendTokenModal({ open, onClose, onNext }: SendTokenModalProps) {
  const activeWallet = useSelector(
  (state: RootState) => state.activeWallet.wallet
);
  const dispatch = useDispatch();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [gasLoading, setGasLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [gasFee, setGasFee] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    toAddress?: string;
    amount?: string;
  }>({});
  const gasFeeInEth = gasFee ? Number(gasFee) / 1_000_000_000 : 0;
  const totalCost = Number(amount || 0) + gasFeeInEth;

  useEffect(() => {
  if (!open) return;

  if (activeWallet?.address) {
    setToAddress(activeWallet.address);
  }
}, [open, activeWallet]);

  useEffect(() => {
    if (!open) return;

    const fetchGasFee = async () => {
      try {
        setGasLoading(true);

        const res = await getGasFee();
        if (res.success && res.data) {
          setGasFee(res.data.gas_eth);
        }
      } catch (e) {
        console.error("Failed to get gas fee");
      } finally {
        setGasLoading(false);
      }
    };

    fetchGasFee();
  }, [open]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!toAddress.trim()) {
      newErrors.toAddress = "Recipient address is required";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApiErrors = (apiErrors: Record<string, string[]>) => {
    const newErrors: typeof errors = {};
    let generalError: string | null = null;

    Object.entries(apiErrors).forEach(([key, messages]) => {
      const message = messages[0]; // first error message

      if (key === "to_address") {
        newErrors.toAddress = message;
      } else if (key === "amount") {
        newErrors.amount = message;
      } else {
        // wallet_id or any other backend error
        generalError = message;
      }
    });

    setErrors(newErrors);
    setFormError(generalError);
  };

const handleSend = () => {
  if (!validate()) return;

  const gasFeeInEth = gasFee ? Number(gasFee) / 1_000_000_000 : 0;
  const totalCost = Number(amount || 0) + gasFeeInEth;

  // ✅ store data in redux
  dispatch(
    setTransactionData({
      toAddress,
      amount,
      gasFee: gasFee || "0",
      totalCost: totalCost.toString(),
    })
  );

  // ✅ move to confirm modal
  onClose();
  onNext();
};


  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center  overflow-y-auto p-5">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-[#121316]/40 backdrop-blur-sm"
        />

        <div className="relative w-full max-w-[560px]">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full 
            bg-[#202A43] text-white border border-[#3C3D47] mb-[10px]
            shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)] cursor-pointer"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="rounded-2xl bg-[#161F37] border border-[#3C3D47] p-5 z-10 shadow-[8px_10px_80px_0px_rgba(0,0,0,0.2)]  max-h-[90vh] overflow-y-auto">
            <h3 className="text-[#25C866] font-medium text-lg mb-[15px]">
              Send Token
            </h3>
            {formError && (
              <div className="mb-4 rounded-lg border border-[#ef4343] bg-[#ef43431a] px-4 py-3">
                <p className="text-[#ef4343] text-sm font-medium">
                  {formError}
                </p>
              </div>
            )}
            <div className="mb-5">
              <label className="text-lg text-[#7A7D83] mb-[10px] block">
                Select Token
              </label>

              <select className="w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-5 py-4 text-lg text-white outline-none">
                <option value="" className="bg-[#161F37] text-[#7A7D83]">
                  Select token
                </option>

                <option value="ETH" className="bg-[#161F37] text-white">
                  ETH
                </option>

                <option value="USDT" className="bg-[#161F37] text-white">
                  USDT
                </option>

                <option value="BTS" className="bg-[#161F37] text-white">
                  BTS
                </option>
              </select>
            </div>

            <div className="mb-5">
              <label className="text-lg text-[#7A7D83] mb-[10px] block">
                Recipient Address
              </label>

              <div className="flex gap-3 items-center">
                {/* <input
                  value={toAddress}
                  onChange={(e) => {
                    setToAddress(e.target.value);
                    if (errors.toAddress) {
                      setErrors((prev) => ({ ...prev, toAddress: undefined }));
                    }
                  }}
                  placeholder="Enter recipient address"
                  className={`flex-1 bg-transparent border rounded-xl px-5 py-4 text-lg text-white outline-none
     ${errors.toAddress ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
                /> */}
                <input
                value={toAddress}
                readOnly
                className="flex-1 bg-transparent border rounded-xl px-5 py-4 text-lg text-white outline-none border-[#3C3D47] opacity-80"
              />
                {/* <button
                className="w-[50px] h-[50px] rounded-xl bg-[#202A43] 
                border border-[#3C3D47] flex justify-center items-center text-[#7D7E84]"
                >
                <HiOutlineQrCode size={26} />
                </button> */}
              </div>
              {errors.toAddress && (
                <p className="text-[#ef4343] text-sm mt-1">
                  {errors.toAddress}
                </p>
              )}
            </div>

            <div>
              <label className="text-lg text-[#7A7D83] mb-[10px] block">
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
                placeholder="Amount"
                inputMode="decimal"
                className={`w-full bg-transparent border rounded-xl px-5 py-4 text-lg text-white outline-none
    ${errors.amount ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
              />

              {errors.amount && (
                <p className="text-[#ef4343] text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div className="mt-[25px] space-y-5 text-sm">
              <div className="flex justify-between text-white text-lg font-medium">
                <p>Gas Fees</p>
                {gasLoading ? (
                  <div className="w-10 h-5 overflow-hidden">
                    <Loader />
                  </div>
                ) : (
                  <p> {gasFee ? `${formatBalance(gasFee)} ETH` : "--"}</p>
                )}
              </div>

              <div className="flex justify-between text-white text-lg font-medium">
                <p>Total Cost</p>
                <p>
                  {amount && gasFee ? `${formatBalance(totalCost)} ETH` : "--"}
                </p>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={false}
              className="w-full mt-[30px] py-[18px] rounded-xl bg-[#25C866] 
          text-white font-bold transition cursor-pointer text-lg
          flex items-center justify-center gap-2
          disabled:opacity-70 disabled:cursor-not-allowed"
            >
            Send Token
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SendTokenModal;
