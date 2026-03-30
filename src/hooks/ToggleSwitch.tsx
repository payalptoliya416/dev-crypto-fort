type SwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  loading?: boolean; 
};

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  loading = false,
}: SwitchProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled || loading}
      />

      <div
        className={`w-14 h-7 rounded-full transition-colors duration-300
          ${
            checked
              ? "bg-[#25C866]"
              : "bg-gray-600 dark:bg-[#2A3556]"
          }
          ${(disabled || loading) ? "opacity-50 cursor-not-allowed" : ""}
        `}
      ></div>

      {/* 🔥 Loader OR Circle */}
      {loading ? (
        <div className="absolute top-1 left-1 w-5 h-5 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div
          className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-md transform transition-transform duration-300
            bg-white dark:bg-[#E5E7EB]
            ${checked ? "translate-x-7" : ""}
          `}
        ></div>
      )}
    </label>
  );
}