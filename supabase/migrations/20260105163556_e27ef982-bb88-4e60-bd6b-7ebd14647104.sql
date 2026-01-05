-- Create app_role enum type
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL
$$;

-- RLS policy for user_roles: users can read their own roles, admins can read all
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for departments
DROP POLICY IF EXISTS "Public read access for departments" ON public.departments;
DROP POLICY IF EXISTS "Public insert access for departments" ON public.departments;
DROP POLICY IF EXISTS "Public update access for departments" ON public.departments;
DROP POLICY IF EXISTS "Public delete access for departments" ON public.departments;

-- Create authenticated policies for departments
CREATE POLICY "Authenticated users can read departments"
ON public.departments FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage departments"
ON public.departments FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for sections
DROP POLICY IF EXISTS "Public read access for sections" ON public.sections;
DROP POLICY IF EXISTS "Public insert access for sections" ON public.sections;
DROP POLICY IF EXISTS "Public update access for sections" ON public.sections;
DROP POLICY IF EXISTS "Public delete access for sections" ON public.sections;

-- Create authenticated policies for sections
CREATE POLICY "Authenticated users can read sections"
ON public.sections FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage sections"
ON public.sections FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for teachers
DROP POLICY IF EXISTS "Public read access for teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public insert access for teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public update access for teachers" ON public.teachers;
DROP POLICY IF EXISTS "Public delete access for teachers" ON public.teachers;

-- Create authenticated policies for teachers
CREATE POLICY "Authenticated users can read teachers"
ON public.teachers FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage teachers"
ON public.teachers FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for students
DROP POLICY IF EXISTS "Public read access for students" ON public.students;
DROP POLICY IF EXISTS "Public insert access for students" ON public.students;
DROP POLICY IF EXISTS "Public update access for students" ON public.students;
DROP POLICY IF EXISTS "Public delete access for students" ON public.students;

-- Create authenticated policies for students
CREATE POLICY "Authenticated users can read students"
ON public.students FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins and teachers can manage students"
ON public.students FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- Drop all existing public policies for classrooms
DROP POLICY IF EXISTS "Public read access for classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Public insert access for classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Public update access for classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Public delete access for classrooms" ON public.classrooms;

-- Create authenticated policies for classrooms
CREATE POLICY "Authenticated users can read classrooms"
ON public.classrooms FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage classrooms"
ON public.classrooms FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for time_slots
DROP POLICY IF EXISTS "Public read access for time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Public insert access for time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Public update access for time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Public delete access for time_slots" ON public.time_slots;

-- Create authenticated policies for time_slots
CREATE POLICY "Authenticated users can read time_slots"
ON public.time_slots FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage time_slots"
ON public.time_slots FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for timetable_entries
DROP POLICY IF EXISTS "Public read access for timetable_entries" ON public.timetable_entries;
DROP POLICY IF EXISTS "Public insert access for timetable_entries" ON public.timetable_entries;
DROP POLICY IF EXISTS "Public update access for timetable_entries" ON public.timetable_entries;
DROP POLICY IF EXISTS "Public delete access for timetable_entries" ON public.timetable_entries;

-- Create authenticated policies for timetable_entries
CREATE POLICY "Authenticated users can read timetable_entries"
ON public.timetable_entries FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage timetable_entries"
ON public.timetable_entries FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop all existing public policies for notifications
DROP POLICY IF EXISTS "Public read access for notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public insert access for notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public update access for notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public delete access for notifications" ON public.notifications;

-- Create authenticated policies for notifications
CREATE POLICY "Authenticated users can read notifications"
ON public.notifications FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins and teachers can manage notifications"
ON public.notifications FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

-- Drop all existing public policies for teacher_absences
DROP POLICY IF EXISTS "Public read access for teacher_absences" ON public.teacher_absences;
DROP POLICY IF EXISTS "Public insert access for teacher_absences" ON public.teacher_absences;
DROP POLICY IF EXISTS "Public update access for teacher_absences" ON public.teacher_absences;
DROP POLICY IF EXISTS "Public delete access for teacher_absences" ON public.teacher_absences;

-- Create authenticated policies for teacher_absences
CREATE POLICY "Authenticated users can read teacher_absences"
ON public.teacher_absences FOR SELECT
USING (public.is_authenticated());

CREATE POLICY "Admins can manage teacher_absences"
ON public.teacher_absences FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));