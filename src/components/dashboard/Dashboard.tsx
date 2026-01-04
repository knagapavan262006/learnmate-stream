import { Users, GraduationCap, Building2, Calendar } from "lucide-react";
import { StatCard } from "./StatCard";
import { UtilizationChart } from "./UtilizationChart";
import { TodaySchedule } from "./TodaySchedule";
import { teachers, students, classrooms, timetableData } from "@/data/mockData";

export function Dashboard() {
  const todayClasses = timetableData.filter(
    (entry) => entry.day === "Monday"
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          subtitle="Active faculty members"
          icon={Users}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle="Enrolled students"
          icon={GraduationCap}
          variant="accent"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Classrooms"
          value={classrooms.length}
          subtitle="Available rooms"
          icon={Building2}
          variant="success"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses}
          subtitle="Scheduled for today"
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
