-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sections table
CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(department_id, name)
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  email TEXT,
  availability TEXT[] DEFAULT ARRAY['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'],
  is_absent BOOLEAN DEFAULT false,
  absent_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  email TEXT,
  attendance_percentage NUMERIC(5,2) DEFAULT 100.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classrooms table
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 60,
  facilities TEXT[] DEFAULT ARRAY['Projector', 'AC'],
  usage_percentage NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time_slots table
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create timetable_entries table
CREATE TABLE public.timetable_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  is_substituted BOOLEAN DEFAULT false,
  original_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'whatsapp', 'app', 'sms')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('students', 'teachers', 'all')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teacher_absences table for tracking
CREATE TABLE public.teacher_absences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  absent_date DATE NOT NULL,
  substitute_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  reason TEXT,
  is_handled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, absent_date)
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_absences ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for demo purposes - no auth required)
CREATE POLICY "Public read access for departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public insert access for departments" ON public.departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for departments" ON public.departments FOR UPDATE USING (true);
CREATE POLICY "Public delete access for departments" ON public.departments FOR DELETE USING (true);

CREATE POLICY "Public read access for sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Public insert access for sections" ON public.sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for sections" ON public.sections FOR UPDATE USING (true);
CREATE POLICY "Public delete access for sections" ON public.sections FOR DELETE USING (true);

CREATE POLICY "Public read access for teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Public insert access for teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for teachers" ON public.teachers FOR UPDATE USING (true);
CREATE POLICY "Public delete access for teachers" ON public.teachers FOR DELETE USING (true);

CREATE POLICY "Public read access for students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public insert access for students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Public delete access for students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Public read access for classrooms" ON public.classrooms FOR SELECT USING (true);
CREATE POLICY "Public insert access for classrooms" ON public.classrooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for classrooms" ON public.classrooms FOR UPDATE USING (true);
CREATE POLICY "Public delete access for classrooms" ON public.classrooms FOR DELETE USING (true);

CREATE POLICY "Public read access for time_slots" ON public.time_slots FOR SELECT USING (true);
CREATE POLICY "Public insert access for time_slots" ON public.time_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for time_slots" ON public.time_slots FOR UPDATE USING (true);
CREATE POLICY "Public delete access for time_slots" ON public.time_slots FOR DELETE USING (true);

CREATE POLICY "Public read access for timetable_entries" ON public.timetable_entries FOR SELECT USING (true);
CREATE POLICY "Public insert access for timetable_entries" ON public.timetable_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for timetable_entries" ON public.timetable_entries FOR UPDATE USING (true);
CREATE POLICY "Public delete access for timetable_entries" ON public.timetable_entries FOR DELETE USING (true);

CREATE POLICY "Public read access for notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public insert access for notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Public delete access for notifications" ON public.notifications FOR DELETE USING (true);

CREATE POLICY "Public read access for teacher_absences" ON public.teacher_absences FOR SELECT USING (true);
CREATE POLICY "Public insert access for teacher_absences" ON public.teacher_absences FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for teacher_absences" ON public.teacher_absences FOR UPDATE USING (true);
CREATE POLICY "Public delete access for teacher_absences" ON public.teacher_absences FOR DELETE USING (true);