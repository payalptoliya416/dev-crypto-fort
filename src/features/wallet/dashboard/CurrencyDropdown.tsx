import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function CurrencyDropdown() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const currencies = ["USD", "EUR", "INR"];

  return (
    <div className="relative inline-block">
      {/* Trigger */}
       {/* <button className="bg-[#202A43] rounded-lg py-3 px-[15px] flex items-center gap-[10px] text-[#7A7D83] text-sm font-medium leading-[14px]">
                <span>USD</span> <FaChevronDown className="text-[8px]" />
              </button> */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#202A43] rounded-lg py-3 px-[15px] flex items-center gap-[10px] text-[#7A7D83] text-sm font-medium leading-[14px] cursor-pointer"
      >
        <span className="text-sm font-medium">{currency}</span>
        <FaChevronDown
          className={`text-[8px] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute left-0 mt-2
            w-full
            rounded-lg
            bg-[#131F3A]
            border border-[#2A3553]
            shadow-xl
            z-50
          "
        >
          {currencies.map((cur) => (
            <button
              key={cur}
              onClick={() => {
                setCurrency(cur);
                setOpen(false);
              }}
              className="
                w-full px-4 py-2
                text-left text-sm
                text-[#AEB4C2]
                hover:bg-[#1A2440]
                hover:text-white
                transition
              "
            >
              {cur}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
