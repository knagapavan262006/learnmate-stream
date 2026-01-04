import { useState, useMemo } from "react";
import {
  teachers,
  classrooms,
  timeSlots,
  days,
  TimetableEntry,
} from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Download,
  UserX,
  ArrowRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function TimetableGenerator() {
  const { selectedDepartment, selectedSection, getCurrentDepartment, getSectionsForDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const sections = getSectionsForDepartment(selectedDepartment);

  const deptTeachers = teachers.filter(t => t.departmentId === selectedDepartment);
  const deptClassrooms = classrooms.filter(c => c.departmentId === selectedDepartment);

  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>(days.slice(0, 5));
  const [currentSection, setCurrentSection] = useState<string>(selectedSection);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  
  // Teacher substitution state
  const [substitutionDialog, setSubstitutionDialog] = useState(false);
  const [absentTeacher, setAbsentTeacher] = useState<string>("");
  const [substituteTeacher, setSubstituteTeacher] = useState<string>("");

  const activeTimeSlots = timeSlots.filter((ts) => ts.isActive);

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleClassroom = (id: string) => {
    setSelectedClassrooms((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generateTimetable = () => {
    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher");
      return;
    }
    if (selectedClassrooms.length === 0) {
      toast.error("Please select at least one classroom");
      return;
    }
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    setIsGenerating(true);
    setConflicts([]);

    setTimeout(() => {
      const newTimetable: TimetableEntry[] = [];
      const usedSlots: Set<string> = new Set();
      const newConflicts: string[] = [];
      let entryId = 1;

      selectedDays.forEach((day) => {
        activeTimeSlots.forEach((slot) => {
          const timeSlotStr = `${slot.startTime}-${slot.endTime}`;

          if (Math.random() > 0.4) {
            const availableTeachers = selectedTeachers.filter((tId) => {
              const teacher = deptTeachers.find((t) => t.id === tId);
              const slotKey = `${tId}-${day}-${timeSlotStr}`;
              return (
                teacher?.availability.includes(day) && !usedSlots.has(slotKey)
              );
            });

            const availableClassrooms = selectedClassrooms.filter((cId) => {
              const slotKey = `${cId}-${day}-${timeSlotStr}`;
              return !usedSlots.has(slotKey);
            });

            if (availableTeachers.length > 0 && availableClassrooms.length > 0) {
              const teacherId =
                availableTeachers[
                  Math.floor(Math.random() * availableTeachers.length)
                ];
              const classroomId =
                availableClassrooms[
                  Math.floor(Math.random() * availableClassrooms.length)
                ];

              const teacher = deptTeachers.find((t) => t.id === teacherId)!;
              const classroom = deptClassrooms.find((c) => c.id === classroomId)!;

              usedSlots.add(`${teacherId}-${day}-${timeSlotStr}`);
              usedSlots.add(`${classroomId}-${day}-${timeSlotStr}`);

              newTimetable.push({
                id: `GEN${entryId++}`,
                day,
                timeSlot: timeSlotStr,
                subject: teacher.subject,
                teacherId,
                teacherName: teacher.name,
                classroomId,
                classroomName: classroom.name,
                departmentId: selectedDepartment,
                section: currentSection,
              });
            } else if (
              availableTeachers.length === 0 &&
              selectedTeachers.length > 0
            ) {
              newConflicts.push(
                `No available teachers for ${day} ${timeSlotStr}`
              );
            }
          }
        });
      });

      setTimetable(newTimetable);
      setConflicts(newConflicts);
      setIsGenerating(false);
      toast.success(`Generated ${newTimetable.length} classes for ${currentDept?.code} Section ${currentSection}!`);
    }, 1500);
  };

  const timetableGrid = useMemo(() => {
    const grid: Record<string, Record<string, TimetableEntry | null>> = {};
    selectedDays.forEach((day) => {
      grid[day] = {};
      activeTimeSlots.forEach((slot) => {
        const timeSlotStr = `${slot.startTime}-${slot.endTime}`;
        grid[day][timeSlotStr] =
          timetable.find(
            (entry) => entry.day === day && entry.timeSlot === timeSlotStr
          ) || null;
      });
    });
    return grid;
  }, [timetable, selectedDays, activeTimeSlots]);

  // Get teachers currently in the timetable
  const teachersInTimetable = useMemo(() => {
    const ids = new Set(timetable.map(t => t.teacherId));
    return deptTeachers.filter(t => ids.has(t.id));
  }, [timetable, deptTeachers]);

  // Get available substitutes (teachers not assigned in a conflicting slot)
  const availableSubstitutes = useMemo(() => {
    if (!absentTeacher) return deptTeachers;
    
    const absentTeacherSlots = timetable
      .filter(t => t.teacherId === absentTeacher)
      .map(t => `${t.day}-${t.timeSlot}`);
    
    return deptTeachers.filter(t => {
      if (t.id === absentTeacher) return false;
      const teacherSlots = timetable
        .filter(entry => entry.teacherId === t.id)
        .map(entry => `${entry.day}-${entry.timeSlot}`);
      
      // Check if there's any overlap
      const hasConflict = absentTeacherSlots.some(slot => teacherSlots.includes(slot));
      return !hasConflict;
    });
  }, [absentTeacher, timetable, deptTeachers]);

  const handleSubstitution = () => {
    if (!absentTeacher || !substituteTeacher) {
      toast.error("Please select both absent and substitute teachers");
      return;
    }

    const substitute = deptTeachers.find(t => t.id === substituteTeacher);
    if (!substitute) return;

    const updatedTimetable = timetable.map(entry => {
      if (entry.teacherId === absentTeacher) {
        return {
          ...entry,
          teacherId: substituteTeacher,
          teacherName: substitute.name,
          subject: substitute.subject,
        };
      }
      return entry;
    });

    const affectedCount = timetable.filter(t => t.teacherId === absentTeacher).length;
    setTimetable(updatedTimetable);
    setSubstitutionDialog(false);
    setAbsentTeacher("");
    setSubstituteTeacher("");
    toast.success(`Substituted ${affectedCount} classes with ${substitute.name}`);
  };

  const exportTimetablePDF = () => {
    if (timetable.length === 0) {
      toast.error("No timetable to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229); // Indigo color
    doc.text(`${currentDept?.name} - Section ${currentSection}`, 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Weekly Timetable", 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);

    // Prepare table data
    const tableHead = ["Time", ...selectedDays];
    const tableBody = activeTimeSlots.map(slot => {
      const timeSlotStr = `${slot.startTime}-${slot.endTime}`;
      const row = [timeSlotStr];
      
      selectedDays.forEach(day => {
        const entry = timetableGrid[day]?.[timeSlotStr];
        if (entry) {
          row.push(`${entry.subject}\n${entry.teacherName}\n${entry.classroomName}`);
        } else {
          row.push("-");
        }
      });
      
      return row;
    });

    autoTable(doc, {
      head: [tableHead],
      body: tableBody,
      startY: 42,
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
        halign: "center",
      },
      columnStyles: {
        0: { fontStyle: "bold", halign: "left" },
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `AI Smart Classroom System - Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    doc.save(`timetable-${currentDept?.code}-section-${currentSection}.pdf`);
    toast.success("Timetable exported to PDF!");
  };

  return (
    <div className="space-y-6">
      {/* Department Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name} - Timetable Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate smart schedules for department sections
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Department Teachers
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {deptTeachers.length > 0 ? (
              deptTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                    selectedTeachers.includes(teacher.id)
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => toggleTeacher(teacher.id)}
                >
                  <Checkbox
                    checked={selectedTeachers.includes(teacher.id)}
                    onCheckedChange={() => toggleTeacher(teacher.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No teachers in this department
              </p>
            )}
          </div>
        </div>

        {/* Classrooms Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            Department Classrooms
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {deptClassrooms.length > 0 ? (
              deptClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                    selectedClassrooms.includes(classroom.id)
                      ? "bg-accent/10 border border-accent/30"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => toggleClassroom(classroom.id)}
                >
                  <Checkbox
                    checked={selectedClassrooms.includes(classroom.id)}
                    onCheckedChange={() => toggleClassroom(classroom.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{classroom.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Capacity: {classroom.capacity}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No classrooms in this department
              </p>
            )}
          </div>
        </div>

        {/* Days & Section Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-success" />
            Section & Days
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Target Section</Label>
              <Select value={currentSection} onValueChange={setCurrentSection}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section} value={section}>
                      Section {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                Working Days
              </Label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Badge
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          onClick={generateTimetable}
          disabled={isGenerating}
          className="gap-2"
          size="lg"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isGenerating ? "Generating..." : "Generate Smart Timetable"}
        </Button>
        
        {timetable.length > 0 && (
          <>
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="w-4 h-4" />
              {timetable.length} classes scheduled
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => setSubstitutionDialog(true)}
            >
              <UserX className="w-4 h-4" />
              Teacher Substitution
            </Button>
            
            <Button variant="outline" className="gap-2" onClick={exportTimetablePDF}>
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
          </>
        )}
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Scheduling Conflicts</span>
          </div>
          <ul className="text-sm text-warning/80 space-y-1">
            {conflicts.slice(0, 3).map((conflict, i) => (
              <li key={i}>• {conflict}</li>
            ))}
            {conflicts.length > 3 && (
              <li>• And {conflicts.length - 3} more...</li>
            )}
          </ul>
        </div>
      )}

      {/* Timetable Grid */}
      {timetable.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden" id="timetable-grid">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Generated Timetable - {currentDept?.code} Section {currentSection}
            </h3>
            <p className="text-sm text-muted-foreground">
              Week schedule with {timetable.length} classes
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="p-3 text-left font-medium">Time</th>
                  {selectedDays.map((day) => (
                    <th key={day} className="p-3 text-left font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTimeSlots.map((slot) => {
                  const timeSlotStr = `${slot.startTime}-${slot.endTime}`;
                  return (
                    <tr key={slot.id} className="border-t border-border">
                      <td className="p-3 font-mono text-sm text-muted-foreground whitespace-nowrap">
                        {timeSlotStr}
                      </td>
                      {selectedDays.map((day) => {
                        const entry = timetableGrid[day]?.[timeSlotStr];
                        return (
                          <td key={`${day}-${slot.id}`} className="p-2">
                            {entry ? (
                              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 min-w-32">
                                <p className="font-medium text-sm text-foreground">
                                  {entry.subject}
                                </p>
                                <p className="text-xs text-primary mt-1">
                                  {entry.teacherName.split(" ").slice(-1)[0]}
                                </p>
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {entry.classroomName}
                                </Badge>
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg bg-secondary/30 border border-dashed border-border min-w-32 h-20" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teacher Substitution Dialog */}
      <Dialog open={substitutionDialog} onOpenChange={setSubstitutionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-warning" />
              Teacher Substitution
            </DialogTitle>
            <DialogDescription>
              Select an absent teacher and assign a substitute from the same department.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Absent Teacher</Label>
              <Select value={absentTeacher} onValueChange={(val) => {
                setAbsentTeacher(val);
                setSubstituteTeacher("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select absent teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachersInTimetable.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {absentTeacher && (
              <div className="flex items-center justify-center py-2">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Substitute Teacher</Label>
              <Select 
                value={substituteTeacher} 
                onValueChange={setSubstituteTeacher}
                disabled={!absentTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder={absentTeacher ? "Select substitute" : "First select absent teacher"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubstitutes.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      <div className="flex items-center gap-2">
                        <span>{teacher.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {teacher.subject}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {absentTeacher && availableSubstitutes.length === 0 && (
                <p className="text-xs text-warning">No available substitutes without schedule conflicts</p>
              )}
            </div>
            
            {absentTeacher && (
              <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">{timetable.filter(t => t.teacherId === absentTeacher).length}</strong> classes will be reassigned
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubstitutionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubstitution}
              disabled={!absentTeacher || !substituteTeacher}
            >
              Apply Substitution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
