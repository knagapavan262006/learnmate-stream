import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DepartmentSelector } from "@/components/layout/DepartmentSelector";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { TeachersModule } from "@/components/teachers/TeachersModule";
import { StudentsModule } from "@/components/students/StudentsModule";
import { ClassroomsModule } from "@/components/classrooms/ClassroomsModule";
import { TimeSlotsModule } from "@/components/timeslots/TimeSlotsModule";
import { TimetableGenerator } from "@/components/timetable/TimetableGenerator";
import { AttendanceModule } from "@/components/attendance/AttendanceModule";
import { DepartmentsModule } from "@/components/departments/DepartmentsModule";
import { DemoModule } from "@/components/demo/DemoModule";
import { RoleManagementModule } from "@/components/admin/RoleManagementModule";
import { ExamSeatingModule } from "@/components/examseating/ExamSeatingModule";

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Department-wise overview" },
  departments: { title: "Departments", subtitle: "Manage departments & sections" },
  teachers: { title: "Teachers", subtitle: "Department faculty management" },
  students: { title: "Students", subtitle: "Section-wise student records" },
  classrooms: { title: "Classrooms", subtitle: "Department room management" },
  timeslots: { title: "Time Slots", subtitle: "Configure class periods" },
  timetable: { title: "Timetable Generator", subtitle: "AI-powered smart scheduling" },
  attendance: { title: "Attendance Analytics", subtitle: "Section-wise attendance tracking" },
  examseating: { title: "Exam Seating Plan", subtitle: "Generate mixed-branch seating arrangements" },
  roles: { title: "Role Management", subtitle: "Manage user roles and permissions" },
  demo: { title: "Demo & Help", subtitle: "System guide for presentations" },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "departments": return <DepartmentsModule />;
      case "teachers": return <TeachersModule />;
      case "students": return <StudentsModule />;
      case "classrooms": return <ClassroomsModule />;
      case "timeslots": return <TimeSlotsModule />;
      case "timetable": return <TimetableGenerator />;
      case "attendance": return <AttendanceModule />;
      case "examseating": return <ExamSeatingModule />;
      case "roles": return <RoleManagementModule />;
      case "demo": return <DemoModule />;
      default: return <Dashboard />;
    }
  };

  const { title, subtitle } = pageConfig[activeTab] || pageConfig.dashboard;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <div className="px-6 pt-4">
          <DepartmentSelector />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
