import { useState } from "react";
import { timeSlots as initialTimeSlots, days, TimeSlot } from "@/data/mockData";
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
import { Plus, Clock, Coffee } from "lucide-react";
import { toast } from "sonner";

export function TimeSlotsModule() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialTimeSlots);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
  });

  const toggleSlotStatus = (id: string) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
      )
    );
    toast.success("Time slot updated");
  };

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill in all fields");
      return;
    }
    const slot: TimeSlot = {
      id: `TS${timeSlots.length + 1}`,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isActive: true,
    };
    setTimeSlots([...timeSlots, slot]);
    setNewSlot({ startTime: "", endTime: "" });
    setIsAddOpen(false);
    toast.success("Time slot added");
  };

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
                  <Button onClick={handleAddSlot} className="w-full">
                    Add Time Slot
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
                const start = parseInt(slot.startTime.split(":")[0]);
                const end = parseInt(slot.endTime.split(":")[0]);
                const duration = end - start;
                const isBreak = slot.startTime === "12:00";

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
                        <span className="font-mono text-sm">{slot.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{slot.startTime}</TableCell>
                    <TableCell className="font-medium">{slot.endTime}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{duration}h</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={slot.isActive}
                          onCheckedChange={() => toggleSlotStatus(slot.id)}
                        />
                        <span
                          className={`text-xs ${
                            slot.isActive ? "text-success" : "text-muted-foreground"
                          }`}
                        >
                          {slot.isActive ? "Active" : "Inactive"}
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
                      {day === "Saturday" ? "4 slots" : "7 slots"}
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
                    {timeSlots.filter((s) => s.isActive).length}
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
