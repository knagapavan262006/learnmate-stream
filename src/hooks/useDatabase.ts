import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types based on database schema
export interface DbDepartment {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface DbSection {
  id: string;
  department_id: string;
  name: string;
  created_at: string;
}

export interface DbTeacher {
  id: string;
  department_id: string;
  name: string;
  subject: string;
  email: string | null;
  availability: string[] | null;
  is_absent: boolean | null;
  absent_date: string | null;
  created_at: string;
}

export interface DbStudent {
  id: string;
  department_id: string;
  section_id: string;
  name: string;
  roll_number: string;
  email: string | null;
  attendance_percentage: number | null;
  created_at: string;
}

export interface DbClassroom {
  id: string;
  department_id: string;
  name: string;
  capacity: number;
  facilities: string[] | null;
  usage_percentage: number | null;
  created_at: string;
}

export interface DbTimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  is_active: boolean | null;
  created_at: string;
}

export interface DbTimetableEntry {
  id: string;
  department_id: string;
  section_id: string;
  teacher_id: string | null;
  classroom_id: string | null;
  subject: string;
  day: string;
  time_slot: string;
  is_substituted: boolean | null;
  original_teacher_id: string | null;
  created_at: string;
}

export interface DbNotification {
  id: string;
  department_id: string;
  section_id: string | null;
  type: "email" | "whatsapp" | "app" | "sms";
  title: string;
  message: string;
  recipient_type: "students" | "teachers" | "all";
  status: "pending" | "sent" | "failed";
  created_at: string;
}

export interface DbTeacherAbsence {
  id: string;
  teacher_id: string;
  department_id: string;
  absent_date: string;
  substitute_teacher_id: string | null;
  reason: string | null;
  is_handled: boolean | null;
  created_at: string;
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("code");
      if (error) throw error;
      return data as DbDepartment[];
    },
  });
}

// Sections
export function useSections(departmentId?: string) {
  return useQuery({
    queryKey: ["sections", departmentId],
    queryFn: async () => {
      let query = supabase.from("sections").select("*").order("name");
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbSection[];
    },
    enabled: !!departmentId || departmentId === undefined,
  });
}

// Teachers
export function useTeachers(departmentId?: string) {
  return useQuery({
    queryKey: ["teachers", departmentId],
    queryFn: async () => {
      let query = supabase.from("teachers").select("*").order("name");
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbTeacher[];
    },
  });
}

export function useAddTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teacher: Omit<DbTeacher, "id" | "created_at">) => {
      const { data, error } = await supabase.from("teachers").insert(teacher).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add teacher: " + error.message);
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...teacher }: Partial<DbTeacher> & { id: string }) => {
      const { data, error } = await supabase.from("teachers").update(teacher).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update teacher: " + error.message);
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher removed");
    },
    onError: (error) => {
      toast.error("Failed to remove teacher: " + error.message);
    },
  });
}

// Students
export function useStudents(departmentId?: string, sectionId?: string) {
  return useQuery({
    queryKey: ["students", departmentId, sectionId],
    queryFn: async () => {
      let query = supabase.from("students").select("*").order("roll_number");
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      if (sectionId) {
        query = query.eq("section_id", sectionId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbStudent[];
    },
  });
}

export function useAddStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student: Omit<DbStudent, "id" | "created_at">) => {
      const { data, error } = await supabase.from("students").insert(student).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add student: " + error.message);
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...student }: Partial<DbStudent> & { id: string }) => {
      const { data, error } = await supabase.from("students").update(student).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update student: " + error.message);
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student removed");
    },
    onError: (error) => {
      toast.error("Failed to remove student: " + error.message);
    },
  });
}

// Classrooms
export function useClassrooms(departmentId?: string) {
  return useQuery({
    queryKey: ["classrooms", departmentId],
    queryFn: async () => {
      let query = supabase.from("classrooms").select("*").order("name");
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbClassroom[];
    },
  });
}

// Time Slots
export function useTimeSlots() {
  return useQuery({
    queryKey: ["time_slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .order("start_time");
      if (error) throw error;
      return data as DbTimeSlot[];
    },
  });
}

