import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Clock,
  Calendar,
  BarChart3,
  Sparkles,
  Menu,
  X,
  HelpCircle,
  Layers,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

type AppRole = "admin" | "teacher" | "student";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: AppRole[];
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "teacher", "student"] },
  { id: "departments", label: "Departments", icon: Layers, roles: ["admin"] },
  { id: "teachers", label: "Teachers", icon: Users, roles: ["admin"] },
  { id: "students", label: "Students", icon: GraduationCap, roles: ["admin", "teacher"] },
  { id: "classrooms", label: "Classrooms", icon: Building2, roles: ["admin"] },
  { id: "timeslots", label: "Time Slots", icon: Clock, roles: ["admin"] },
  { id: "timetable", label: "Timetable", icon: Calendar, roles: ["admin", "teacher", "student"] },
  { id: "attendance", label: "Attendance", icon: BarChart3, roles: ["admin", "teacher", "student"] },
  { id: "examseating", label: "Exam Seating", icon: FileSpreadsheet, roles: ["admin"] },
  { id: "roles", label: "Role Management", icon: Shield, roles: ["admin"] },
  { id: "demo", label: "Demo & Help", icon: HelpCircle, roles: ["admin", "teacher", "student"] },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userRole } = useAuth();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!userRole) return item.roles.includes("student"); // Default to student access
    return item.roles.includes(userRole);
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-md border border-border"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">SmartClass</h1>
              <p className="text-xs text-muted-foreground">AI Classroom Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "nav-item w-full",
                activeTab === item.id && "nav-item-active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI Features</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Smart scheduling & conflict detection enabled
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
