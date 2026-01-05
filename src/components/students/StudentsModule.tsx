import { useState } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useStudents, useAddStudent, useDeleteStudent, DbStudent } from "@/hooks/useDatabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export function StudentsModule() {
  const { selectedDepartmentId, selectedSectionId, getCurrentDepartment, getSectionsForDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const sections = getSectionsForDepartment(selectedDepartmentId);
  const currentSection = sections.find(s => s.id === selectedSectionId);
  
  const { data: students = [], isLoading } = useStudents(selectedDepartmentId, selectedSectionId);
  const addStudent = useAddStudent();
  const deleteStudent = useDeleteStudent();
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", roll_number: "", email: "" });

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!newStudent.name || !newStudent.roll_number) { toast.error("Fill required fields"); return; }
    await addStudent.mutateAsync({ department_id: selectedDepartmentId, section_id: selectedSectionId, name: newStudent.name, roll_number: newStudent.roll_number, email: newStudent.email || null, attendance_percentage: 100 });
    setNewStudent({ name: "", roll_number: "", email: "" }); setIsAddOpen(false);
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold">{currentDept?.name} - Section {currentSection?.name}</h2>
        <p className="text-sm text-muted-foreground">{students.length} students</p>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Student</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Name *</Label><Input value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} /></div>
              <div><Label>Roll *</Label><Input value={newStudent.roll_number} onChange={e => setNewStudent({ ...newStudent, roll_number: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full" disabled={addStudent.isPending}>{addStudent.isPending ? "Adding..." : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Roll</TableHead><TableHead>Name</TableHead><TableHead>Attendance</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono">{s.roll_number}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Progress value={s.attendance_percentage || 0} className="h-2 w-20" /><span>{(s.attendance_percentage || 0).toFixed(0)}%</span></div></TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => deleteStudent.mutate(s.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No students</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}