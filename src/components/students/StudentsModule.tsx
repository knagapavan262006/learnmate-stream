import { useState } from "react";
import { students as initialStudents, Student } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, TrendingUp, TrendingDown, Plus, Edit2, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function StudentsModule() {
  const { selectedDepartment, selectedSection, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  const filteredStudents = students.filter(
    (s) =>
      s.departmentId === selectedDepartment &&
      s.section === selectedSection &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const getAttendanceClass = (attendance: number) => {
    if (attendance >= 75) return "attendance-high";
    if (attendance >= 50) return "attendance-medium";
    return "attendance-low";
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 75) return "bg-success";
    if (attendance >= 50) return "bg-warning";
    return "bg-danger";
  };

  const getWeeklyData = (weeklyAttendance: number[]) =>
    weeklyAttendance.map((value, index) => ({
      day: weekDays[index],
      attendance: value,
    }));

  const handleAddStudent = () => {
    if (!newStudent.name) {
      toast.error("Please enter student name");
      return;
    }
    const student: Student = {
      id: `S${String(students.length + 1).padStart(3, "0")}`,
      name: newStudent.name,
      departmentId: selectedDepartment,
      section: selectedSection,
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(" ", ".")}@student.edu`,
      attendance: 0,
      weeklyAttendance: [0, 0, 0, 0, 0],
    };
    setStudents([...students, student]);
    setNewStudent({ name: "", email: "" });
    setIsAddOpen(false);
    toast.success("Student added successfully");
  };

  const handleEditStudent = () => {
    if (!editingStudent) return;
    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
    toast.success("Student updated successfully");
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success("Student removed");
  };

  return (
    <div className="space-y-6">
      {/* Department Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name} - Section {selectedSection}
        </h2>
        <p className="text-sm text-muted-foreground">
          {filteredStudents.length} students in this section
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Student to {currentDept?.code} - Section {selectedSection}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="john.doe@student.edu"
                />
              </div>
              <Button onClick={handleAddStudent} className="w-full">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="hidden lg:table-cell">Weekly Trend</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const trend =
                  student.weeklyAttendance[4] - student.weeklyAttendance[0];
                return (
                  <TableRow
                    key={student.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {student.id}
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.departmentId}</Badge>
                    </TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-24">
                          <Progress
                            value={student.attendance}
                            className={cn("h-2", getAttendanceColor(student.attendance))}
                          />
                        </div>
                        <span className={getAttendanceClass(student.attendance)}>
                          {student.attendance}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {student.weeklyAttendance.map((day, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-2 h-6 rounded-sm",
                                day >= 80
                                  ? "bg-success/80"
                                  : day >= 60
                                  ? "bg-warning/80"
                                  : "bg-danger/80"
                              )}
                            />
                          ))}
                        </div>
                        {trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : trend < 0 ? (
                          <TrendingDown className="w-4 h-4 text-danger" />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedStudent(student)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingStudent(student)}
                          className="text-accent hover:bg-accent/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-danger hover:bg-danger/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No students found in this section
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Student Profile Dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedStudent.departmentId} - Section {selectedStudent.section}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Overall Attendance
                  </span>
                  <span
                    className={getAttendanceClass(selectedStudent.attendance)}
                  >
                    {selectedStudent.attendance}%
                  </span>
                </div>
                <Progress
                  value={selectedStudent.attendance}
                  className={cn("h-3", getAttendanceColor(selectedStudent.attendance))}
                />
              </div>

              <div>
                <h4 className="font-medium mb-3">Weekly Attendance</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getWeeklyData(selectedStudent.weeklyAttendance)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="day"
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
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editingStudent.name}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingStudent.email}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, email: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleEditStudent} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
