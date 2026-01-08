import { useNotifications } from "@/hooks/useDatabase";
import { useDepartment } from "@/contexts/DepartmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, UserX, Calendar, RefreshCw, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const getNotificationIcon = (title: string) => {
  if (title.toLowerCase().includes("absent")) return <UserX className="w-4 h-4 text-warning" />;
  if (title.toLowerCase().includes("timetable")) return <Calendar className="w-4 h-4 text-primary" />;
  if (title.toLowerCase().includes("substitut")) return <RefreshCw className="w-4 h-4 text-accent" />;
  if (title.toLowerCase().includes("available") || title.toLowerCase().includes("present")) return <CheckCircle className="w-4 h-4 text-success" />;
  return <Bell className="w-4 h-4 text-muted-foreground" />;
};

const getEventType = (title: string): string => {
  if (title.toLowerCase().includes("absent")) return "Teacher Absence";
  if (title.toLowerCase().includes("generated")) return "Timetable Generated";
  if (title.toLowerCase().includes("updated") || title.toLowerCase().includes("substitut")) return "Timetable Updated";
  if (title.toLowerCase().includes("available") || title.toLowerCase().includes("present")) return "Teacher Present";
  return "Notification";
};

export function NotificationLog() {
  const { selectedDepartmentId } = useDepartment();
  const { data: notifications = [], isLoading } = useNotifications(selectedDepartmentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notification Log
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Automatic notifications triggered by system events
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-72">
          <div className="divide-y divide-border">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {getEventType(notification.title)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {notification.recipient_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={notification.status === "sent" ? "default" : "destructive"}
                      className="text-xs shrink-0"
                    >
                      {notification.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-xs mt-1">
                  Notifications will appear here when triggered by system events
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
