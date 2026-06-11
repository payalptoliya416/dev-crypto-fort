
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
      <AreaChart
  data={chartData}
  margin={{
    top: 5,
    right: 0,
    left: 0,
    bottom: 0,
  }}
>
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
        stopOpacity={0.4}
      />
      <stop
        offset="100%"
        stopColor="#25C866"
        stopOpacity={0}
      />
    </linearGradient>
  </defs>

  <XAxis hide dataKey="date" />

 <YAxis
  hide
  domain={["dataMin", "dataMax"]}
/>
<Tooltip
  content={({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-2 border rounded text-black">
        <div>
         {new Date(label ?? Date.now()).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })}
        </div>

        <div className="text-green-600">
          Value: {Number(payload[0].value).toFixed(2)}
        </div>
      </div>
    );
  }}
/>

  <Area
    type="monotone"
    dataKey="value"
    stroke="#25C866"
    strokeWidth={2}
    fill="url(#walletGradient)"
    fillOpacity={1}
    isAnimationActive={false}
  />
</AreaChart>
      </ResponsiveContainer>
    </div>
  );
}