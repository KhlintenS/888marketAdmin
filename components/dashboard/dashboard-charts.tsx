"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Revenue</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Current Week $58,211</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Previous Week $68,768</span>
              </div>
            </div>
          </div>
          <RevenueChart />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Sales By Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-[150px] w-full">
                <Image
                  src="/img/map.gif"
                  alt="World Map"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 border-b border-blue-600 pb-1">
                    Dubai
                  </span>
                  <span className="text-sm">72K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Abu Dhabi</span>
                  <span className="text-sm">39K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Al Ain</span>
                  <span className="text-sm">25K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fujairah</span>
                  <span className="text-sm">61K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Total Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SalesDonutChart />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Direct</span>
                  </div>
                  <span className="text-sm">$300.56</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm">Affiliate</span>
                  </div>
                  <span className="text-sm">$135.18</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RevenueChart() {
  const data = [
    { month: "Jan", currentWeek: 10, previousWeek: 8 },
    { month: "Feb", currentWeek: 15, previousWeek: 10 },
    { month: "Mar", currentWeek: 12, previousWeek: 15 },
    { month: "Apr", currentWeek: 8, previousWeek: 20 },
    { month: "May", currentWeek: 15, previousWeek: 18 },
    { month: "Jun", currentWeek: 20, previousWeek: 15 },
  ];

  return (
    <ChartContainer className="h-[300px]" config={{}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => `${value}M`}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent className="border-blue-500">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3b82f6" }}></span>
                        <span className="text-sm font-medium">Current Week</span>
                        <span className="ml-2 text-sm">{`$${payload[0].value}M`}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10b981" }}></span>
                        <span className="text-sm font-medium">Previous Week</span>
                        <span className="ml-2 text-sm">{`$${payload[1].value}M`}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="currentWeek"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="previousWeek"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function SalesDonutChart() {
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
                  <ChartTooltipContent className="border-blue-500">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: payload[0].payload.color }}
                      ></span>
                      <span className="text-sm font-medium">{payload[0].name}</span>
                      <span className="ml-2 text-sm">{`${payload[0].value}%`}</span>
                    </div>
                  </ChartTooltipContent>
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
