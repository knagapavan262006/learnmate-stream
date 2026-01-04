import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { classroomUtilization } from "@/data/mockData";

const getBarColor = (value: number) => {
  if (value >= 80) return "hsl(142, 71%, 45%)";
  if (value >= 60) return "hsl(38, 92%, 50%)";
  return "hsl(238, 84%, 60%)";
};

export function UtilizationChart() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-foreground">Classroom Utilization</h3>
        <p className="text-sm text-muted-foreground">Current usage across all rooms</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={classroomUtilization}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "var(--shadow-lg)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Usage"]}
            />
            <Bar dataKey="used" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {classroomUtilization.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.used)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">High (≥80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Medium (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Low (&lt;60%)</span>
        </div>
      </div>
    </div>
  );
}
