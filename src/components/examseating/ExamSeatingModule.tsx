import { useState, useMemo } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useStudents, useClassrooms, DbStudent, DbClassroom } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  FileSpreadsheet, 
  Download, 
  Users, 
  Building2, 
  Shuffle, 
  ClipboardList,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface SeatingEntry {
  classroom: string;
  seatNo: number;
  studentId: string;
  studentName: string;
  rollNumber: string;
  branch: string;
}

export function ExamSeatingModule() {
  const { departments } = useDepartment();
  const [examName, setExamName] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [seatingPlan, setSeatingPlan] = useState<SeatingEntry[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // Fetch all students and classrooms
  const { data: allStudents = [], isLoading: studentsLoading } = useStudents();
  const { data: allClassrooms = [], isLoading: classroomsLoading } = useClassrooms();

  const isLoading = studentsLoading || classroomsLoading;

  // Group students by department
  const studentsByDepartment = useMemo(() => {
    const grouped: Record<string, DbStudent[]> = {};
    allStudents.forEach(student => {
      if (!grouped[student.department_id]) {
        grouped[student.department_id] = [];
      }
      grouped[student.department_id].push(student);
    });
    return grouped;
  }, [allStudents]);

  // Get department name by ID
  const getDepartmentName = (deptId: string) => {
    return departments.find(d => d.id === deptId)?.name || "Unknown";
  };

  // Toggle department selection
  const toggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
    setIsGenerated(false);
  };

  // Toggle classroom selection
  const toggleClassroom = (classroomId: string) => {
    setSelectedClassrooms(prev => 
      prev.includes(classroomId) 
        ? prev.filter(id => id !== classroomId)
        : [...prev, classroomId]
    );
    setIsGenerated(false);
  };

  // Calculate total capacity
  const totalCapacity = useMemo(() => {
    return allClassrooms
      .filter(c => selectedClassrooms.includes(c.id))
      .reduce((sum, c) => sum + c.capacity, 0);
  }, [allClassrooms, selectedClassrooms]);

  // Calculate total students from selected departments
  const totalStudents = useMemo(() => {
    return selectedDepartments.reduce((sum, deptId) => {
      return sum + (studentsByDepartment[deptId]?.length || 0);
    }, 0);
  }, [selectedDepartments, studentsByDepartment]);

  // Generate seating plan
  const generateSeatingPlan = () => {
    if (!examName.trim()) {
      toast.error("Please enter an exam name");
      return;
    }
    if (selectedDepartments.length < 1) {
      toast.error("Please select at least one department");
      return;
    }
    if (selectedClassrooms.length < 1) {
      toast.error("Please select at least one classroom");
      return;
    }
    if (totalStudents > totalCapacity) {
      toast.error(`Not enough capacity! Need ${totalStudents} seats but only ${totalCapacity} available.`);
      return;
    }

    // Get students from selected departments and shuffle
    const studentsToSeat: Array<DbStudent & { branch: string }> = [];
    selectedDepartments.forEach(deptId => {
      const deptStudents = studentsByDepartment[deptId] || [];
      const deptName = getDepartmentName(deptId);
      deptStudents.forEach(student => {
        studentsToSeat.push({ ...student, branch: deptName });
      });
    });

    // Shuffle students to mix branches
    for (let i = studentsToSeat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [studentsToSeat[i], studentsToSeat[j]] = [studentsToSeat[j], studentsToSeat[i]];
    }

    // Assign to classrooms
    const selectedRooms = allClassrooms.filter(c => selectedClassrooms.includes(c.id));
    const plan: SeatingEntry[] = [];
    let studentIndex = 0;

    selectedRooms.forEach(classroom => {
      for (let seat = 1; seat <= classroom.capacity && studentIndex < studentsToSeat.length; seat++) {
        const student = studentsToSeat[studentIndex];
        plan.push({
          classroom: classroom.name,
          seatNo: seat,
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.roll_number,
          branch: student.branch
        });
        studentIndex++;
      }
    });

    setSeatingPlan(plan);
    setIsGenerated(true);
    toast.success(`Seating plan generated for ${plan.length} students`);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (seatingPlan.length === 0) {
      toast.error("No seating plan to export");
      return;
    }

    const headers = ["Classroom", "Seat No", "Student ID", "Student Name", "Roll Number", "Branch"];
    const rows = seatingPlan.map(entry => [
      entry.classroom,
      entry.seatNo.toString(),
      entry.studentId.slice(0, 8),
      entry.studentName,
      entry.rollNumber,
      entry.branch
    ]);

    const csvContent = [
      `Exam: ${examName}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `seating_plan_${examName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully");
  };

  // Group seating plan by classroom for display
  const seatingByClassroom = useMemo(() => {
    const grouped: Record<string, SeatingEntry[]> = {};
    seatingPlan.forEach(entry => {
      if (!grouped[entry.classroom]) {
        grouped[entry.classroom] = [];
      }
      grouped[entry.classroom].push(entry);
    });
    return grouped;
  }, [seatingPlan]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Exam Seating Plan Generator</h2>
            <p className="text-sm text-muted-foreground">
              Create mixed-branch seating arrangements for examinations
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          {/* Exam Name */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="exam-name">Exam Name *</Label>
                <Input
                  id="exam-name"
                  placeholder="e.g., Mid-Semester Examination 2025"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Department Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Branches/Departments
              </CardTitle>
              <CardDescription>
                Students will be mixed across branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {departments.map(dept => {
                    const studentCount = studentsByDepartment[dept.id]?.length || 0;
                    return (
                      <div 
                        key={dept.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`dept-${dept.id}`}
                            checked={selectedDepartments.includes(dept.id)}
                            onCheckedChange={() => toggleDepartment(dept.id)}
                          />
                          <label htmlFor={`dept-${dept.id}`} className="cursor-pointer">
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-xs text-muted-foreground">{dept.code}</p>
                          </label>
                        </div>
                        <Badge variant="secondary">{studentCount} students</Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Classroom Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Select Classrooms
              </CardTitle>
              <CardDescription>
                Choose rooms based on capacity requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {allClassrooms.map(classroom => (
                    <div 
                      key={classroom.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`room-${classroom.id}`}
                          checked={selectedClassrooms.includes(classroom.id)}
                          onCheckedChange={() => toggleClassroom(classroom.id)}
                        />
                        <label htmlFor={`room-${classroom.id}`} className="cursor-pointer">
                          <p className="font-medium">{classroom.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {classroom.facilities?.join(", ") || "No facilities listed"}
                          </p>
                        </label>
                      </div>
                      <Badge variant="outline">{classroom.capacity} seats</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Summary & Actions */}
        <div className="space-y-4">
          {/* Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{totalCapacity}</p>
                  <p className="text-xs text-muted-foreground">Total Capacity</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold">{selectedDepartments.length}</p>
                  <p className="text-xs text-muted-foreground">Branches Selected</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold">{selectedClassrooms.length}</p>
                  <p className="text-xs text-muted-foreground">Rooms Selected</p>
                </div>
              </div>

              {/* Capacity Check */}
              <div className="mt-4 p-3 rounded-lg border">
                {totalStudents <= totalCapacity ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Sufficient capacity available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Need {totalStudents - totalCapacity} more seats</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={generateSeatingPlan}
                  disabled={!examName || selectedDepartments.length === 0 || selectedClassrooms.length === 0}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Generate Seating Plan
                </Button>
                {isGenerated && (
                  <Button variant="outline" className="w-full" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generated Plan Preview */}
          {isGenerated && seatingPlan.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  {examName}
                </CardTitle>
                <CardDescription>
                  {seatingPlan.length} students assigned across {Object.keys(seatingByClassroom).length} rooms
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  {Object.entries(seatingByClassroom).map(([classroom, entries]) => (
                    <div key={classroom} className="border-b border-border last:border-0">
                      <div className="p-3 bg-secondary/30 font-medium flex items-center justify-between">
                        <span>{classroom}</span>
                        <Badge variant="secondary">{entries.length} students</Badge>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Seat</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Branch</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entries.map((entry, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-mono">{entry.seatNo}</TableCell>
                              <TableCell className="font-medium">{entry.studentName}</TableCell>
                              <TableCell className="text-muted-foreground">{entry.rollNumber}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{entry.branch}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
