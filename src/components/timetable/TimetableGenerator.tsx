import { useState, useMemo } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useTeachers, useClassrooms, useTimeSlots, useSendNotification, DbTeacher, DbClassroom } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw, UserX, ArrowRight, FileText, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface TimetableEntry { id: string; day: string; timeSlot: string; subject: string; teacherId: string; teacherName: string; classroomId: string; classroomName: string; isSubstituted?: boolean; originalTeacher?: string; }

export function TimetableGenerator() {
  const { selectedDepartmentId, selectedSectionId, getCurrentDepartment, getSectionsForDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const sections = getSectionsForDepartment(selectedDepartmentId);
  const currentSection = sections.find(s => s.id === selectedSectionId);

  const { data: teachers = [], isLoading: tLoad } = useTeachers(selectedDepartmentId);
  const { data: classrooms = [], isLoading: cLoad } = useClassrooms(selectedDepartmentId);
  const { data: timeSlots = [], isLoading: tsLoad } = useTimeSlots();
  const sendNotification = useSendNotification();

  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>(DAYS.slice(0, 5));
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [substitutionDialog, setSubstitutionDialog] = useState(false);
  const [absentTeacher, setAbsentTeacher] = useState("");
  const [substituteTeacher, setSubstituteTeacher] = useState("");

  const activeSlots = timeSlots.filter(ts => ts.is_active);

  const toggleTeacher = (id: string) => setSelectedTeachers(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const toggleClassroom = (id: string) => setSelectedClassrooms(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  const toggleDay = (day: string) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  const generate = async () => {
    if (!selectedTeachers.length || !selectedClassrooms.length) { toast.error("Select teachers and classrooms"); return; }
    setIsGenerating(true);
    setTimeout(async () => {
      const entries: TimetableEntry[] = [];
      const used = new Set<string>();
      let id = 1;
      selectedDays.forEach(day => {
        activeSlots.forEach(slot => {
          const ts = `${slot.start_time}-${slot.end_time}`;
          if (Math.random() > 0.4) {
            const avail = selectedTeachers.filter(tId => !used.has(`${tId}-${day}-${ts}`));
            const rooms = selectedClassrooms.filter(cId => !used.has(`${cId}-${day}-${ts}`));
            if (avail.length && rooms.length) {
              const tId = avail[Math.floor(Math.random() * avail.length)];
              const cId = rooms[Math.floor(Math.random() * rooms.length)];
              const t = teachers.find(x => x.id === tId)!;
              const c = classrooms.find(x => x.id === cId)!;
              used.add(`${tId}-${day}-${ts}`); used.add(`${cId}-${day}-${ts}`);
              entries.push({ id: `E${id++}`, day, timeSlot: ts, subject: t.subject, teacherId: tId, teacherName: t.name, classroomId: cId, classroomName: c.name });
            }
          }
        });
      });
      setTimetable(entries);
      setIsGenerating(false);
      toast.success(`Generated ${entries.length} classes!`);
      await sendNotification.mutateAsync({ department_id: selectedDepartmentId, section_id: selectedSectionId, type: "app", title: "Timetable Generated", message: `New timetable with ${entries.length} classes for Section ${currentSection?.name}`, recipient_type: "all" });
    }, 1500);
  };

  const teachersInTimetable = useMemo(() => [...new Set(timetable.map(t => t.teacherId))].map(id => teachers.find(t => t.id === id)!).filter(Boolean), [timetable, teachers]);
  const availableSubstitutes = useMemo(() => {
    if (!absentTeacher) return teachers;
    const slots = timetable.filter(t => t.teacherId === absentTeacher).map(t => `${t.day}-${t.timeSlot}`);
    return teachers.filter(t => t.id !== absentTeacher && !timetable.filter(e => e.teacherId === t.id).some(e => slots.includes(`${e.day}-${e.timeSlot}`)));
  }, [absentTeacher, timetable, teachers]);

  const handleSubstitution = async () => {
    if (!absentTeacher || !substituteTeacher) return;
    const sub = teachers.find(t => t.id === substituteTeacher)!;
    const absent = teachers.find(t => t.id === absentTeacher)!;
    const count = timetable.filter(t => t.teacherId === absentTeacher).length;
    setTimetable(timetable.map(e => e.teacherId === absentTeacher ? { 
      ...e, 
      teacherId: substituteTeacher, 
      teacherName: sub.name, 
      subject: sub.subject,
      isSubstituted: true,
      originalTeacher: absent.name
    } : e));
    setSubstitutionDialog(false); setAbsentTeacher(""); setSubstituteTeacher("");
    toast.success(`Substituted ${count} classes`);
    await sendNotification.mutateAsync({ department_id: selectedDepartmentId, section_id: selectedSectionId, type: "app", title: "Timetable Updated - Teacher Substitution", message: `${count} classes reassigned from ${absent.name} to ${sub.name} due to teacher absence`, recipient_type: "all" });
  };

  const exportPDF = () => {
    if (!timetable.length) { toast.error("No timetable"); return; }
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18); doc.text(`${currentDept?.name} - Section ${currentSection?.name}`, 14, 20);
    const head = ["Time", ...selectedDays];
    const body = activeSlots.map(slot => {
      const ts = `${slot.start_time}-${slot.end_time}`;
      return [ts, ...selectedDays.map(day => { const e = timetable.find(x => x.day === day && x.timeSlot === ts); return e ? `${e.subject}\n${e.teacherName}${e.isSubstituted ? ' (Sub)' : ''}` : "-"; })];
    });
    autoTable(doc, { head: [head], body, startY: 30, theme: "grid", headStyles: { fillColor: [79, 70, 229] } });
    doc.save(`timetable-${currentDept?.code}-${currentSection?.name}.pdf`);
    toast.success("PDF exported!");
  };

  const exportCSV = () => {
    if (!timetable.length) { toast.error("No timetable to export"); return; }
    const headers = ["Department", "Section", "Day", "Time Slot", "Subject", "Teacher", "Classroom", "Adjustment Note"];
    const rows = timetable.map(e => [
      currentDept?.name || "",
      currentSection?.name || "",
      e.day,
      e.timeSlot,
      e.subject,
      e.teacherName,
      e.classroomName,
      e.isSubstituted ? `Substituted from ${e.originalTeacher || "original teacher"}` : ""
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `timetable-${currentDept?.code}-${currentSection?.name}.csv`;
    link.click();
    toast.success("CSV exported successfully!");
  };

  if (tLoad || cLoad || tsLoad) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold">{currentDept?.name} - Timetable Generator</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-semibold mb-4">Teachers</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {teachers.map(t => (
              <div key={t.id} className={cn("flex items-center gap-3 p-2 rounded-lg cursor-pointer", selectedTeachers.includes(t.id) ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary")} onClick={() => toggleTeacher(t.id)}>
                <Checkbox checked={selectedTeachers.includes(t.id)} />
                <div><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{t.subject}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-semibold mb-4">Classrooms</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {classrooms.map(c => (
              <div key={c.id} className={cn("flex items-center gap-3 p-2 rounded-lg cursor-pointer", selectedClassrooms.includes(c.id) ? "bg-accent/10 border border-accent/30" : "hover:bg-secondary")} onClick={() => toggleClassroom(c.id)}>
                <Checkbox checked={selectedClassrooms.includes(c.id)} />
                <div><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">Cap: {c.capacity}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-semibold mb-4">Days</h3>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => <Badge key={day} variant={selectedDays.includes(day) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleDay(day)}>{day.slice(0, 3)}</Badge>)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <Button onClick={generate} disabled={isGenerating} size="lg">{isGenerating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}{isGenerating ? "Generating..." : "Generate Timetable"}</Button>
        {timetable.length > 0 && (<><span className="text-success flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />{timetable.length} classes</span><Button variant="outline" onClick={() => setSubstitutionDialog(true)}><UserX className="w-4 h-4 mr-2" />Substitution</Button><Button variant="outline" onClick={exportPDF}><FileText className="w-4 h-4 mr-2" />Export PDF</Button><Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" />Export CSV</Button></>)}
      </div>
      {timetable.length > 0 && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="p-5 border-b"><h3 className="font-semibold">Generated Timetable - Section {currentSection?.name}</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-muted/50"><th className="p-3 text-left">Time</th>{selectedDays.map(d => <th key={d} className="p-3 text-left">{d}</th>)}</tr></thead>
              <tbody>
                {activeSlots.map(slot => {
                  const ts = `${slot.start_time}-${slot.end_time}`;
                  return (
                    <tr key={slot.id} className="border-t">
                      <td className="p-3 font-mono text-sm">{ts}</td>
                      {selectedDays.map(day => {
                        const e = timetable.find(x => x.day === day && x.timeSlot === ts);
                        return <td key={`${day}-${slot.id}`} className="p-2">{e ? <div className="p-3 rounded-lg bg-primary/10 border border-primary/20"><p className="font-medium text-sm">{e.subject}</p><p className="text-xs text-primary">{e.teacherName}</p><Badge variant="secondary" className="mt-1 text-xs">{e.classroomName}</Badge></div> : <div className="p-3 rounded-lg bg-secondary/30 border-dashed border h-16" />}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Dialog open={substitutionDialog} onOpenChange={setSubstitutionDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle><UserX className="w-5 h-5 inline mr-2 text-warning" />Teacher Substitution</DialogTitle><DialogDescription>Select absent and substitute teachers</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Absent Teacher</Label><Select value={absentTeacher} onValueChange={v => { setAbsentTeacher(v); setSubstituteTeacher(""); }}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{teachersInTimetable.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
            {absentTeacher && <ArrowRight className="w-5 h-5 mx-auto text-muted-foreground" />}
            <div><Label>Substitute</Label><Select value={substituteTeacher} onValueChange={setSubstituteTeacher} disabled={!absentTeacher}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{availableSubstitutes.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.subject})</SelectItem>)}</SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSubstitutionDialog(false)}>Cancel</Button><Button onClick={handleSubstitution} disabled={!absentTeacher || !substituteTeacher}>Apply</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}