import { timetableData } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";
import { Clock, MapPin, User } from "lucide-react";

export function TodaySchedule() {
  const { selectedDepartment, selectedSection } = useDepartment();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  
  const todayClasses = timetableData.filter(
    (entry) => 
      (entry.day === today || entry.day === "Monday") && 
      entry.departmentId === selectedDepartment && 
      entry.section === selectedSection
  );

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Today's Schedule</h3>
        <p className="text-sm text-muted-foreground">{today} - Section {selectedSection}</p>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {todayClasses.length > 0 ? (
          todayClasses.slice(0, 5).map((entry, index) => (
            <div
              key={entry.id}
              className="p-4 hover:bg-secondary/50 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">
                    {entry.timeSlot.split("-")[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{entry.subject}</p>
                  <p className="text-sm text-primary font-medium">Section {entry.section}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {entry.teacherName.split(" ").slice(-1)[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {entry.classroomName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.timeSlot}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No classes scheduled for this section today
          </div>
        )}
      </div>
    </div>
  );
}
