import { useState } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { 
  useTeachers, 
  useAddTeacher, 
  useUpdateTeacher, 
  useDeleteTeacher,
  useMarkTeacherAbsent,
  useSendNotification,
  DbTeacher
} from "@/hooks/useDatabase";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Mail, Search, Edit2, UserX, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function TeachersModule() {
  const { selectedDepartmentId, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  
  const { data: teachers = [], isLoading } = useTeachers(selectedDepartmentId);
  const addTeacher = useAddTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const markAbsent = useMarkTeacherAbsent();
  const sendNotification = useSendNotification();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<DbTeacher | null>(null);
  const [absentDialog, setAbsentDialog] = useState<DbTeacher | null>(null);
  const [absentReason, setAbsentReason] = useState("");
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    subject: "",
    email: "",
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.subject) {
      toast.error("Please fill in required fields");
      return;
    }
    await addTeacher.mutateAsync({
      department_id: selectedDepartmentId,
      name: newTeacher.name,
      subject: newTeacher.subject,
      email: newTeacher.email || null,
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      is_absent: false,
      absent_date: null,
    });
    setNewTeacher({ name: "", subject: "", email: "" });
    setIsAddOpen(false);
  };

  const handleEditTeacher = async () => {
    if (!editingTeacher) return;
    await updateTeacher.mutateAsync({
      id: editingTeacher.id,
      name: editingTeacher.name,
      subject: editingTeacher.subject,
      email: editingTeacher.email,
    });
    setEditingTeacher(null);
  };

  const handleMarkAbsent = async () => {
    if (!absentDialog) return;
    
    await markAbsent.mutateAsync({
      teacherId: absentDialog.id,
      departmentId: selectedDepartmentId,
      reason: absentReason || undefined,
    });

    // Send notification
    await sendNotification.mutateAsync({
      department_id: selectedDepartmentId,
      section_id: null,
      type: "app",
      title: "Teacher Absence Alert",
      message: `${absentDialog.name} (${absentDialog.subject}) is absent today. ${absentReason ? `Reason: ${absentReason}` : "Timetable adjustments may be required."}`,
      recipient_type: "all",
    });

    setAbsentDialog(null);
    setAbsentReason("");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name} - Faculty
        </h2>
        <p className="text-sm text-muted-foreground">
          {filteredTeachers.length} teachers in department
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher to {currentDept?.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                  placeholder="Data Structures"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  placeholder="john.smith@college.edu"
                />
              </div>
              <Button 
                onClick={handleAddTeacher} 
                className="w-full"
                disabled={addTeacher.isPending}
              >
                {addTeacher.isPending ? "Adding..." : "Add Teacher"}
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
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher, index) => (
                <TableRow
                  key={teacher.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{teacher.subject}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {teacher.email || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {teacher.is_absent ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Absent
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-success border-success/50 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(teacher.availability || []).slice(0, 3).map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                      {(teacher.availability || []).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{(teacher.availability || []).length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTeacher(teacher)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {!teacher.is_absent && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAbsentDialog(teacher)}
                          className="text-warning hover:bg-warning/10"
                          title="Mark Absent"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTeacher.mutate(teacher.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No teachers found in this department
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
          </DialogHeader>
          {editingTeacher && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={editingTeacher.subject}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingTeacher.email || ""}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleEditTeacher} 
                className="w-full"
                disabled={updateTeacher.isPending}
              >
                {updateTeacher.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark Absent Dialog */}
      <Dialog open={!!absentDialog} onOpenChange={() => setAbsentDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-warning" />
              Mark Teacher Absent
            </DialogTitle>
            <DialogDescription>
              This will mark the teacher as absent and trigger notifications. The system will identify affected classes.
            </DialogDescription>
          </DialogHeader>
          {absentDialog && (
            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <p className="font-medium">{absentDialog.name}</p>
                <p className="text-sm text-muted-foreground">{absentDialog.subject}</p>
              </div>
              <div className="space-y-2">
                <Label>Reason (optional)</Label>
                <Textarea
                  value={absentReason}
                  onChange={(e) => setAbsentReason(e.target.value)}
                  placeholder="e.g., Sick leave, Personal emergency..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAbsentDialog(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleMarkAbsent}
                  disabled={markAbsent.isPending}
                >
                  {markAbsent.isPending ? "Processing..." : "Mark Absent & Notify"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
