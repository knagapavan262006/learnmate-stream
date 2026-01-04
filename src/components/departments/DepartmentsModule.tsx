import { useState } from "react";
import { useDepartment, Department } from "@/contexts/DepartmentContext";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit2, Trash2, Building, Users2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function DepartmentsModule() {
  const { departments, setDepartments, selectedDepartment, setSelectedDepartment } = useDepartment();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [newDept, setNewDept] = useState({ name: "", code: "", sections: "A, B" });
  const [newSection, setNewSection] = useState("");
  const [addingSectionTo, setAddingSectionTo] = useState<string | null>(null);

  const handleAddDepartment = () => {
    if (!newDept.name || !newDept.code) {
      toast.error("Please fill in all fields");
      return;
    }
    if (departments.find(d => d.code === newDept.code)) {
      toast.error("Department code already exists");
      return;
    }
    const sections = newDept.sections.split(",").map(s => s.trim()).filter(s => s);
    const dept: Department = {
      id: newDept.code,
      name: newDept.name,
      code: newDept.code,
      sections: sections.length > 0 ? sections : ["A"],
    };
    setDepartments([...departments, dept]);
    setNewDept({ name: "", code: "", sections: "A, B" });
    setIsAddOpen(false);
    toast.success("Department added successfully");
  };

  const handleEditDepartment = () => {
    if (!editingDept) return;
    setDepartments(departments.map(d => d.id === editingDept.id ? editingDept : d));
    setEditingDept(null);
    toast.success("Department updated successfully");
  };

  const handleDeleteDepartment = (id: string) => {
    if (departments.length <= 1) {
      toast.error("Cannot delete the last department");
      return;
    }
    setDepartments(departments.filter(d => d.id !== id));
    if (selectedDepartment === id) {
      setSelectedDepartment(departments[0].id);
    }
    toast.success("Department deleted");
  };

  const handleAddSection = (deptId: string) => {
    if (!newSection.trim()) {
      toast.error("Please enter a section name");
      return;
    }
    setDepartments(departments.map(d => {
      if (d.id === deptId) {
        if (d.sections.includes(newSection.trim())) {
          toast.error("Section already exists");
          return d;
        }
        return { ...d, sections: [...d.sections, newSection.trim()] };
      }
      return d;
    }));
    setNewSection("");
    setAddingSectionTo(null);
    toast.success("Section added");
  };

  const handleDeleteSection = (deptId: string, section: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept && dept.sections.length <= 1) {
      toast.error("Cannot delete the last section");
      return;
    }
    setDepartments(departments.map(d => {
      if (d.id === deptId) {
        return { ...d, sections: d.sections.filter(s => s !== section) };
      }
      return d;
    }));
    toast.success("Section deleted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Departments & Sections</h2>
          <p className="text-sm text-muted-foreground">Manage academic hierarchy</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Department Name *</Label>
                <Input
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="Computer Science & Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label>Department Code *</Label>
                <Input
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                  placeholder="CSE"
                />
              </div>
              <div className="space-y-2">
                <Label>Sections (comma-separated)</Label>
                <Input
                  value={newDept.sections}
                  onChange={(e) => setNewDept({ ...newDept, sections: e.target.value })}
                  placeholder="A, B, C"
                />
              </div>
              <Button onClick={handleAddDepartment} className="w-full">
                Add Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, index) => (
          <div
            key={dept.id}
            className={cn(
              "bg-card rounded-xl border shadow-card p-5 animate-fade-in transition-all",
              selectedDepartment === dept.id
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl gradient-primary">
                  <Building className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{dept.code}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{dept.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingDept(dept)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-danger hover:bg-danger/10"
                  onClick={() => handleDeleteDepartment(dept.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users2 className="w-4 h-4" />
                <span>{dept.sections.length} Sections</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {dept.sections.map((section) => (
                  <Badge
                    key={section}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    Section {section}
                    <button
                      onClick={() => handleDeleteSection(dept.id, section)}
                      className="ml-1 hover:bg-danger/20 rounded-full p-0.5"
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-danger" />
                    </button>
                  </Badge>
                ))}
                {addingSectionTo === dept.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value.toUpperCase())}
                      className="h-6 w-12 px-2 text-xs"
                      placeholder="D"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSection(dept.id);
                        if (e.key === "Escape") setAddingSectionTo(null);
                      }}
                    />
                    <Button
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => handleAddSection(dept.id)}
                    >
                      Add
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs gap-1"
                    onClick={() => setAddingSectionTo(dept.id)}
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 gap-2"
              onClick={() => setSelectedDepartment(dept.id)}
            >
              View Department
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Department Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">All Departments</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Code</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell className="font-mono font-medium">{dept.code}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {dept.sections.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingDept(dept)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-danger hover:bg-danger/10"
                      onClick={() => handleDeleteDepartment(dept.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDept} onOpenChange={() => setEditingDept(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDept && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Department Name</Label>
                <Input
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Department Code</Label>
                <Input
                  value={editingDept.code}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value.toUpperCase() })}
                />
              </div>
              <Button onClick={handleEditDepartment} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
