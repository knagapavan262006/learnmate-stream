import { getClassroomUtilization } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
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

const getBarColor = (usage: number) => {
  if (usage >= 80) return "hsl(142, 71%, 45%)";
  if (usage >= 50) return "hsl(38, 92%, 50%)";
  return "hsl(238, 84%, 60%)";
};

export function UtilizationChart() {
  const { selectedDepartment, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const utilization = getClassroomUtilization(selectedDepartment);

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-foreground">Classroom Utilization - {currentDept?.code}</h3>
        <p className="text-sm text-muted-foreground">Department room usage analysis</p>
      </div>
      <div className="h-[280px]">
        {utilization.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={[0, 100]}
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
                }}
                formatter={(value: number) => [`${value}%`, "Utilization"]}
              />
              <Bar dataKey="used" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {utilization.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.used)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No classrooms assigned to this department
          </div>
        )}
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">High (≥80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Medium (50-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Low (&lt;50%)</span>
        </div>
      </div>
    </div>
  );
}
