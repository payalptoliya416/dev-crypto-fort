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

export default function WalletTrendCard({ history }: Props) {
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
      <ResponsiveContainer width="100%" height="100%">
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
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>

            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
              <stop offset="50%" stopColor="#EC4899" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis hide dataKey="date" />

          <YAxis hide domain={["dataMin - 0.1", "dataMax + 0.1"]} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              return (
                <div className="bg-white p-2 border rounded text-black">
                  <div>
                      {new Date(label ?? Date.now()).toLocaleString([], {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
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
            stroke="url(#lineGradient)"
            strokeWidth={2}
            fill="url(#areaGradient)"
            fillOpacity={1}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
