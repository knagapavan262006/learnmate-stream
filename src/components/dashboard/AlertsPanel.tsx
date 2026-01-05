import { useDepartment } from "@/contexts/DepartmentContext";
import { useTeachers, useNotifications, useTeacherAbsences } from "@/hooks/useDatabase";
import { AlertTriangle, Bell, CheckCircle, Clock, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export function AlertsPanel() {
  const { selectedDepartmentId, getCurrentDepartment } = useDepartment();
  const currentDept = getCurrentDepartment();
  
  const { data: teachers = [] } = useTeachers(selectedDepartmentId);
  const { data: notifications = [], isLoading: notifLoading } = useNotifications(selectedDepartmentId);
  const { data: absences = [] } = useTeacherAbsences(selectedDepartmentId);

  const absentTeachers = teachers.filter(t => t.is_absent);
  const recentNotifications = notifications.slice(0, 5);
  const unhandledAbsences = absences.filter(a => !a.is_handled);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="w-3 h-3" />;
      case "whatsapp": return <MessageSquare className="w-3 h-3" />;
      case "app": return <Smartphone className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  if (notifLoading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden h-full">
        <div className="p-5 border-b border-border">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden h-full">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Alerts & Notifications
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{currentDept?.code} Department</p>
        </div>
        {(absentTeachers.length > 0 || unhandledAbsences.length > 0) && (
          <Badge variant="destructive" className="animate-pulse">
            {absentTeachers.length + unhandledAbsences.length} Active
          </Badge>
        )}
      </div>
      
      <ScrollArea className="h-[350px]">
        <div className="p-4 space-y-3">
          {/* Absent Teacher Alerts */}
          {absentTeachers.map(teacher => (
            <div 
              key={teacher.id} 
              className="p-3 rounded-lg bg-danger/10 border border-danger/30"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-danger">Teacher Absent</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {teacher.name} ({teacher.subject}) is marked absent
                  </p>
                  <p className="text-xs text-danger/70 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Needs substitution
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Unhandled Absences */}
          {unhandledAbsences.map(absence => {
            const teacher = teachers.find(t => t.id === absence.teacher_id);
            return (
              <div 
                key={absence.id} 
                className="p-3 rounded-lg bg-warning/10 border border-warning/30"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warning">Pending Substitution</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {teacher?.name || "Unknown"} - {absence.absent_date}
                    </p>
                    {absence.reason && (
                      <p className="text-xs text-muted-foreground">Reason: {absence.reason}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Recent Notifications */}
          {recentNotifications.map(notification => (
            <div 
              key={notification.id} 
              className="p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="flex items-start gap-2">
                <div className={`p-1.5 rounded ${
                  notification.status === "sent" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {notification.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {notification.status === "sent" && (
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                )}
              </div>
            </div>
          ))}

          {absentTeachers.length === 0 && recentNotifications.length === 0 && unhandledAbsences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No alerts or notifications</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
