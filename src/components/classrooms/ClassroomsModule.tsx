import { useState } from "react";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useClassrooms, useAddClassroom, useUpdateClassroom, useDeleteClassroom, DbClassroom } from "@/hooks/useDatabase";
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Monitor, Snowflake, Presentation, Plus, Edit2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const facilityOptions = ["Projector", "AC", "Smart Board", "Computers", "Whiteboard", "Audio System"];

const facilityIcons: Record<string, React.ReactNode> = {
  Projector: <Presentation className="w-3 h-3" />,
  AC: <Snowflake className="w-3 h-3" />,
  Computers: <Monitor className="w-3 h-3" />,
  "Smart Board": <Monitor className="w-3 h-3" />,
};

const roomTypes = ["Classroom", "Seminar Hall", "Lab", "Lecture Hall"];

export function ClassroomsModule() {
  const { selectedDepartmentId, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();

  const { data: classrooms = [], isLoading } = useClassrooms(selectedDepartmentId);
  const addClassroom = useAddClassroom();
  const updateClassroom = useUpdateClassroom();
  const deleteClassroom = useDeleteClassroom();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<DbClassroom | null>(null);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    capacity: 60,
    type: "Classroom",
    facilities: ["Projector", "AC"] as string[],
  });

  const filteredClassrooms = classrooms.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = filteredClassrooms.map((room) => ({
    name: room.name.substring(0, 12),
    used: room.usage_percentage || 0,
    available: 100 - (room.usage_percentage || 0),
  }));

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "bg-success";
    if (usage >= 50) return "bg-warning";
    return "bg-primary";
  };

  const handleAddClassroom = async () => {
    if (!newClassroom.name) return;
    await addClassroom.mutateAsync({
      department_id: selectedDepartmentId,
      name: `${newClassroom.name} (${newClassroom.type})`,
      capacity: newClassroom.capacity,
      facilities: newClassroom.facilities,
      usage_percentage: 0,
    });
    setNewClassroom({ name: "", capacity: 60, type: "Classroom", facilities: ["Projector", "AC"] });
    setIsAddOpen(false);
  };

  const handleEditClassroom = async () => {
    if (!editingClassroom) return;
    await updateClassroom.mutateAsync({
      id: editingClassroom.id,
      name: editingClassroom.name,
      capacity: editingClassroom.capacity,
      facilities: editingClassroom.facilities,
    });
    setEditingClassroom(null);
  };

  const toggleFacility = (facility: string, isEdit = false) => {
    if (isEdit && editingClassroom) {
      const current = editingClassroom.facilities || [];
      const updated = current.includes(facility)
        ? current.filter(f => f !== facility)
        : [...current, facility];
      setEditingClassroom({ ...editingClassroom, facilities: updated });
    } else {
      const updated = newClassroom.facilities.includes(facility)
        ? newClassroom.facilities.filter(f => f !== facility)
        : [...newClassroom.facilities, facility];
      setNewClassroom({ ...newClassroom, facilities: updated });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name} - Classrooms
        </h2>
        <p className="text-sm text-muted-foreground">
          {filteredClassrooms.length} classrooms in department
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search classrooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Classroom</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Classroom Name *</Label>
                <Input
                  value={newClassroom.name}
                  onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                  placeholder="Room 101"
                />
              </div>
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select
                  value={newClassroom.type}
                  onValueChange={(v) => setNewClassroom({ ...newClassroom, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={newClassroom.capacity}
                  onChange={(e) => setNewClassroom({ ...newClassroom, capacity: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={500}
                />
              </div>
              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {facilityOptions.map(facility => (
                    <label key={facility} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={newClassroom.facilities.includes(facility)}
                        onCheckedChange={() => toggleFacility(facility)}
                      />
                      {facility}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleAddClassroom}
                className="w-full"
                disabled={addClassroom.isPending}
              >
                {addClassroom.isPending ? "Adding..." : "Add Classroom"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Utilization Chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Classroom Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Legend />
                <Bar dataKey="used" stackId="a" fill="hsl(var(--primary))" name="Used %" />
                <Bar dataKey="available" stackId="a" fill="hsl(var(--secondary))" name="Available %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Facilities</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClassrooms.length > 0 ? (
              filteredClassrooms.map((room, index) => {
                const usage = room.usage_percentage || 0;
                return (
                  <TableRow
                    key={room.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{room.capacity} seats</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-32">
                        <Progress 
                          value={usage} 
                          className={`h-2 flex-1 ${getUsageColor(usage)}`}
                        />
                        <span className="text-sm font-medium">{usage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(room.facilities || []).map((facility) => (
                          <Badge key={facility} variant="outline" className="text-xs gap-1">
                            {facilityIcons[facility]}
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingClassroom(room)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteClassroom.mutate(room.id)}
                          className="text-destructive hover:bg-destructive/10"
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
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No classrooms found in this department
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingClassroom} onOpenChange={() => setEditingClassroom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
          </DialogHeader>
          {editingClassroom && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Classroom Name</Label>
                <Input
                  value={editingClassroom.name}
                  onChange={(e) => setEditingClassroom({ ...editingClassroom, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={editingClassroom.capacity}
                  onChange={(e) => setEditingClassroom({ ...editingClassroom, capacity: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={500}
                />
              </div>
              <div className="space-y-2">
                <Label>Facilities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {facilityOptions.map(facility => (
                    <label key={facility} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={(editingClassroom.facilities || []).includes(facility)}
                        onCheckedChange={() => toggleFacility(facility, true)}
                      />
                      {facility}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleEditClassroom}
                className="w-full"
                disabled={updateClassroom.isPending}
              >
                {updateClassroom.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}