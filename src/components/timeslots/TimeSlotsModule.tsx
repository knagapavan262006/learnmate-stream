import { useState } from "react";
import { useTimeSlots, useAddTimeSlot, useUpdateTimeSlot } from "@/hooks/useDatabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Clock, Coffee, Loader2 } from "lucide-react";
import { toast } from "sonner";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimeSlotsModule() {
  const { data: timeSlots = [], isLoading } = useTimeSlots();
  const addTimeSlot = useAddTimeSlot();
  const updateTimeSlot = useUpdateTimeSlot();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

  const toggleSlotStatus = (id: string, currentStatus: boolean) => {
    updateTimeSlot.mutate(
      { id, is_active: !currentStatus },
      {
        onSuccess: () => toast.success("Time slot updated"),
        onError: () => toast.error("Failed to update time slot"),
      }
    );
  };

  const handleAddSlot = () => {
    if (!newSlot.name || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill in all fields");
      return;
    }
    addTimeSlot.mutate(
      {
        name: newSlot.name,
        start_time: newSlot.startTime,
        end_time: newSlot.endTime,
        is_active: true,
      },
      {
        onSuccess: () => {
          setNewSlot({ name: "", startTime: "", endTime: "" });
          setIsAddOpen(false);
          toast.success("Time slot added");
        },
        onError: () => toast.error("Failed to add time slot"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Slots Section */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Time Slots</h3>
              <p className="text-sm text-muted-foreground">Manage class periods</p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Time Slot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Slot Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Period 1"
                      value={newSlot.name}
                      onChange={(e) =>
                        setNewSlot({ ...newSlot, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) =>
                        setNewSlot({ ...newSlot, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) =>
                        setNewSlot({ ...newSlot, endTime: e.target.value })
                      }
                    />
                  </div>
                  <Button onClick={handleAddSlot} className="w-full" disabled={addTimeSlot.isPending}>
                    {addTimeSlot.isPending ? "Adding..." : "Add Time Slot"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Slot</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((slot, index) => {
                const startParts = slot.start_time.split(":");
                const endParts = slot.end_time.split(":");
                const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1] || "0");
                const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1] || "0");
                const durationMinutes = endMinutes - startMinutes;
                const hours = Math.floor(durationMinutes / 60);
                const minutes = durationMinutes % 60;
                const durationStr = hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}` : `${minutes}m`;
                const isBreak = slot.name.toLowerCase().includes("break") || slot.name.toLowerCase().includes("lunch");

                return (
                  <TableRow
                    key={slot.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isBreak ? (
                          <Coffee className="w-4 h-4 text-warning" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-medium text-sm">{slot.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{slot.start_time}</TableCell>
                    <TableCell className="font-medium">{slot.end_time}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{durationStr}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={slot.is_active ?? true}
                          onCheckedChange={() => toggleSlotStatus(slot.id, slot.is_active ?? true)}
                        />
                        <span
                          className={`text-xs ${
                            slot.is_active ? "text-success" : "text-muted-foreground"
                          }`}
                        >
                          {slot.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Days Section */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Working Days</h3>
            <p className="text-sm text-muted-foreground">Academic week schedule</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {days.map((day, index) => (
                <div
                  key={day}
                  className="p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="text-center">
                    <p className="font-medium text-foreground">{day}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {day === "Saturday" ? "Half Day" : "Full Day"}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2"
                    >
                      {day === "Saturday" ? "4 slots" : `${timeSlots.filter(s => s.is_active).length} slots`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <h4 className="font-medium text-foreground mb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Working Days</p>
                  <p className="text-xl font-bold text-foreground">{days.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Active Time Slots</p>
                  <p className="text-xl font-bold text-foreground">
                    {timeSlots.filter((s) => s.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
