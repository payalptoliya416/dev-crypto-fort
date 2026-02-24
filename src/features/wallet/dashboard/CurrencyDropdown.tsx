import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function CurrencyDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "AED",
    "AUD",
    "CAD",
    "NOK",
    "NZD",
    "CHF",
    "BTC",
  ];

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
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#202A43] rounded-lg py-3 px-[15px] flex items-center gap-[10px] text-[#7A7D83] text-sm font-medium cursor-pointer"
      >
        <span>{value}</span>
        <FaChevronDown className={`text-[8px] ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-full rounded-lg bg-[#131F3A] border border-[#2A3553] shadow-xl z-50">
          {currencies.map((cur) => (
            <button
              key={cur}
              onClick={() => {
                onChange(cur);
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-[#AEB4C2] hover:bg-[#1A2440] hover:text-white cursor-pointer"
            >
              {cur}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
