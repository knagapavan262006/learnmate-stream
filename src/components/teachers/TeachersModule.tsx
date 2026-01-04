import { useState } from "react";
import { teachers as initialTeachers, Teacher } from "@/data/mockData";
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
import { Plus, Trash2, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";

export function TeachersModule() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    subject: "",
    email: "",
    phone: "",
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.subject) {
      toast.error("Please fill in required fields");
      return;
    }
    const teacher: Teacher = {
      id: `T${String(teachers.length + 1).padStart(3, "0")}`,
      name: newTeacher.name,
      subject: newTeacher.subject,
      email: newTeacher.email || `${newTeacher.name.toLowerCase().replace(" ", ".")}@college.edu`,
      phone: newTeacher.phone || "+1-234-567-0000",
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      assignedClasses: 0,
    };
    setTeachers([...teachers, teacher]);
    setNewTeacher({ name: "", subject: "", email: "", phone: "" });
    setIsAddOpen(false);
    toast.success("Teacher added successfully");
  };

  const handleRemoveTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id));
    toast.success("Teacher removed");
  };

  return (
    <div className="space-y-6">
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
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={newTeacher.subject}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, subject: e.target.value })
                  }
                  placeholder="Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, email: e.target.value })
                  }
                  placeholder="john.smith@college.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newTeacher.phone}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, phone: e.target.value })
                  }
                  placeholder="+1-234-567-8900"
                />
              </div>
              <Button onClick={handleAddTeacher} className="w-full">
                Add Teacher
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
              <TableHead>Subject</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-center">Classes</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher, index) => (
              <TableRow
                key={teacher.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {teacher.id}
                </TableCell>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{teacher.subject}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {teacher.email}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {teacher.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.availability.slice(0, 3).map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day.slice(0, 3)}
                      </Badge>
                    ))}
                    {teacher.availability.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{teacher.availability.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                    {teacher.assignedClasses}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTeacher(teacher.id)}
                    className="text-danger hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
