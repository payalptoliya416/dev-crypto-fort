import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatBalance } from "../../component/format";

interface ChartItem {
  name: string;
  value: number;
}

interface Props {
  data: ChartItem[];
}

const COLORS = [
  "#00E5FF", 
  "#7C4DFF", 
  "#00C853", 
  "#FF9100", 
  "#FF1744", 
  "#2979FF", 
  "#D500F9", 
  "#00B8D4", 
  "#64DD17", 
  "#FFD600", 
  "#651FFF", 
  "#FF6D00", 
];

function AssetPieChart({ data }: Props) {
  if (!data.length) return null;

  const total = data.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  return (
    <div className="w-full rounded-2xl border border-[#31374B] bg-[#1A2340] p-4 sm:p-5 lg:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-white text-lg sm:text-xl font-semibold">
            Asset Distribution
          </h3>
        </div>

        <div className="bg-[#111A33] border border-[#2A324A] rounded-xl px-4 py-2 w-fit">
          <p className="text-[#8B92A5] text-xs">
            Total Portfolio
          </p>

          <p className="text-white text-lg font-semibold">
            $
            {formatBalance(total, {
              isFiat: true,
            })}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
        {/* Chart */}
        <div className="w-full h-[260px] sm:h-[320px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                stroke="transparent"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value: any, name: any) => [
                  `$${formatBalance(
                    Number(value),
                    {
                      isFiat: true,
                    },
                  )}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Asset List */}
        <div className="w-full flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
          {data.map((item, index) => {
            const percentage =
              total > 0
                ? (
                    (item.value / total) *
                    100
                  ).toFixed(1)
                : "0";

            return (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between gap-4 bg-[#111A33] border border-[#2A324A] rounded-xl px-4 py-3 min-h-[72px]"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        COLORS[
                          index % COLORS.length
                        ],
                    }}
                  />

                  <div className="min-w-0">
                    <p className="text-white text-sm sm:text-base font-medium truncate">
                      {item.name}
                    </p>

                    <p className="text-[#8B92A5] text-xs sm:text-sm">
                      {percentage}%
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right flex-shrink-0">
                  <p className="text-white text-sm sm:text-base font-semibold">
                    $
                    {formatBalance(
                      item.value,
                      {
                        isFiat: true,
                      },
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AssetPieChart;