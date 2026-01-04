import { useState, useMemo } from "react";
import {
  teachers,
  classrooms,
  timeSlots,
  days,
  subjects,
  TimetableEntry,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const classNames = ["CS-101", "EE-201", "ME-301", "CE-401"];

export function TimetableGenerator() {
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>(days.slice(0, 5));
  const [selectedClass, setSelectedClass] = useState<string>("CS-101");
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);

  const activeTimeSlots = timeSlots.filter((ts) => ts.isActive);

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleClassroom = (id: string) => {
    setSelectedClassrooms((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generateTimetable = () => {
    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher");
      return;
    }
    if (selectedClassrooms.length === 0) {
      toast.error("Please select at least one classroom");
      return;
    }
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    setIsGenerating(true);
    setConflicts([]);

    setTimeout(() => {
      const newTimetable: TimetableEntry[] = [];
      const usedSlots: Set<string> = new Set();
      const newConflicts: string[] = [];
      let entryId = 1;

      selectedDays.forEach((day) => {
        activeTimeSlots.forEach((slot) => {
          const timeSlotStr = `${slot.startTime}-${slot.endTime}`;

          // Randomly assign (for demo purposes)
          if (Math.random() > 0.4) {
            const availableTeachers = selectedTeachers.filter((tId) => {
              const teacher = teachers.find((t) => t.id === tId);
              const slotKey = `${tId}-${day}-${timeSlotStr}`;
              return (
                teacher?.availability.includes(day) && !usedSlots.has(slotKey)
              );
            });

            const availableClassrooms = selectedClassrooms.filter((cId) => {
              const slotKey = `${cId}-${day}-${timeSlotStr}`;
              return !usedSlots.has(slotKey);
            });

            if (availableTeachers.length > 0 && availableClassrooms.length > 0) {
              const teacherId =
                availableTeachers[
                  Math.floor(Math.random() * availableTeachers.length)
                ];
              const classroomId =
                availableClassrooms[
                  Math.floor(Math.random() * availableClassrooms.length)
                ];

              const teacher = teachers.find((t) => t.id === teacherId)!;
              const classroom = classrooms.find((c) => c.id === classroomId)!;

              usedSlots.add(`${teacherId}-${day}-${timeSlotStr}`);
              usedSlots.add(`${classroomId}-${day}-${timeSlotStr}`);

              newTimetable.push({
                id: `GEN${entryId++}`,
                day,
                timeSlot: timeSlotStr,
                subject: teacher.subject,
                teacherId,
                teacherName: teacher.name,
                classroomId,
                classroomName: classroom.name,
                className: selectedClass,
              });
            } else if (
              availableTeachers.length === 0 &&
              selectedTeachers.length > 0
            ) {
              newConflicts.push(
                `No available teachers for ${day} ${timeSlotStr}`
              );
            }
          }
        });
      });

      setTimetable(newTimetable);
      setConflicts(newConflicts);
      setIsGenerating(false);
      toast.success(`Generated ${newTimetable.length} classes!`);
    }, 1500);
  };

  const timetableGrid = useMemo(() => {
    const grid: Record<string, Record<string, TimetableEntry | null>> = {};
    selectedDays.forEach((day) => {
      grid[day] = {};
      activeTimeSlots.forEach((slot) => {
        const timeSlotStr = `${slot.startTime}-${slot.endTime}`;
        grid[day][timeSlotStr] =
          timetable.find(
            (entry) => entry.day === day && entry.timeSlot === timeSlotStr
          ) || null;
      });
    });
    return grid;
  }, [timetable, selectedDays, activeTimeSlots]);

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Select Teachers
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                  selectedTeachers.includes(teacher.id)
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-secondary"
                )}
                onClick={() => toggleTeacher(teacher.id)}
              >
                <Checkbox
                  checked={selectedTeachers.includes(teacher.id)}
                  onCheckedChange={() => toggleTeacher(teacher.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classrooms Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            Select Classrooms
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {classrooms.map((classroom) => (
              <div
                key={classroom.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                  selectedClassrooms.includes(classroom.id)
                    ? "bg-accent/10 border border-accent/30"
                    : "hover:bg-secondary"
                )}
                onClick={() => toggleClassroom(classroom.id)}
              >
                <Checkbox
                  checked={selectedClassrooms.includes(classroom.id)}
                  onCheckedChange={() => toggleClassroom(classroom.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{classroom.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Capacity: {classroom.capacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Days & Class Selection */}
        <div className="bg-card rounded-xl border border-border shadow-card p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-success" />
            Days & Class
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                Working Days
              </Label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Badge
                    key={day}
                    variant={selectedDays.includes(day) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDay(day)}
                  >
                    {day.slice(0, 3)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={generateTimetable}
          disabled={isGenerating}
          className="gap-2"
          size="lg"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isGenerating ? "Generating..." : "Generate Smart Timetable"}
        </Button>
        {timetable.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="w-4 h-4" />
            {timetable.length} classes scheduled
          </div>
        )}
      </div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Scheduling Conflicts</span>
          </div>
          <ul className="text-sm text-warning/80 space-y-1">
            {conflicts.slice(0, 3).map((conflict, i) => (
              <li key={i}>• {conflict}</li>
            ))}
            {conflicts.length > 3 && (
              <li>• And {conflicts.length - 3} more...</li>
            )}
          </ul>
        </div>
      )}

      {/* Timetable Grid */}
      {timetable.length > 0 && (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Generated Timetable - {selectedClass}
            </h3>
            <p className="text-sm text-muted-foreground">
              Week schedule with {timetable.length} classes
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="p-3 text-left font-medium">Time</th>
                  {selectedDays.map((day) => (
                    <th key={day} className="p-3 text-left font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTimeSlots.map((slot) => {
                  const timeSlotStr = `${slot.startTime}-${slot.endTime}`;
                  return (
                    <tr key={slot.id} className="border-t border-border">
                      <td className="p-3 font-mono text-sm text-muted-foreground whitespace-nowrap">
                        {timeSlotStr}
                      </td>
                      {selectedDays.map((day) => {
                        const entry = timetableGrid[day]?.[timeSlotStr];
                        return (
                          <td key={`${day}-${slot.id}`} className="p-2">
                            {entry ? (
                              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 min-w-32">
                                <p className="font-medium text-sm text-foreground">
                                  {entry.subject}
                                </p>
                                <p className="text-xs text-primary mt-1">
                                  {entry.teacherName.split(" ").slice(-1)[0]}
                                </p>
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  {entry.classroomName}
                                </Badge>
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg bg-secondary/30 border border-dashed border-border min-w-32 h-20" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
