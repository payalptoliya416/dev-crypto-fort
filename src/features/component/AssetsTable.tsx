import up from "@/assets/up.svg";

interface Asset {
  name: string;
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  icon: string;
}

interface AssetsTableProps {
  assets: Asset[];
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#3C3D47]">
        <table className="w-full text-left">
          {/* Header */}
          <thead className="bg-[#285AD71F]">
            <tr>
              <th className="text-[#F4F4F5] text-sm px-5 py-[19px] font-normal">
                Name
              </th>
              <th className="text-[#F4F4F5] text-sm text-right px-5 py-[19px] font-normal">
                Last price
              </th>
              <th className="text-[#F4F4F5] text-sm text-right px-5 py-[19px] font-normal">
                Change
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {assets.map((asset, index) => (
              <tr
                key={index}
                className="border-t border-[#3C3D47] hover:bg-[#18233D] transition odd:bg-[#161F37] even:bg-[#202A43]"
              >
                {/* Name */}
                <td className="py-[13px] px-5 flex items-center gap-[10px]">
                  <img src={asset.icon} alt="icon-img" />

                  <div>
                    <p className="text-sm text-white font-medium mb-1">
                      {asset.name}
                    </p>
                    <p className="text-xs text-[#7A7D83] font-normal">
                      {asset.symbol}
                    </p>
                  </div>
                </td>

                {/* Price */}
                <td className="py-[13px] px-5 text-[#7A7D83] text-base font-normal text-right">
                  {asset.price}
                </td>

                {/* Change */}
                <td className="py-[13px] px-5 text-right w-36">
                  <span
                    className={`px-[10px] py-[6px] rounded-[5px] text-sm font-medium inline-flex justify-center items-center w-full max-w-[65px] gap-[5px]
                      ${
                        asset.up
                          ? "bg-[#25C866] text-white"
                          : "bg-[#C82525] text-white"
                      }`}
                  >
                    {asset.up ? (
                      <img src={up} alt="up" />
                    ) : (
                      <img src={up} alt="down" className="rotate-180" />
                    )}
                    {asset.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {assets.map((asset, index) => (
          <div
            key={index}
            className="border border-[#3C3D47] p-4 bg-[#161F37]"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={asset.icon} alt="icon" />

                <div>
                  <p className="text-white font-medium text-sm">{asset.name}</p>
                  <p className="text-xs text-[#7A7D83]">{asset.symbol}</p>
                </div>
              </div>

              {/* Change Badge */}
              <span
                className={`inline-flex items-center gap-[5px] px-[10px] py-[6px] rounded-[5px] text-sm font-medium
                  ${
                    asset.up
                      ? "bg-[#25C866] text-white"
                      : "bg-[#C82525] text-white"
                  }`}
              >
                {asset.up ? (
                  <img src={up} alt="up" />
                ) : (
                  <img src={up} alt="down" className="rotate-180" />
                )}
                {asset.change}
              </span>
            </div>

            {/* Price Row */}
            <div className="flex justify-between mt-3 text-sm">
              <p className="text-[#7A7D83]">Last Price</p>
              <p className="text-white">{asset.price}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AssetsTable;
