import { useState, useEffect } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useStudents } from "@/hooks/useDatabase";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Calendar, Save, Users, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  isPresent: boolean;
}

export function TakeAttendance() {
  const { selectedDepartmentId, selectedSectionId, getCurrentDepartment, sections } = useDepartment();
  const { data: students, isLoading: studentsLoading } = useStudents(selectedDepartmentId, selectedSectionId);
  
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [subject, setSubject] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState<string[]>([]);

  const currentDept = getCurrentDepartment();
  const currentSection = sections.find(s => s.id === selectedSectionId);

  // Initialize attendance records when students load
  useEffect(() => {
    if (students) {
      const sectionStudents = students.filter(s => s.section_id === selectedSectionId);
      setAttendanceRecords(
        sectionStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          rollNumber: student.roll_number,
          isPresent: true // Default to present
        }))
      );
    }
  }, [students, selectedSectionId]);

  // Check for existing attendance
  useEffect(() => {
    const checkExistingAttendance = async () => {
      if (!selectedSectionId || !attendanceDate) return;
      
      const { data } = await supabase
        .from("attendance_records")
        .select("student_id")
        .eq("section_id", selectedSectionId)
        .eq("attendance_date", attendanceDate)
        .eq("subject", subject || "");

      if (data) {
        setExistingAttendance(data.map(r => r.student_id));
      }
    };
    checkExistingAttendance();
  }, [selectedSectionId, attendanceDate, subject]);

  const toggleAttendance = (studentId: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId
          ? { ...record, isPresent: !record.isPresent }
          : record
      )
    );
  };

  const markAllPresent = () => {
    setAttendanceRecords(prev => prev.map(r => ({ ...r, isPresent: true })));
  };

  const markAllAbsent = () => {
    setAttendanceRecords(prev => prev.map(r => ({ ...r, isPresent: false })));
  };

  const saveAttendance = async () => {
    if (!selectedDepartmentId || !selectedSectionId) {
      toast({ title: "Error", description: "Please select department and section", variant: "destructive" });
      return;
    }

    if (attendanceRecords.length === 0) {
      toast({ title: "Error", description: "No students to mark attendance", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare attendance records
      const records = attendanceRecords.map(record => ({
        student_id: record.studentId,
        department_id: selectedDepartmentId,
        section_id: selectedSectionId,
        attendance_date: attendanceDate,
        status: record.isPresent ? "present" : "absent",
        subject: subject || null
      }));

      // Upsert attendance records (update if exists, insert if new)
      const { error } = await supabase
        .from("attendance_records")
        .upsert(records, { 
          onConflict: "student_id,attendance_date,subject",
          ignoreDuplicates: false 
        });

      if (error) throw error;

      // Update attendance percentage for each student
      for (const record of attendanceRecords) {
        // Get total attendance records for this student
        const { data: totalRecords } = await supabase
          .from("attendance_records")
          .select("status")
          .eq("student_id", record.studentId);

        if (totalRecords && totalRecords.length > 0) {
          const presentCount = totalRecords.filter(r => r.status === "present").length;
          const percentage = Math.round((presentCount / totalRecords.length) * 100);

          // Update student's attendance percentage
          await supabase
            .from("students")
            .update({ attendance_percentage: percentage })
            .eq("id", record.studentId);
        }
      }

      toast({ 
        title: "Success", 
        description: `Attendance saved successfully for ${attendanceRecords.length} students` 
      });

      // Refresh existing attendance check
      setExistingAttendance(attendanceRecords.map(r => r.studentId));

    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save attendance", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = attendanceRecords.filter(r => r.isPresent).length;
  const absentCount = attendanceRecords.filter(r => !r.isPresent).length;
  const hasExistingAttendance = existingAttendance.length > 0;

  if (studentsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name || "Select Department"} - {currentSection?.name || "Select Section"}
        </h2>
        <p className="text-sm text-muted-foreground">Take attendance for students</p>
      </div>

      {/* Attendance Context Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                max={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject / Period (Optional)</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Period 1"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>
          {hasExistingAttendance && (
            <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
              ⚠️ Attendance already exists for this date/subject. Saving will update existing records.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{attendanceRecords.length}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student List
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                Mark All Present
              </Button>
              <Button variant="outline" size="sm" onClick={markAllAbsent}>
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found in this section. Please select a valid department and section.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">S.No</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center w-32">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record, index) => (
                    <TableRow key={record.studentId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{record.rollNumber}</TableCell>
                      <TableCell>{record.studentName}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox
                            id={`attendance-${record.studentId}`}
                            checked={record.isPresent}
                            onCheckedChange={() => toggleAttendance(record.studentId)}
                          />
                          <Label
                            htmlFor={`attendance-${record.studentId}`}
                            className={`cursor-pointer ${
                              record.isPresent 
                                ? "text-green-600 font-medium" 
                                : "text-red-600 font-medium"
                            }`}
                          >
                            {record.isPresent ? "Present" : "Absent"}
                          </Label>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {attendanceRecords.length > 0 && (
        <div className="flex justify-end">
          <Button 
            onClick={saveAttendance} 
            disabled={isSaving}
            size="lg"
            className="gap-2"
          >
            <Save className="h-5 w-5" />
            {isSaving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      )}
    </div>
  );
}
