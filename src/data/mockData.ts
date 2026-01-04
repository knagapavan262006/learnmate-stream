export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  availability: string[];
  assignedClasses: number;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  email: string;
  attendance: number;
  weeklyAttendance: number[];
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  currentUsage: number;
  facilities: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface TimetableEntry {
  id: string;
  day: string;
  timeSlot: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  classroomId: string;
  classroomName: string;
  className: string;
}

export const teachers: Teacher[] = [
  { id: "T001", name: "Dr. Sarah Johnson", subject: "Mathematics", email: "sarah.j@college.edu", phone: "+1-234-567-8901", availability: ["Monday", "Tuesday", "Wednesday", "Thursday"], assignedClasses: 5 },
  { id: "T002", name: "Prof. Michael Chen", subject: "Physics", email: "michael.c@college.edu", phone: "+1-234-567-8902", availability: ["Monday", "Wednesday", "Friday"], assignedClasses: 4 },
  { id: "T003", name: "Dr. Emily Williams", subject: "Chemistry", email: "emily.w@college.edu", phone: "+1-234-567-8903", availability: ["Tuesday", "Thursday", "Friday"], assignedClasses: 4 },
  { id: "T004", name: "Prof. James Brown", subject: "Computer Science", email: "james.b@college.edu", phone: "+1-234-567-8904", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], assignedClasses: 6 },
  { id: "T005", name: "Dr. Lisa Anderson", subject: "English Literature", email: "lisa.a@college.edu", phone: "+1-234-567-8905", availability: ["Monday", "Wednesday", "Thursday"], assignedClasses: 3 },
  { id: "T006", name: "Prof. David Martinez", subject: "Economics", email: "david.m@college.edu", phone: "+1-234-567-8906", availability: ["Tuesday", "Wednesday", "Friday"], assignedClasses: 4 },
  { id: "T007", name: "Dr. Rachel Green", subject: "Biology", email: "rachel.g@college.edu", phone: "+1-234-567-8907", availability: ["Monday", "Tuesday", "Thursday", "Friday"], assignedClasses: 5 },
  { id: "T008", name: "Prof. Robert Taylor", subject: "History", email: "robert.t@college.edu", phone: "+1-234-567-8908", availability: ["Wednesday", "Thursday", "Friday"], assignedClasses: 3 },
];

export const students: Student[] = [
  { id: "S001", name: "Alex Thompson", class: "CS-101", section: "A", email: "alex.t@student.edu", attendance: 92, weeklyAttendance: [100, 80, 100, 100, 80] },
  { id: "S002", name: "Emma Davis", class: "CS-101", section: "A", email: "emma.d@student.edu", attendance: 88, weeklyAttendance: [100, 100, 60, 100, 80] },
  { id: "S003", name: "Ryan Miller", class: "CS-101", section: "B", email: "ryan.m@student.edu", attendance: 65, weeklyAttendance: [60, 80, 60, 60, 60] },
  { id: "S004", name: "Sophie Wilson", class: "EE-201", section: "A", email: "sophie.w@student.edu", attendance: 95, weeklyAttendance: [100, 100, 80, 100, 100] },
  { id: "S005", name: "Daniel Lee", class: "EE-201", section: "A", email: "daniel.l@student.edu", attendance: 78, weeklyAttendance: [80, 60, 80, 100, 80] },
  { id: "S006", name: "Olivia Brown", class: "ME-301", section: "A", email: "olivia.b@student.edu", attendance: 45, weeklyAttendance: [40, 60, 40, 40, 40] },
  { id: "S007", name: "Ethan Garcia", class: "ME-301", section: "B", email: "ethan.g@student.edu", attendance: 82, weeklyAttendance: [80, 80, 80, 100, 80] },
  { id: "S008", name: "Ava Martinez", class: "CE-401", section: "A", email: "ava.m@student.edu", attendance: 71, weeklyAttendance: [80, 60, 60, 80, 80] },
  { id: "S009", name: "Noah Anderson", class: "CE-401", section: "A", email: "noah.a@student.edu", attendance: 96, weeklyAttendance: [100, 100, 100, 80, 100] },
  { id: "S010", name: "Isabella Thomas", class: "CS-101", section: "B", email: "isabella.t@student.edu", attendance: 58, weeklyAttendance: [60, 40, 60, 60, 80] },
  { id: "S011", name: "Liam Jackson", class: "EE-201", section: "B", email: "liam.j@student.edu", attendance: 84, weeklyAttendance: [80, 100, 80, 80, 80] },
  { id: "S012", name: "Mia White", class: "ME-301", section: "A", email: "mia.w@student.edu", attendance: 91, weeklyAttendance: [100, 80, 100, 100, 80] },
];

export const classrooms: Classroom[] = [
  { id: "R101", name: "Room 101", capacity: 60, currentUsage: 75, facilities: ["Projector", "AC", "Smart Board"] },
  { id: "R102", name: "Room 102", capacity: 40, currentUsage: 85, facilities: ["Projector", "AC"] },
  { id: "R103", name: "Lab A", capacity: 30, currentUsage: 90, facilities: ["Computers", "AC", "Projector"] },
  { id: "R104", name: "Lab B", capacity: 30, currentUsage: 60, facilities: ["Computers", "AC"] },
  { id: "R105", name: "Room 201", capacity: 50, currentUsage: 45, facilities: ["Projector", "Smart Board"] },
  { id: "R106", name: "Room 202", capacity: 45, currentUsage: 70, facilities: ["Projector", "AC"] },
  { id: "R107", name: "Auditorium", capacity: 200, currentUsage: 30, facilities: ["Projector", "AC", "Sound System", "Stage"] },
  { id: "R108", name: "Seminar Hall", capacity: 100, currentUsage: 55, facilities: ["Projector", "AC", "Video Conference"] },
];

