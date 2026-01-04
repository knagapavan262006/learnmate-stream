import { useState } from "react";
import { classrooms as initialClassrooms, Classroom } from "@/data/mockData";
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
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Users, Monitor, Snowflake, Presentation } from "lucide-react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

const facilityIcons: Record<string, React.ReactNode> = {
  Projector: <Presentation className="w-3 h-3" />,
  AC: <Snowflake className="w-3 h-3" />,
  Computers: <Monitor className="w-3 h-3" />,
  "Smart Board": <Monitor className="w-3 h-3" />,
};

export function ClassroomsModule() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    capacity: "",
  });

  const filteredClassrooms = classrooms.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = classrooms.map((room) => ({
    name: room.name,
    used: room.currentUsage,
    available: 100 - room.currentUsage,
  }));

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.capacity) {
      toast.error("Please fill in all fields");
      return;
    }
    const room: Classroom = {
      id: `R${classrooms.length + 109}`,
      name: newRoom.name,
      capacity: parseInt(newRoom.capacity),
      currentUsage: 0,
      facilities: ["Projector", "AC"],
    };
    setClassrooms([...classrooms, room]);
    setNewRoom({ name: "", capacity: "" });
    setIsAddOpen(false);
    toast.success("Classroom added successfully");
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "bg-success";
    if (usage >= 50) return "bg-warning";
    return "bg-primary";
  };

  return (
    <div className="space-y-6">
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Classroom</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name *</Label>
                <Input
                  id="roomName"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="Room 301"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                  placeholder="50"
                />
              </div>
              <Button onClick={handleAddRoom} className="w-full">
                Add Classroom
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <div className="mb-5">
          <h3 className="font-semibold text-foreground">Classroom Utilization Overview</h3>
          <p className="text-sm text-muted-foreground">Used vs available capacity</p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === "used" ? "Used" : "Available",
                ]}
              />
              <Legend />
              <Bar dataKey="used" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} name="Used" />
              <Bar dataKey="available" stackId="a" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Room Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Current Usage</TableHead>
              <TableHead className="hidden md:table-cell">Facilities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClassrooms.map((room, index) => (
              <TableRow
                key={room.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {room.id}
                </TableCell>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{room.capacity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 max-w-48">
                    <Progress
                      value={room.currentUsage}
                      className={cn("h-2 flex-1", getUsageColor(room.currentUsage))}
                    />
                    <span className="text-sm font-medium w-12">{room.currentUsage}%</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {room.facilities.map((facility) => (
                      <Badge key={facility} variant="outline" className="gap-1 text-xs">
                        {facilityIcons[facility]}
                        {facility}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
