import { useDepartment } from "@/contexts/DepartmentContext";
import { useTimetableEntries, useTeachers, useClassrooms } from "@/hooks/useDatabase";
import { Clock, MapPin, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function TodaySchedule() {
  const { selectedDepartmentId, selectedSectionId, selectedAcademicDay, getSectionsForDepartment } = useDepartment();
  const { data: timetableEntries = [], isLoading: entriesLoading } = useTimetableEntries(selectedDepartmentId, selectedSectionId);
  const { data: teachers = [] } = useTeachers(selectedDepartmentId);
  const { data: classrooms = [] } = useClassrooms(selectedDepartmentId);
  
  const sections = getSectionsForDepartment(selectedDepartmentId);
  const currentSection = sections.find(s => s.id === selectedSectionId);
  
  const todayClasses = timetableEntries.filter(entry => entry.day === selectedAcademicDay);

  const getTeacherName = (teacherId: string | null) => {
    if (!teacherId) return "TBA";
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.name || "Unknown";
  };

  const getClassroomName = (classroomId: string | null) => {
    if (!classroomId) return "TBA";
    const classroom = classrooms.find(c => c.id === classroomId);
    return classroom?.name || "Unknown";
  };

  if (entriesLoading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32 mt-1" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4">
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Today's Schedule</h3>
        <p className="text-sm text-muted-foreground">{selectedAcademicDay} - Section {currentSection?.name}</p>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {todayClasses.length > 0 ? (
          todayClasses.map((entry, index) => (
            <div
              key={entry.id}
              className="p-4 hover:bg-secondary/50 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  entry.is_substituted 
                    ? "bg-warning/20 border border-warning/40" 
                    : "gradient-primary"
                }`}>
                  <span className={`text-xs font-bold ${entry.is_substituted ? "text-warning" : "text-primary-foreground"}`}>
                    {entry.time_slot.split("-")[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{entry.subject}</p>
                    {entry.is_substituted && (
                      <Badge variant="outline" className="text-warning border-warning/50 text-xs">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Substituted
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {getTeacherName(entry.teacher_id)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {getClassroomName(entry.classroom_id)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.time_slot}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No classes scheduled for {selectedAcademicDay}
          </div>
        )}
      </div>
    </div>
  );
}
