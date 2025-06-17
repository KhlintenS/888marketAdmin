import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, ResponsiveContainer, PieChart } from "recharts";

export default function SalesDonutChart() {
  const data = [
    { name: "Direct", value: 38.6, color: "#3b82f6" },
    { name: "Affiliate", value: 22.5, color: "#60a5fa" },
  ];

  return (
    <div className="h-[200px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }) => {
              if (percent > 0.35) {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {`${(percent * 100).toFixed(1)}%`}
                  </text>
                );
              }
              return null;
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    className="border-blue-500"
                    label={payload[0].name}
                    payload={payload}
                    color={payload[0].payload.color}
                  />
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
