import { useDepartment } from "@/contexts/DepartmentContext";
import { useStudents } from "@/hooks/useDatabase";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Legend,
  LabelList,
} from "recharts";
import { cn } from "@/lib/utils";
import { Users, TrendingUp, TrendingDown, AlertCircle, UserCheck, UserX, BarChart3 } from "lucide-react";

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
    { name: "Present (≥75%)", value: sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 75).length, color: COLORS.high },
    { name: "Partial (50-74%)", value: sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 50 && (s.attendance_percentage || 0) < 75).length, color: COLORS.medium },
    { name: "Absent (<50%)", value: sectionStudents.filter((s) => (s.attendance_percentage || 0) < 50).length, color: COLORS.low },
  ];

  const avgAttendance = sectionStudents.length > 0
    ? Math.round(sectionStudents.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0) / sectionStudents.length)
    : 0;

  const lowAttendanceStudents = sectionStudents.filter((s) => (s.attendance_percentage || 0) < 50);
  const highAttendanceStudents = sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 90);
  const presentCount = sectionStudents.filter((s) => (s.attendance_percentage || 0) >= 75).length;
  const absentCount = sectionStudents.filter((s) => (s.attendance_percentage || 0) < 75).length;

  // Student-wise bar chart data
  const studentBarData = sectionStudents
    .sort((a, b) => (b.attendance_percentage || 0) - (a.attendance_percentage || 0))
    .slice(0, 15) // Top 15 students
    .map(s => ({
      name: s.name.length > 12 ? s.name.slice(0, 12) + "..." : s.name,
      attendance: s.attendance_percentage || 0,
      fill: (s.attendance_percentage || 0) >= 75 
        ? COLORS.high 
        : (s.attendance_percentage || 0) >= 50 
          ? COLORS.medium 
          : COLORS.low
    }));

  // Section-wise bar chart data
  const attendanceBySection = sections.map(section => {
    const sectionStds = allDeptStudents.filter(s => s.section_id === section.id);
    const avg = sectionStds.length > 0 
      ? Math.round(sectionStds.reduce((sum, s) => sum + (s.attendance_percentage || 0), 0) / sectionStds.length)
      : 0;
    return { section: section.name, attendance: avg };
  });

  // Present vs Absent pie chart data
  const presentAbsentData = [
    { name: "Present (≥75%)", value: presentCount, color: COLORS.high },
    { name: "Absent (<75%)", value: absentCount, color: COLORS.low },
  ];

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

  const getBadgeVariant = (attendance: number) => {
    if (attendance >= 75) return "default";
    if (attendance >= 50) return "secondary";
    return "destructive";
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{avgAttendance}%</p>
                <p className="text-xs text-muted-foreground">Average Attendance</p>
              </div>
            </div>
            <Progress value={avgAttendance} className="mt-3 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-success">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{highAttendanceStudents.length}</p>
                <p className="text-xs text-muted-foreground">Excellent (≥90%)</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Top performing students
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-warning">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {sectionStudents.filter(s => (s.attendance_percentage || 0) >= 50 && (s.attendance_percentage || 0) < 75).length}
                </p>
                <p className="text-xs text-muted-foreground">At Risk (50-74%)</p>
              </div>
            </div>
            <Progress 
              value={sectionStudents.length > 0 ? (sectionStudents.filter(s => (s.attendance_percentage || 0) >= 50 && (s.attendance_percentage || 0) < 75).length / sectionStudents.length) * 100 : 0} 
              className="mt-3 h-2 bg-warning/20" 
            />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{lowAttendanceStudents.length}</p>
                <p className="text-xs text-muted-foreground">Critical (&lt;50%)</p>
              </div>
            </div>
            <Progress 
              value={sectionStudents.length > 0 ? (lowAttendanceStudents.length / sectionStudents.length) * 100 : 0} 
              className="mt-3 h-2 bg-destructive/20" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Present vs Absent Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-success" />
              Present vs Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={presentAbsentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, percent }) => 
                      value > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                    }
                    labelLine={false}
                  >
                    {presentAbsentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Attendance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ value }) => value > 0 ? value : ""}
                    labelLine={false}
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student-wise Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-warning" />
              Student-wise Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentBarData} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value}%`, "Attendance"]}
                  />
                  <Bar dataKey="attendance" radius={[0, 4, 4, 0]}>
                    {studentBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList dataKey="attendance" position="right" formatter={(v: number) => `${v}%`} fill="hsl(var(--foreground))" fontSize={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section-wise Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Section-wise Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value}%`, "Avg Attendance"]}
                  />
                  <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="attendance" position="top" formatter={(v: number) => `${v}%`} fill="hsl(var(--foreground))" fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Section {currentSection?.name} Students</CardTitle>
          <p className="text-sm text-muted-foreground">{sectionStudents.length} students • Sorted by attendance</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {sectionStudents.length > 0 ? (
              sectionStudents
                .sort((a, b) => (a.attendance_percentage || 0) - (b.attendance_percentage || 0))
                .map((student) => {
                  const attendance = student.attendance_percentage || 0;
                  return (
                    <div key={student.id} className="p-4 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.roll_number}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <Progress 
                              value={attendance} 
                              className={cn("h-3", getProgressColor(attendance))}
                            />
                          </div>
                          <div className={cn("text-sm font-bold w-14 text-right", getAttendanceClass(attendance))}>
                            {attendance.toFixed(0)}%
                          </div>
                          <Badge 
                            variant={getBadgeVariant(attendance)}
                            className="min-w-[70px] justify-center"
                          >
                            {attendance >= 75 ? "Good" : attendance >= 50 ? "Warning" : "Critical"}
                          </Badge>
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
        </CardContent>
      </Card>
    </div>
  );
}