// Timetable Entries
export function useTimetableEntries(departmentId?: string, sectionId?: string) {
  return useQuery({
    queryKey: ["timetable_entries", departmentId, sectionId],
    queryFn: async () => {
      let query = supabase.from("timetable_entries").select("*");
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      if (sectionId) {
        query = query.eq("section_id", sectionId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbTimetableEntry[];
    },
  });
}

export function useSaveTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      entries,
      departmentId,
      sectionId,
    }: {
      entries: Omit<DbTimetableEntry, "id" | "created_at">[];
      departmentId: string;
      sectionId: string;
    }) => {
      // Delete existing entries for this department/section
      await supabase
        .from("timetable_entries")
        .delete()
        .eq("department_id", departmentId)
        .eq("section_id", sectionId);
      
      // Insert new entries
      if (entries.length > 0) {
        const { error } = await supabase.from("timetable_entries").insert(entries);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable_entries"] });
      toast.success("Timetable saved to database");
    },
    onError: (error) => {
      toast.error("Failed to save timetable: " + error.message);
    },
  });
}

// Notifications
export function useNotifications(departmentId?: string) {
  return useQuery({
    queryKey: ["notifications", departmentId],
    queryFn: async () => {
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbNotification[];
    },
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notification: Omit<DbNotification, "id" | "created_at" | "status">) => {
      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase
        .from("notifications")
        .insert({ ...notification, status: "sent" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(`${data.type.toUpperCase()} notification sent to ${data.recipient_type}`);
    },
    onError: (error) => {
      toast.error("Failed to send notification: " + error.message);
    },
  });
}

// Teacher Absences
export function useTeacherAbsences(departmentId?: string) {
  return useQuery({
    queryKey: ["teacher_absences", departmentId],
    queryFn: async () => {
      let query = supabase
        .from("teacher_absences")
        .select("*")
        .order("absent_date", { ascending: false });
      if (departmentId) {
        query = query.eq("department_id", departmentId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as DbTeacherAbsence[];
    },
  });
}

export function useMarkTeacherAbsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      teacherId,
      departmentId,
      reason,
      substituteTeacherId,
    }: {
      teacherId: string;
      departmentId: string;
      reason?: string;
      substituteTeacherId?: string;
    }) => {
      const today = new Date().toISOString().split("T")[0];
      
      // Mark teacher as absent
      await supabase
        .from("teachers")
        .update({ is_absent: true, absent_date: today })
        .eq("id", teacherId);
      
      // Create absence record
      const { data, error } = await supabase
        .from("teacher_absences")
        .insert({
          teacher_id: teacherId,
          department_id: departmentId,
          absent_date: today,
          reason: reason || null,
          substitute_teacher_id: substituteTeacherId || null,
          is_handled: !!substituteTeacherId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher_absences"] });
      toast.success("Teacher marked as absent");
    },
    onError: (error) => {
      toast.error("Failed to mark teacher absent: " + error.message);
    },
  });
}

export function useHandleAbsence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      absenceId,
      substituteTeacherId,
      departmentId,
      sectionId,
      absentTeacherId,
    }: {
      absenceId: string;
      substituteTeacherId: string;
      departmentId: string;
      sectionId: string;
      absentTeacherId: string;
    }) => {
      // Update absence record
      await supabase
        .from("teacher_absences")
        .update({
          substitute_teacher_id: substituteTeacherId,
          is_handled: true,
        })
        .eq("id", absenceId);
      
      // Update timetable entries - mark as substituted
      await supabase
        .from("timetable_entries")
        .update({
          teacher_id: substituteTeacherId,
          is_substituted: true,
          original_teacher_id: absentTeacherId,
        })
        .eq("department_id", departmentId)
        .eq("section_id", sectionId)
        .eq("teacher_id", absentTeacherId);
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher_absences"] });
      queryClient.invalidateQueries({ queryKey: ["timetable_entries"] });
      toast.success("Timetable auto-adjusted for teacher absence");
    },
    onError: (error) => {
      toast.error("Failed to handle absence: " + error.message);
    },
  });
}
