import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useClassrooms } from "@/hooks/useDatabase";
import { Skeleton } from "@/components/ui/skeleton";

export function UtilizationChart() {
  const { selectedDepartmentId, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const { data: classrooms = [], isLoading } = useClassrooms(selectedDepartmentId);

  const chartData = classrooms.map(room => ({
    name: room.name.substring(0, 12),
    usage: room.usage_percentage || 0,
  }));

  const getBarColor = (usage: number) => {
    if (usage >= 80) return "hsl(var(--success))";
    if (usage >= 50) return "hsl(var(--warning))";
    return "hsl(var(--primary))";
  };

  if (isLoading) return <Skeleton className="h-80 w-full" />;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5">
      <h3 className="font-semibold text-foreground mb-4">{currentDept?.code} - Classroom Utilization</h3>
      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={getBarColor(entry.usage)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <div className="h-64 flex items-center justify-center text-muted-foreground">No classrooms</div>}
    </div>
  );
}