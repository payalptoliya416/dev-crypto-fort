import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getGasFee } from "../../../api/transactionApi";
import Loader from "../../component/Loader";
import { setTransactionData } from "../../../redux/transactionSlice";
import QRCode from "react-qr-code";
import type { RootState } from "../../../redux/store/store";
import { formatBalance } from "../../component/format";
interface SendTokenModalProps {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
}

function SendTokenModal({ open, onClose, onNext }: SendTokenModalProps) {
  const activeWallet = useSelector(
    (state: RootState) => state.activeWallet.wallet,
  );
  const dispatch = useDispatch();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [gasLoading, setGasLoading] = useState(false);
  const [gasFee, setGasFee] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [errors, setErrors] = useState<{
    toAddress?: string;
    amount?: string;
    selectedToken?: string;
  }>({});

  // const gasFeeInEth = gasFee ? Number(gasFee) / 1_000_000_000 : 0;
  const gasFeeInEth = gasFee ? Number(gasFee) : 0;
  const totalCost = Number(amount || 0) + gasFeeInEth;
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (!open) {
      setToAddress("");
      setAmount("");
      setSelectedToken("");
      setErrors({});
      setGasFee(null);
      setShowQR(false);
    }
  }, [open]);

  useEffect(() => {
    if (!selectedToken || !activeWallet) return;

    const balanceMap: Record<string, string | undefined> = {
      eth: activeWallet.eth_balance,
      btc: activeWallet.btc_balance,
      usdt: activeWallet.usdt_balance,
      trc20: activeWallet.trc20_balance,
      bnb: activeWallet.bnb_balance,
      trx: activeWallet.trx_balance,
    };

     setBalance(balanceMap[selectedToken] ?? "0");
  }, [selectedToken, activeWallet]);

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

    if (!selectedToken) {
      newErrors.selectedToken = "Token selection is required";
    }

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

  // const handleShowQR = () => {
  //   if (!toAddress.trim()) {
  //     toast.error("Please enter recipient address first");
  //     return;
  //   }

  //   setShowQR(true);
  // };

  const handleSend = () => {
    if (!validate()) return;

    const gasFeeInEth = gasFee ? Number(gasFee) : 0;
    const totalCost = Number(amount || 0) + gasFeeInEth;

    dispatch(
      setTransactionData({
        toAddress,
        amount,
        gasFee: gasFee || "0",
        totalCost: totalCost.toString(),
        selectedToken,
      }),
    );

    onClose();
    onNext();
  };

  const isDisabled =
  gasLoading ||
  !gasFee;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] flex items-center justify-center  overflow-y-auto px-3 sm:px-5">
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
            <h3 className="text-[#25C866] font-medium text-base sm:text-lg mb-[15px]">
              Send Token
            </h3>
            <div className="mb-5">
              <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
                Select Token
              </label>

              <select
                value={selectedToken}
                 onChange={(e) => {
                    setSelectedToken(e.target.value);
                    if (errors.selectedToken) {
                      setErrors((prev) => ({ ...prev, selectedToken: undefined }));
                    }
                  }}
                className={`w-full bg-[#161F37] border border-[#3C3D47] rounded-xl px-5 py-3 text-base sm:text-lg text-white outline-none  ${errors.selectedToken ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
              >
                <option value="" className="bg-[#161F37] text-[#7A7D83]">
                  Select token
                </option>

                <option value="eth" className="bg-[#161F37] text-white">
                  Ethereum
                </option>

                {/* <option value="trx" className="bg-[#161F37] text-white"> */}
                <option value="trc20" className="bg-[#161F37] text-white">
                  TRC-20
                </option>
                
                <option value="usdt" className="bg-[#161F37] text-white">
                   ERC-20
                </option>

                <option value="btc" className="bg-[#161F37] text-white">
                  Bitcoin
                </option>

                <option value="bnb" className="bg-[#161F37] text-white">
                  Binance
                </option>
              </select>
              {errors.selectedToken && (
                <p className="text-[#ef4343] text-sm mt-1">{errors.selectedToken}</p>
              )}
            </div>
            <div className="flex justify-between text-base text-[#7A7D83] mb-5 flex-wrap">
              <p>Available Balance</p>
              <p>
                {selectedToken
                  ? `${balance} ${selectedToken.toUpperCase()}`
                  : "0.00"}
              </p>
            </div>
            <div className="mb-5">
              <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
                Recipient Address
              </label>

              <div className="flex gap-3 items-center">
                <input
                  value={toAddress}
                  onChange={(e) => {
                    setToAddress(e.target.value);
                    if (errors.toAddress) {
                      setErrors((prev) => ({ ...prev, toAddress: undefined }));
                    }
                  }}
                  placeholder="Enter recipient address"
                  className={`flex-1 min-w-0 bg-transparent border rounded-xl px-5 py-3 text-base sm:text-lg text-white outline-none ${errors.toAddress ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
                />
                {/* <button
                  type="button"
                  onClick={handleShowQR}
                  className=" px-3 py-3 rounded-xl bg-[#202A43] cursor-pointer
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
              <label className="text-base sm:text-lg text-[#7A7D83] mb-[10px] block">
                Amount
              </label>

              {/* <input
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
                className={`w-full bg-transparent border rounded-xl px-5 py-3 text-base sm:text-lg text-white outline-none ${errors.amount ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
              /> */}
               <div className="flex gap-2">
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
                    className={`flex-1 bg-transparent border rounded-xl px-5 py-3 text-base sm:text-lg text-white outline-none
                    ${errors.amount ? "border-[#ef4343]" : "border-[#3C3D47]"}`}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedToken) return; 
                    let max = Number(balance);

                    setAmount(max > 0 ? max.toString() : "0");
                  }}
                  disabled={!selectedToken}
                    className="px-4 py-2 bg-[#202A43] border border-[#3C3D47] text-white rounded-xl hover:bg-[#2a3555] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    MAX
                  </button>
                </div>

              {errors.amount && (
                <p className="text-[#ef4343] text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div className="mt-[25px] space-y-5 text-sm">
              <div className="flex justify-between text-white text-base sm:text-lg font-medium">
                <p>Gas Fees</p>
                {gasLoading ? (
                  <div className="w-10 h-5 overflow-hidden">
                    <Loader />
                  </div>
                ) : (
                  <p> {gasFee ? `${gasFee} ${selectedToken ? selectedToken.toUpperCase() : "ETH"}` : "--"}</p>
                )}
              </div>

              <div className="flex justify-between text-white text-base sm:text-lg font-medium">
                <p>Total Cost</p>
                <p>
                  {amount && gasFee
                    ? `${formatBalance(totalCost)} ${selectedToken ? selectedToken.toUpperCase() : "ETH"}`
                    : `0.00 ${selectedToken ? selectedToken.toUpperCase() : "ETH"}`}
                </p>
                {/* <p>
                {amount && gasFee
                  ? `${totalCost} ${selectedToken ? selectedToken.toUpperCase() : "ETH"}`
                  : `0.00 ${selectedToken ? selectedToken.toUpperCase() : "ETH"}`}
              </p> */}
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={isDisabled}
              className="w-full mt-[30px] py-3 sm:py-[18px] rounded-xl bg-[#25C866] 
            text-white font-bold transition cursor-pointer text-base sm:text-lg
              flex items-center justify-center gap-2
              disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Send Token
            </button>
          </div>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div
            onClick={() => setShowQR(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div className="relative bg-[#161F37] border border-[#3C3D47] rounded-xl p-6 w-[300px]">
            <h4 className="text-white text-base sm:text-lg mb-4 text-center">
              Recipient Address QR
            </h4>

            <div className="bg-[#202A43] p-3 rounded flex justify-center">
              <QRCode
                value={toAddress}
                size={200}
                bgColor="#202A43"
                fgColor="#ffffff"
              />
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="w-full mt-4 py-2 rounded-lg bg-[#202A43] text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SendTokenModal;
