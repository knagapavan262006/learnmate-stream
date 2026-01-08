import { useState } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useStudents, useAddStudent, useUpdateStudent, useDeleteStudent, DbStudent, useSections } from "@/hooks/useDatabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Search, Edit2 } from "lucide-react";
import { toast } from "sonner";

export function StudentsModule() {
  const { selectedDepartmentId, selectedSectionId, getCurrentDepartment, getSectionsForDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  const sections = getSectionsForDepartment(selectedDepartmentId);
  const currentSection = sections.find(s => s.id === selectedSectionId);
  
  const { data: students = [], isLoading } = useStudents(selectedDepartmentId, selectedSectionId);
  const { data: allSections = [] } = useSections(selectedDepartmentId);
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<DbStudent | null>(null);
  const [newStudent, setNewStudent] = useState({ name: "", roll_number: "", email: "", phone: "" });

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!newStudent.name || !newStudent.roll_number) { 
      toast.error("Fill required fields"); 
      return; 
    }
    await addStudent.mutateAsync({ 
      department_id: selectedDepartmentId, 
      section_id: selectedSectionId, 
      name: newStudent.name, 
      roll_number: newStudent.roll_number, 
      email: newStudent.email || null, 
      attendance_percentage: 100 
    });
    setNewStudent({ name: "", roll_number: "", email: "", phone: "" }); 
    setIsAddOpen(false);
  };

  const handleEdit = async () => {
    if (!editingStudent) return;
    await updateStudent.mutateAsync({
      id: editingStudent.id,
      name: editingStudent.name,
      roll_number: editingStudent.roll_number,
      email: editingStudent.email,
      section_id: editingStudent.section_id,
    });
    setEditingStudent(null);
  };

  const getAttendanceColor = (pct: number) => {
    if (pct >= 75) return "bg-success";
    if (pct >= 50) return "bg-warning";
    return "bg-destructive";
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
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Name *</Label><Input value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} /></div>
              <div><Label>Roll Number *</Label><Input value={newStudent.roll_number} onChange={e => setNewStudent({ ...newStudent, roll_number: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} /></div>
              <div><Label>Phone (Optional)</Label><Input value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} placeholder="+91 9876543210" /></div>
              <Button onClick={handleAdd} className="w-full" disabled={addStudent.isPending}>
                {addStudent.isPending ? "Adding..." : "Add Student"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Roll</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-mono">{s.roll_number}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.email || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={s.attendance_percentage || 0} className={`h-2 w-20 ${getAttendanceColor(s.attendance_percentage || 0)}`} />
                    <span className="text-sm font-medium">{(s.attendance_percentage || 0).toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingStudent(s)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteStudent.mutate(s.id)} 
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
          {editingStudent && (
            <div className="space-y-4 pt-4">
              <div>
                <Label>Name</Label>
                <Input 
                  value={editingStudent.name} 
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })} 
                />
              </div>
              <div>
                <Label>Roll Number</Label>
                <Input 
                  value={editingStudent.roll_number} 
                  onChange={e => setEditingStudent({ ...editingStudent, roll_number: e.target.value })} 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  value={editingStudent.email || ""} 
                  onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })} 
                />
              </div>
              <div>
                <Label>Section</Label>
                <Select 
                  value={editingStudent.section_id} 
                  onValueChange={v => setEditingStudent({ ...editingStudent, section_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allSections.map(sec => (
                      <SelectItem key={sec.id} value={sec.id}>{sec.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEdit} className="w-full" disabled={updateStudent.isPending}>
                {updateStudent.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}