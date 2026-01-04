import { Users, GraduationCap, Building2, Calendar } from "lucide-react";
import { StatCard } from "./StatCard";
import { UtilizationChart } from "./UtilizationChart";
import { TodaySchedule } from "./TodaySchedule";
import { teachers, students, classrooms, timetableData } from "@/data/mockData";
import { useDepartment } from "@/contexts/DepartmentContext";

export function Dashboard() {
  const { selectedDepartment, selectedSection, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();

  const deptTeachers = teachers.filter(t => t.departmentId === selectedDepartment);
  const deptStudents = students.filter(s => s.departmentId === selectedDepartment);
  const sectionStudents = deptStudents.filter(s => s.section === selectedSection);
  const deptClassrooms = classrooms.filter(c => c.departmentId === selectedDepartment);

  const todayClasses = timetableData.filter(
    (entry) => entry.day === "Monday" && entry.departmentId === selectedDepartment && entry.section === selectedSection
  ).length;

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDept?.name || "Department"} - Section {selectedSection}
        </h2>
        <p className="text-sm text-muted-foreground">
          Department-wise overview and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dept Teachers"
          value={deptTeachers.length}
          subtitle="Faculty in department"
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Section Students"
          value={sectionStudents.length}
          subtitle={`${deptStudents.length} in department`}
          icon={GraduationCap}
          variant="accent"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Classrooms"
          value={deptClassrooms.length}
          subtitle="Department rooms"
          icon={Building2}
          variant="success"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses}
          subtitle="Scheduled for section"
          icon={Calendar}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UtilizationChart />
        </div>
        <div className="lg:col-span-1">
          <TodaySchedule />
        </div>
      </div>
    </div>
  );
}
