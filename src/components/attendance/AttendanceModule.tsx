import { students, getAttendanceBySection } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  const { selectedDepartment, selectedSection, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();

  const deptStudents = students.filter(s => s.departmentId === selectedDepartment);
  const sectionStudents = deptStudents.filter(s => s.section === selectedSection);

  const attendanceDistribution = [
    { name: "High (≥75%)", value: sectionStudents.filter((s) => s.attendance >= 75).length, color: COLORS.high },
    { name: "Medium (50-74%)", value: sectionStudents.filter((s) => s.attendance >= 50 && s.attendance < 75).length, color: COLORS.medium },
    { name: "Low (<50%)", value: sectionStudents.filter((s) => s.attendance < 50).length, color: COLORS.low },
  ];

  const avgAttendance = sectionStudents.length > 0
    ? Math.round(sectionStudents.reduce((sum, s) => sum + s.attendance, 0) / sectionStudents.length)
    : 0;

  const lowAttendanceStudents = sectionStudents.filter((s) => s.attendance < 50);
  const highAttendanceStudents = sectionStudents.filter((s) => s.attendance >= 90);

  const attendanceBySection = getAttendanceBySection(selectedDepartment);

  const getAttendanceClass = (attendance: number) => {
    if (attendance >= 75) return "attendance-high";
    if (attendance >= 50) return "attendance-medium";
    return "attendance-low";
  };

  const getProgressColor = (attendance: number) => {
    if (attendance >= 75) return "bg-success";
    if (attendance >= 50) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="space-y-6">
      {/* Department Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name} - Section {selectedSection} Attendance
        </h2>
        <p className="text-sm text-muted-foreground">
          Attendance analytics for {sectionStudents.length} students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Attendance</p>
              <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
            </div>
          </div>
        </div>
        <div className="stat-card border border-success/20 bg-success/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/20">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Attendance</p>
              <p className="text-2xl font-bold text-foreground">{highAttendanceStudents.length}</p>
              <p className="text-xs text-muted-foreground">students ≥90%</p>
            </div>
          </div>
        </div>
        <div className="stat-card border border-warning/20 bg-warning/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/20">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">At Risk</p>
              <p className="text-2xl font-bold text-foreground">{sectionStudents.filter(s => s.attendance >= 50 && s.attendance < 75).length}</p>
              <p className="text-xs text-muted-foreground">students 50-74%</p>
            </div>
          </div>
        </div>
        <div className="stat-card border border-danger/20 bg-danger/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-danger/20">
              <TrendingDown className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-foreground">{lowAttendanceStudents.length}</p>
              <p className="text-xs text-muted-foreground">students &lt;50%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Section {selectedSection} Distribution</h3>
          <div className="h-64">
            {sectionStudents.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value} students`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No students in this section
              </div>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {attendanceDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart by Section */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Department-wide by Section</h3>
          <div className="h-64">
            {attendanceBySection.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceBySection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="section"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
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
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Bar
                    dataKey="attendance"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Section {selectedSection} Student Attendance</h3>
          <p className="text-sm text-muted-foreground">Students sorted by attendance</p>
        </div>
        <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
          {sectionStudents.length > 0 ? (
            sectionStudents
              .sort((a, b) => a.attendance - b.attendance)
              .map((student, index) => (
                <div
                  key={student.id}
                  className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{student.name}</p>
                      <Badge variant="secondary" className="text-xs">{student.departmentId}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress
                        value={student.attendance}
                        className={cn("h-2 flex-1 max-w-48", getProgressColor(student.attendance))}
                      />
                      <span className={cn("text-sm font-medium", getAttendanceClass(student.attendance))}>
                        {student.attendance}%
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex gap-0.5">
                    {student.weeklyAttendance.map((day, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-8 rounded-sm",
                          day >= 80 ? "bg-success/80" : day >= 60 ? "bg-warning/80" : "bg-danger/80"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))
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
