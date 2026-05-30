import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getGasFee } from "../../../api/transactionApi";
import { getPrices } from "../../../api/publicApi";
import Loader from "../../component/Loader";
import { setTransactionData } from "../../../redux/transactionSlice";
import QRCode from "react-qr-code";
import { formatBalance } from "../../component/format";
import TokenDropdown from "./TokenDropdown";
import { useWalletAssets } from "../hooks/useWalletAssets";
interface SendTokenModalProps {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  defaultSelectedToken?: string;
  defaultAmount?: string;
  dashboardMode?: boolean;
}

function SendTokenModal({
  open,
  onClose,
  onNext,
  defaultSelectedToken,
  defaultAmount,
  dashboardMode = false,
}: SendTokenModalProps) {
  const dispatch = useDispatch();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const { assets } = useWalletAssets();
  const selectedAsset = assets.find((asset) => asset.token === selectedToken);
  const selectedTokenBalance = selectedAsset?.balance ?? "0";
  const [gasLoading, setGasLoading] = useState(false);
  const [gasFeeEth, setGasFeeEth] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [isMaxAmount, setIsMaxAmount] = useState(false);
  const [errors, setErrors] = useState<{
    toAddress?: string;
    amount?: string;
    selectedToken?: string;
  }>({});

  const gasFeeInEth = gasFeeEth ? Number(gasFeeEth) : 0;

  const isNativeToken =
    selectedToken === "eth" ||
    selectedToken === "bnb" ||
    selectedToken === "trx" ||
    selectedToken === "btc";
  const [marketValue, setMarketValue] = useState<number | null>(null);
  const [marketLoading, setMarketLoading] = useState(false);

  const nativeTokenSymbols: Record<string, string> = {
    eth: "ETH",
    trc20: "TRX",
    usdt: "ETH",
    usdc: "ETH",
    btc: "BTC",
    bnb: "BNB",
    trx: "TRX",
  };

  const selectedNativeSymbol =
    selectedAsset?.network?.toLowerCase().includes("tron")
      ? "TRX"
      : selectedAsset?.network?.toLowerCase().includes("btc")
        ? "BTC"
        : selectedAsset?.network?.toLowerCase().includes("bnb")
          ? "BNB"
          : selectedToken && nativeTokenSymbols[selectedToken]
            ? nativeTokenSymbols[selectedToken]
            : "ETH";

  // const getApiSymbol = (token: string) => {
  //   const matchedAsset = assets.find((asset) => asset.token === token);
  //   if (matchedAsset?.symbol) {
  //     return matchedAsset.symbol;
  //   }

  //   switch (token.toLowerCase()) {
  //     case "btc":
  //       return "BTC";
  //     case "eth":
  //       return "ETH";
  //     case "usdt":
  //       return "USDT";
  //     case "usdc":
  //       return "USDC";
  //     case "bnb":
  //       return "BNB";
  //     case "trx":
  //       return "TRX";
  //     case "trc20":
  //       return "TRC20";
  //     default:
  //       return "ETH";
  //   }
  // };

  const parsedAmount = Number(String(amount).replace(/[,\s]/g, "")) || 0;

  useEffect(() => {
    if (!open) {
      setToAddress("");
      setAmount("");
      setSelectedToken("");
      setErrors({});
      setGasFeeEth(null);
      setShowQR(false);
      return;
    }

    if (defaultSelectedToken) {
      setSelectedToken(defaultSelectedToken);
    }
    if (defaultAmount) {
      setAmount(defaultAmount);
    }
    setErrors({});
    setShowQR(false);
  }, [open, defaultSelectedToken, defaultAmount]);

  useEffect(() => {
    if (!open || !dashboardMode || !defaultAmount || !selectedToken || gasFeeEth === null) return;

    const parsedDefaultAmount = Number(String(defaultAmount).replace(/[,\s]/g, "")) || 0;
    const isNativeGasToken =
      selectedToken === "eth" ||
      selectedToken === "bnb" ||
      selectedToken === "trx" ||
      selectedToken === "btc";

    const computedAmount = isNativeGasToken
      ? Math.max(parsedDefaultAmount - Number(gasFeeEth), 0)
      : parsedDefaultAmount;

    const formattedAmount = computedAmount > 0 ? formatBalance(computedAmount) : "0";

    if (amount === defaultAmount || amount === "" || amount === formattedAmount) {
      setAmount(formattedAmount);
    }
  }, [open, dashboardMode, defaultAmount, selectedToken, gasFeeEth, amount]);

  useEffect(() => {
    if (!open) {
      setGasFeeEth(null);
      setMarketValue(null);
      return;
    }

    if (!selectedToken) {
      setGasFeeEth(null);
      setMarketValue(null);
      return;
    }

    const fetchGasFee = async () => {
      try {
        setGasLoading(true);

        const res = await getGasFee();
        if (res.success && res.data) {
          const gasEth =
            res.data.gas_fee_eth ?? res.data.gas_eth ?? "0";

          setGasFeeEth(gasEth);
        }
      } catch {
        console.error("Failed to get gas fee");
      } finally {
        setGasLoading(false);
      }
    };

    const fetchMarketValue = async () => {
      if (!amount || parsedAmount <= 0) {
        setMarketValue(null);
        return;
      }

      const nativeSymbols = ["BTC", "ETH", "USDT", "USDC", "BNB", "TRX"];

      const assetSymbol = selectedAsset?.symbol?.toUpperCase() || "";

      const symbol = nativeSymbols.includes(assetSymbol)
        ? assetSymbol
        : "USDT";

      setMarketLoading(true);
      try {
        const response = await getPrices({
          symbol,
          base: "USD",
        });
        const priceString = response?.prices?.[0]?.price || "";
        const price = Number(String(priceString).replace(/[,\s]/g, ""));
        if (response.success && price > 0) {
          setMarketValue(price * parsedAmount);
        } else {
          setMarketValue(null);
        }
      } catch (error) {
        console.error("Failed to fetch market value", error);
        setMarketValue(null);
      } finally {
        setMarketLoading(false);
      }
    };

    const timer = window.setTimeout(() => {
      fetchGasFee();
      fetchMarketValue();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [open, selectedToken, amount, parsedAmount, dashboardMode]);

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
    } else if (Number(amount) > Number(selectedTokenBalance)) {
      newErrors.amount = "Amount exceeds available balance";
    } else {
      // gas balance checks
      // if (isNativeToken) {
      //     const formatedGasFee = Number(formatBalance(gasFeeInEth));
      //   // for native token sends, ensure balance covers amount + gas
      //   if (Number(amount) + formatedGasFee > Number(balance)) {
      //     newErrors.amount = "Insufficient balance to cover amount and gas fee";
      //   }
      // } else {
      //   // non-native: ensure native balance is available to pay gas
      //   if (gasFeeInEth > selectedNativeBalance) {
      //     newErrors.amount = `Insufficient ${selectedNativeSymbol} balance for gas fee`;
      //   }
      // }
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
    dispatch(
      setTransactionData({
        toAddress,
        amount,
        isMaxAmount,
        gasFee: gasFeeEth || "0",
        // store totalCost as token-only for non-native, and amount+gas for native
        totalCost: isNativeToken ? (Number(amount || 0) + gasFeeInEth).toString() : amount,
        selectedToken,
        marketValue,
      }),
    );

    onClose();
    onNext();
  };

  const isDisabled = gasLoading || gasFeeEth === null;

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

              <TokenDropdown
                value={selectedToken}
                onChange={(token) => {
                  setSelectedToken(token);
                  if (errors.selectedToken) {
                    setErrors((prev) => ({ ...prev, selectedToken: undefined }));
                  }
                }}
                hasError={Boolean(errors.selectedToken)}
                options={assets.map(asset => ({
                  value: asset.token,
                  label: asset.name,
                  symbol: asset.symbol,
                  icon: asset.icon,
                }))}
              />
              {errors.selectedToken && (
                <p className="text-[#ef4343] text-sm mt-1">{errors.selectedToken}</p>
              )}
            </div>
            <div className="flex justify-between text-base text-[#7A7D83] mb-5 flex-wrap">
              <p>Available Balance</p>
              <p>
                {selectedToken
                  ? `${formatBalance(selectedTokenBalance)} ${selectedAsset?.symbol || selectedToken.toUpperCase()}`
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

               <div className="flex gap-2">
                  <input
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (!/^\d*\.?\d*$/.test(value)) return;

                      setAmount(value);
                       setIsMaxAmount(false);

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
                      if (!selectedToken || gasFeeEth === null || gasLoading) return;

                      const bal = Number(selectedTokenBalance || 0);
                      const gas = Number(gasFeeEth || 0);

                      const maxSendable = isNativeToken ? bal - gas : bal;
                      const finalAmount = maxSendable > 0 ? maxSendable : 0;

                      setAmount(finalAmount > 0 ? formatBalance(finalAmount) : "0");
                      setIsMaxAmount(true);
                    }}
                    disabled={!selectedToken || gasLoading || gasFeeEth === null}
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
                <p>Value (USD)</p>
                {marketLoading ? (
                  <div className="w-10 h-5 overflow-hidden">
                    <Loader />
                  </div>
                ) : (
                  <p>
                    {marketValue !== null
                ? `$${marketValue}`
                : "--"}
                  </p>
                )}
              </div>

              <div className="flex justify-between text-white text-base sm:text-lg font-medium">
                <p>Total</p>
                <p>
                  {isNativeToken ? (
                    amount || gasFeeEth ? `${formatBalance(Number(amount || 0) + gasFeeInEth)} ${selectedNativeSymbol}` : `0.00 ${selectedNativeSymbol}`
                  ) : (
                    amount || gasFeeEth ? `${formatBalance(Number(amount || 0))} ${selectedToken ? selectedToken.toUpperCase() : ""} + ${formatBalance(gasFeeInEth)} ${selectedNativeSymbol}` : `0.00 ${selectedToken ? selectedToken.toUpperCase() : ""}`
                  )}
                </p>
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
