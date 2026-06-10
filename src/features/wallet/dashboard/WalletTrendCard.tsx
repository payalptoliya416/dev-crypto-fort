
import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  history: any[];
}

export default function WalletTrendCard({
  history,
}: Props) {

const chartData = useMemo(() => {
  return (
    history?.map((item: any) => ({
      date: item.date,
      value: Number(item.value),
    })) || []
  );
}, [history]);

  return (
    <div className="w-full sm:flex-1 h-[90px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart data={chartData}>
        <Tooltip
          formatter={(value: any) => [
            `$${Number(value).toFixed(2)}`,
            "Portfolio Value",
          ]}
          contentStyle={{
            backgroundColor: "#161F37",
            border: "1px solid #3C3D47",
            borderRadius: "8px",
            color: "#fff",
          }}
          labelStyle={{
            color: "#fff",
          }}
        />
        <XAxis dataKey="date" hide />
      < YAxis
  hide
  domain={["dataMin", "dataMax"]}
/>

          <defs>
            <linearGradient
              id="walletGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#25C866"
                stopOpacity={0.8}
              />
              <stop
                offset="100%"
                stopColor="#25C866"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <Area
  type="monotone"
  dataKey="value"
  stroke="#25C866"
  strokeWidth={2}
  fill="url(#walletGradient)"
  activeDot={{ r: 4 }}
  isAnimationActive={false}
/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}