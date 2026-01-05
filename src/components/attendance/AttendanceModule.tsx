import { useDepartment } from "@/contexts/DepartmentContext";
import { useStudents } from "@/hooks/useDatabase";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { Users, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

const COLORS = {
  high: "hsl(142, 71%, 45%)",
  medium: "hsl(38, 92%, 50%)",
  low: "hsl(0, 84%, 60%)",
};

export function AttendanceModule() {
  const { selectedDepartmentId, selectedSectionId, getCurrentDepartment, getSectionsForDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const sections = getSectionsForDepartment(selectedDepartmentId);
  const currentSection = sections.find(s => s.id === selectedSectionId);

  const { data: allDeptStudents = [], isLoading } = useStudents(selectedDepartmentId);
  const sectionStudents = allDeptStudents.filter(s => s.section_id === selectedSectionId);

  const attendanceDistribution = [
    { name: "High (≥75%)", value: sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 75).length, color: COLORS.high },
    { name: "Medium (50-74%)", value: sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 50 && (s.attendance_percentage || 0) < 75).length, color: COLORS.medium },
    { name: "Low (<50%)", value: sectionStudents.filter((s) => (s.attendance_percentage || 0) < 50).length, color: COLORS.low },
  ];

  const avgAttendance = sectionStudents.length > 0
    ? Math.round(sectionStudents.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0) / sectionStudents.length)
    : 0;

  const lowAttendanceStudents = sectionStudents.filter((s) => (s.attendance_percentage || 0) < 50);
  const highAttendanceStudents = sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 90);

  // Calculate attendance by section
  const attendanceBySection = sections.map(section => {
    const sectionStds = allDeptStudents.filter(s => s.section_id === section.id);
    const avg = sectionStds.length > 0 
      ? Math.round(sectionStds.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0) / sectionStds.length)
      : 0;
    return { section: section.name, attendance: avg };
  });

  const getAttendanceClass = (attendance: number) => {
    if (attendance >= 75) return "text-success";
    if (attendance >= 50) return "text-warning";
    return "text-destructive";
  };

  const getProgressColor = (attendance: number) => {
    if (attendance >= 75) return "bg-success";
    if (attendance >= 50) return "bg-warning";
    return "bg-destructive";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name} - Section {currentSection?.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Attendance analytics and student tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
              <p className="text-xs text-muted-foreground">Average Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{highAttendanceStudents.length}</p>
              <p className="text-xs text-muted-foreground">High Attendance (≥90%)</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {sectionStudents.filter(s => (s.attendance_percentage || 0) >= 50 && (s.attendance_percentage || 0) < 75).length}
              </p>
              <p className="text-xs text-muted-foreground">At Risk (50-74%)</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/10">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{lowAttendanceStudents.length}</p>
              <p className="text-xs text-muted-foreground">Critical (&lt;50%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Attendance Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart by Section */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Section-wise Average</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceBySection}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="section" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `Sec ${value}`}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: number) => [`${value}%`, "Avg Attendance"]}
                />
                <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Section {currentSection?.name} Students</h3>
          <p className="text-sm text-muted-foreground">{sectionStudents.length} students</p>
        </div>
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {sectionStudents.length > 0 ? (
            sectionStudents
              .sort((a, b) => (a.attendance_percentage || 0) - (b.attendance_percentage || 0))
              .map((student, index) => {
                const attendance = student.attendance_percentage || 0;
                return (
                  <div key={student.id} className="p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.roll_number}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <Progress 
                            value={attendance} 
                            className={cn("h-2", getProgressColor(attendance))}
                          />
                        </div>
                        <div className={cn("text-sm font-medium w-12 text-right", getAttendanceClass(attendance))}>
                          {attendance.toFixed(0)}%
                        </div>
                        {attendance < 50 ? (
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        ) : attendance < 75 ? (
                          <Badge variant="outline" className="text-warning border-warning/50 text-xs">Warning</Badge>
                        ) : (
                          <Badge variant="outline" className="text-success border-success/50 text-xs">Good</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No students in this section
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
