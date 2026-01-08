import { Users, GraduationCap, Building2, Calendar, AlertTriangle, Bell } from "lucide-react";
import { StatCard } from "./StatCard";
import { UtilizationChart } from "./UtilizationChart";
import { TodaySchedule } from "./TodaySchedule";
import { AlertsPanel } from "./AlertsPanel";
import { NotificationLog } from "@/components/notifications/NotificationLog";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useTeachers, useStudents, useClassrooms, useTimetableEntries } from "@/hooks/useDatabase";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const { selectedDepartmentId, selectedSectionId, getCurrentDepartment, selectedAcademicDay } = useDepartment();
  const currentDept = getCurrentDepartment();

  const { data: teachers = [], isLoading: teachersLoading } = useTeachers(selectedDepartmentId);
  const { data: students = [], isLoading: studentsLoading } = useStudents(selectedDepartmentId, selectedSectionId);
  const { data: classrooms = [], isLoading: classroomsLoading } = useClassrooms(selectedDepartmentId);
  const { data: timetableEntries = [] } = useTimetableEntries(selectedDepartmentId, selectedSectionId);

  const absentTeachers = teachers.filter(t => t.is_absent);
  const todayClasses = timetableEntries.filter(entry => entry.day === selectedAcademicDay).length;

  const isLoading = teachersLoading || studentsLoading || classroomsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name || "Department"} - Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Department-wise overview and real-time analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Dept Teachers"
          value={teachers.length}
          subtitle="Faculty in department"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Section Students"
          value={students.length}
          subtitle="Enrolled in section"
          icon={GraduationCap}
          variant="accent"
        />
        <StatCard
          title="Classrooms"
          value={classrooms.length}
          subtitle="Department rooms"
          icon={Building2}
          variant="success"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses}
          subtitle={selectedAcademicDay}
          icon={Calendar}
          variant="warning"
        />
        <StatCard
          title="Absent Teachers"
          value={absentTeachers.length}
          subtitle="Need substitution"
          icon={AlertTriangle}
          variant={absentTeachers.length > 0 ? "warning" : "success"}
        />
      </div>

      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UtilizationChart />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      {/* Notification Log */}
      <NotificationLog />

      {/* Today's Schedule */}
      <TodaySchedule />
    </div>
  );
}