export const timeSlots: TimeSlot[] = [
  { id: "TS1", startTime: "09:00", endTime: "10:00", isActive: true },
  { id: "TS2", startTime: "10:00", endTime: "11:00", isActive: true },
  { id: "TS3", startTime: "11:00", endTime: "12:00", isActive: true },
  { id: "TS4", startTime: "12:00", endTime: "13:00", isActive: false },
  { id: "TS5", startTime: "13:00", endTime: "14:00", isActive: true },
  { id: "TS6", startTime: "14:00", endTime: "15:00", isActive: true },
  { id: "TS7", startTime: "15:00", endTime: "16:00", isActive: true },
  { id: "TS8", startTime: "16:00", endTime: "17:00", isActive: true },
];

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const subjects = [
  "Mathematics",
  "Physics", 
  "Chemistry",
  "Computer Science",
  "English Literature",
  "Economics",
  "Biology",
  "History"
];

export const timetableData: TimetableEntry[] = [
  { id: "TT1", day: "Monday", timeSlot: "09:00-10:00", subject: "Mathematics", teacherId: "T001", teacherName: "Dr. Sarah Johnson", classroomId: "R101", classroomName: "Room 101", className: "CS-101" },
  { id: "TT2", day: "Monday", timeSlot: "10:00-11:00", subject: "Physics", teacherId: "T002", teacherName: "Prof. Michael Chen", classroomId: "R102", classroomName: "Room 102", className: "CS-101" },
  { id: "TT3", day: "Monday", timeSlot: "11:00-12:00", subject: "Computer Science", teacherId: "T004", teacherName: "Prof. James Brown", classroomId: "R103", classroomName: "Lab A", className: "CS-101" },
  { id: "TT4", day: "Monday", timeSlot: "13:00-14:00", subject: "English Literature", teacherId: "T005", teacherName: "Dr. Lisa Anderson", classroomId: "R101", classroomName: "Room 101", className: "EE-201" },
  { id: "TT5", day: "Monday", timeSlot: "14:00-15:00", subject: "Biology", teacherId: "T007", teacherName: "Dr. Rachel Green", classroomId: "R104", classroomName: "Lab B", className: "ME-301" },
  { id: "TT6", day: "Tuesday", timeSlot: "09:00-10:00", subject: "Chemistry", teacherId: "T003", teacherName: "Dr. Emily Williams", classroomId: "R103", classroomName: "Lab A", className: "CS-101" },
  { id: "TT7", day: "Tuesday", timeSlot: "10:00-11:00", subject: "Economics", teacherId: "T006", teacherName: "Prof. David Martinez", classroomId: "R105", classroomName: "Room 201", className: "EE-201" },
  { id: "TT8", day: "Tuesday", timeSlot: "11:00-12:00", subject: "Mathematics", teacherId: "T001", teacherName: "Dr. Sarah Johnson", classroomId: "R102", classroomName: "Room 102", className: "ME-301" },
  { id: "TT9", day: "Wednesday", timeSlot: "09:00-10:00", subject: "Physics", teacherId: "T002", teacherName: "Prof. Michael Chen", classroomId: "R101", classroomName: "Room 101", className: "EE-201" },
  { id: "TT10", day: "Wednesday", timeSlot: "10:00-11:00", subject: "History", teacherId: "T008", teacherName: "Prof. Robert Taylor", classroomId: "R106", classroomName: "Room 202", className: "CE-401" },
  { id: "TT11", day: "Wednesday", timeSlot: "14:00-15:00", subject: "Computer Science", teacherId: "T004", teacherName: "Prof. James Brown", classroomId: "R103", classroomName: "Lab A", className: "EE-201" },
  { id: "TT12", day: "Thursday", timeSlot: "09:00-10:00", subject: "Biology", teacherId: "T007", teacherName: "Dr. Rachel Green", classroomId: "R104", classroomName: "Lab B", className: "CS-101" },
  { id: "TT13", day: "Thursday", timeSlot: "11:00-12:00", subject: "Chemistry", teacherId: "T003", teacherName: "Dr. Emily Williams", classroomId: "R103", classroomName: "Lab A", className: "ME-301" },
  { id: "TT14", day: "Friday", timeSlot: "09:00-10:00", subject: "Economics", teacherId: "T006", teacherName: "Prof. David Martinez", classroomId: "R105", classroomName: "Room 201", className: "CS-101" },
  { id: "TT15", day: "Friday", timeSlot: "10:00-11:00", subject: "History", teacherId: "T008", teacherName: "Prof. Robert Taylor", classroomId: "R106", classroomName: "Room 202", className: "EE-201" },
  { id: "TT16", day: "Friday", timeSlot: "13:00-14:00", subject: "Physics", teacherId: "T002", teacherName: "Prof. Michael Chen", classroomId: "R101", classroomName: "Room 101", className: "ME-301" },
];

export const classroomUtilization = [
  { name: "Room 101", used: 75, available: 25 },
  { name: "Room 102", used: 85, available: 15 },
  { name: "Lab A", used: 90, available: 10 },
  { name: "Lab B", used: 60, available: 40 },
  { name: "Room 201", used: 45, available: 55 },
  { name: "Room 202", used: 70, available: 30 },
  { name: "Auditorium", used: 30, available: 70 },
  { name: "Seminar Hall", used: 55, available: 45 },
];

export const attendanceByClass = [
  { class: "CS-101", attendance: 78 },
  { class: "EE-201", attendance: 85 },
  { class: "ME-301", attendance: 72 },
  { class: "CE-401", attendance: 83 },
];
