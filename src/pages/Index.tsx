import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TeachersModule } from "@/components/teachers/TeachersModule";
import { StudentsModule } from "@/components/students/StudentsModule";
import { ClassroomsModule } from "@/components/classrooms/ClassroomsModule";
import { TimeSlotsModule } from "@/components/timeslots/TimeSlotsModule";
import { TimetableGenerator } from "@/components/timetable/TimetableGenerator";
import { AttendanceModule } from "@/components/attendance/AttendanceModule";

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of your smart classroom" },
  teachers: { title: "Teachers", subtitle: "Manage faculty and assignments" },
  students: { title: "Students", subtitle: "Student records and attendance" },
  classrooms: { title: "Classrooms", subtitle: "Room management and utilization" },
  timeslots: { title: "Time Slots", subtitle: "Configure class periods and days" },
  timetable: { title: "Timetable Generator", subtitle: "AI-powered smart scheduling" },
  attendance: { title: "Attendance Analytics", subtitle: "Track and analyze attendance" },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "teachers":
        return <TeachersModule />;
      case "students":
        return <StudentsModule />;
      case "classrooms":
        return <ClassroomsModule />;
      case "timeslots":
        return <TimeSlotsModule />;
      case "timetable":
        return <TimetableGenerator />;
      case "attendance":
        return <AttendanceModule />;
      default:
        return <Dashboard />;
    }
  };

  const { title, subtitle } = pageConfig[activeTab] || pageConfig.dashboard;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
