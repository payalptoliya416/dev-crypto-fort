import d1 from "@/assets/Ethereum.svg";
import d2 from "@/assets/Bitcoin.svg";
import d3 from "@/assets/Binance.png";
import d4 from "@/assets/USDC.svg";
import d5 from "@/assets/TRC-20.svg";
import d9 from "@/assets/tron.svg";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { getDisplayTokenIcon } from "../utils/tokenIconUtils";

export interface TokenOption {
  value: string;
  label: string;
  symbol: string;
  icon: string;
}

const tokenOptions: TokenOption[] = [
  { value: "eth", label: "Ethereum", symbol: "ETH", icon: d1 },
  { value: "trc20", label: "TRC-20", symbol: "USDT", icon: d5 },
  { value: "usdt", label: "ERC-20", symbol: "USDT", icon: d5 },
  { value: "usdc", label: "USDC (ERC20)", symbol: "USDC", icon: d4 },
  { value: "btc", label: "Bitcoin", symbol: "BTC", icon: d2 },
  { value: "bnb", label: "Binance", symbol: "BNB", icon: d3 },
  { value: "trx", label: "TRON", symbol: "TRX", icon: d9 },
];

interface TokenDropdownProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  placeholder?: string;
  options?: TokenOption[];
  excludeValues?: string[];
  disabled?: boolean;
}

function TokenDropdown({
  value,
  onChange,
  hasError = false,
  placeholder = "Select token",
  options,
  excludeValues = [],
   disabled = false,
}: TokenDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableOptions = (options ?? tokenOptions).filter(
    (token) => !excludeValues.includes(token.value),
  ).map((token) => ({
    ...token,
    icon: getDisplayTokenIcon(token.value, token.icon),
  }));
  const selectedToken = availableOptions.find((token) => token.value === value) ||
    (options ?? tokenOptions).find((token) => token.value === value);

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

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
  type="button"
  disabled={disabled}
  onClick={() => {
    if (!disabled) {
      setOpen((current) => !current);
    }
  }}
  className={`w-full bg-[#161F37] border rounded-xl px-5 py-3 text-base sm:text-lg text-white outline-none flex items-center justify-between gap-3 ${
    disabled
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer"
  } ${
    hasError ? "border-[#ef4343]" : "border-[#3C3D47]"
  }`}
  aria-haspopup="listbox"
  aria-expanded={open}
>
        {selectedToken ? (
          <span className="flex items-center gap-3 min-w-0">
            <img
              src={selectedToken.icon}
              alt=""
              className="rounded-full shrink-0"
            />
            <span className="truncate">{selectedToken.label}</span>
          </span>
        ) : (
          <span className="text-[#7A7D83]">{placeholder}</span>
        )}
        <FaChevronDown
          className={`text-[10px] text-[#7A7D83] shrink-0 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 mt-2 rounded-xl bg-[#131F3A] border border-[#2A3553] shadow-xl z-[1001] max-h-[320px] overflow-y-auto"
          role="listbox"
        >
          {availableOptions.map((token) => (
            <button
              key={token.value}
              type="button"
              onClick={() => {
                onChange(token.value);
                setOpen(false);
              }}
              className={`w-full px-5 py-3 flex items-center gap-3 text-left hover:bg-[#1A2440] cursor-pointer ${
                value === token.value ? "bg-[#1A2440]" : ""
              }`}
              role="option"
              aria-selected={value === token.value}
            >
              <img
                src={token.icon}
                alt=""
                className="rounded-full shrink-0"
              />
              <span className="min-w-0">
                <span className="block text-white text-base">
                  {token.label}
                </span>
                <span className="block text-xs text-[#7A7D83]">
                  {token.symbol}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TokenDropdown;
