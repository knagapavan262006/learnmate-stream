export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  availability: string[];
  assignedClasses: number;
  departmentId: string;
}

export interface Student {
  id: string;
  name: string;
  departmentId: string;
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
  departmentId: string;
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
  departmentId: string;
  section: string;
}

// Teachers with department assignment
export const teachers: Teacher[] = [
  // CSE Department
  { id: "T001", name: "Dr. Sarah Johnson", subject: "Data Structures", email: "sarah.j@college.edu", phone: "+1-234-567-8901", availability: ["Monday", "Tuesday", "Wednesday", "Thursday"], assignedClasses: 5, departmentId: "CSE" },
  { id: "T002", name: "Prof. James Brown", subject: "Algorithms", email: "james.b@college.edu", phone: "+1-234-567-8902", availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], assignedClasses: 6, departmentId: "CSE" },
  { id: "T003", name: "Dr. Emily Chen", subject: "Database Systems", email: "emily.c@college.edu", phone: "+1-234-567-8903", availability: ["Monday", "Wednesday", "Friday"], assignedClasses: 4, departmentId: "CSE" },
  { id: "T004", name: "Prof. Robert Lee", subject: "Operating Systems", email: "robert.l@college.edu", phone: "+1-234-567-8904", availability: ["Tuesday", "Thursday", "Friday"], assignedClasses: 4, departmentId: "CSE" },
  
  // ECE Department
  { id: "T005", name: "Dr. Michael Chen", subject: "Digital Electronics", email: "michael.c@college.edu", phone: "+1-234-567-8905", availability: ["Monday", "Wednesday", "Friday"], assignedClasses: 4, departmentId: "ECE" },
  { id: "T006", name: "Prof. Lisa Anderson", subject: "Signal Processing", email: "lisa.a@college.edu", phone: "+1-234-567-8906", availability: ["Monday", "Wednesday", "Thursday"], assignedClasses: 3, departmentId: "ECE" },
  { id: "T007", name: "Dr. David Kumar", subject: "VLSI Design", email: "david.k@college.edu", phone: "+1-234-567-8907", availability: ["Tuesday", "Wednesday", "Thursday", "Friday"], assignedClasses: 5, departmentId: "ECE" },
  
  // EEE Department
  { id: "T008", name: "Dr. Rachel Green", subject: "Power Systems", email: "rachel.g@college.edu", phone: "+1-234-567-8908", availability: ["Monday", "Tuesday", "Thursday", "Friday"], assignedClasses: 5, departmentId: "EEE" },
  { id: "T009", name: "Prof. John Smith", subject: "Control Systems", email: "john.s@college.edu", phone: "+1-234-567-8909", availability: ["Monday", "Wednesday", "Friday"], assignedClasses: 4, departmentId: "EEE" },
  
  // MECH Department
  { id: "T010", name: "Dr. William Taylor", subject: "Thermodynamics", email: "william.t@college.edu", phone: "+1-234-567-8910", availability: ["Monday", "Tuesday", "Wednesday", "Thursday"], assignedClasses: 5, departmentId: "MECH" },
  { id: "T011", name: "Prof. David Martinez", subject: "Fluid Mechanics", email: "david.m@college.edu", phone: "+1-234-567-8911", availability: ["Tuesday", "Wednesday", "Friday"], assignedClasses: 4, departmentId: "MECH" },
  { id: "T012", name: "Dr. Jennifer White", subject: "Manufacturing", email: "jennifer.w@college.edu", phone: "+1-234-567-8912", availability: ["Monday", "Thursday", "Friday"], assignedClasses: 3, departmentId: "MECH" },
  
  // CIVIL Department
  { id: "T013", name: "Prof. Robert Taylor", subject: "Structural Analysis", email: "robert.t@college.edu", phone: "+1-234-567-8913", availability: ["Wednesday", "Thursday", "Friday"], assignedClasses: 3, departmentId: "CIVIL" },
  { id: "T014", name: "Dr. Susan Clark", subject: "Geotechnical Eng", email: "susan.c@college.edu", phone: "+1-234-567-8914", availability: ["Monday", "Tuesday", "Wednesday"], assignedClasses: 4, departmentId: "CIVIL" },
];

// Students with department and section assignment
export const students: Student[] = [
  // CSE - Section A
  { id: "S001", name: "Alex Thompson", departmentId: "CSE", section: "A", email: "alex.t@student.edu", attendance: 92, weeklyAttendance: [100, 80, 100, 100, 80] },
  { id: "S002", name: "Emma Davis", departmentId: "CSE", section: "A", email: "emma.d@student.edu", attendance: 88, weeklyAttendance: [100, 100, 60, 100, 80] },
  { id: "S003", name: "Ryan Miller", departmentId: "CSE", section: "A", email: "ryan.m@student.edu", attendance: 95, weeklyAttendance: [100, 100, 80, 100, 100] },
  { id: "S004", name: "Sophie Wilson", departmentId: "CSE", section: "A", email: "sophie.w@student.edu", attendance: 78, weeklyAttendance: [80, 60, 80, 100, 80] },
  // CSE - Section B
  { id: "S005", name: "Daniel Lee", departmentId: "CSE", section: "B", email: "daniel.l@student.edu", attendance: 65, weeklyAttendance: [60, 80, 60, 60, 60] },
  { id: "S006", name: "Olivia Brown", departmentId: "CSE", section: "B", email: "olivia.b@student.edu", attendance: 45, weeklyAttendance: [40, 60, 40, 40, 40] },
  { id: "S007", name: "Ethan Garcia", departmentId: "CSE", section: "B", email: "ethan.g@student.edu", attendance: 82, weeklyAttendance: [80, 80, 80, 100, 80] },
  // CSE - Section C
  { id: "S008", name: "Ava Martinez", departmentId: "CSE", section: "C", email: "ava.m@student.edu", attendance: 71, weeklyAttendance: [80, 60, 60, 80, 80] },
  { id: "S009", name: "Noah Anderson", departmentId: "CSE", section: "C", email: "noah.a@student.edu", attendance: 96, weeklyAttendance: [100, 100, 100, 80, 100] },
  
  // ECE - Section A
  { id: "S010", name: "Isabella Thomas", departmentId: "ECE", section: "A", email: "isabella.t@student.edu", attendance: 88, weeklyAttendance: [80, 100, 80, 100, 80] },
  { id: "S011", name: "Liam Jackson", departmentId: "ECE", section: "A", email: "liam.j@student.edu", attendance: 84, weeklyAttendance: [80, 100, 80, 80, 80] },
  { id: "S012", name: "Mia White", departmentId: "ECE", section: "A", email: "mia.w@student.edu", attendance: 91, weeklyAttendance: [100, 80, 100, 100, 80] },
  // ECE - Section B
  { id: "S013", name: "Lucas Harris", departmentId: "ECE", section: "B", email: "lucas.h@student.edu", attendance: 73, weeklyAttendance: [80, 60, 80, 60, 80] },
  { id: "S014", name: "Charlotte Martin", departmentId: "ECE", section: "B", email: "charlotte.m@student.edu", attendance: 58, weeklyAttendance: [60, 40, 60, 60, 80] },
  
  // EEE - Section A
  { id: "S015", name: "Benjamin Garcia", departmentId: "EEE", section: "A", email: "benjamin.g@student.edu", attendance: 89, weeklyAttendance: [100, 80, 80, 100, 80] },
  { id: "S016", name: "Amelia Rodriguez", departmentId: "EEE", section: "A", email: "amelia.r@student.edu", attendance: 77, weeklyAttendance: [80, 60, 80, 80, 80] },
  // EEE - Section B
  { id: "S017", name: "Henry Lewis", departmentId: "EEE", section: "B", email: "henry.l@student.edu", attendance: 94, weeklyAttendance: [100, 100, 80, 100, 100] },
  { id: "S018", name: "Evelyn Walker", departmentId: "EEE", section: "B", email: "evelyn.w@student.edu", attendance: 42, weeklyAttendance: [40, 40, 40, 60, 40] },
  
  // MECH - Section A
  { id: "S019", name: "Alexander Hall", departmentId: "MECH", section: "A", email: "alexander.h@student.edu", attendance: 86, weeklyAttendance: [80, 100, 80, 80, 100] },
  { id: "S020", name: "Sophia Allen", departmentId: "MECH", section: "A", email: "sophia.a@student.edu", attendance: 79, weeklyAttendance: [80, 60, 80, 100, 80] },
  // MECH - Section B
  { id: "S021", name: "James Young", departmentId: "MECH", section: "B", email: "james.y@student.edu", attendance: 68, weeklyAttendance: [60, 80, 60, 60, 80] },
  { id: "S022", name: "Victoria King", departmentId: "MECH", section: "B", email: "victoria.k@student.edu", attendance: 91, weeklyAttendance: [100, 80, 100, 100, 80] },
  // MECH - Section C
  { id: "S023", name: "Daniel Wright", departmentId: "MECH", section: "C", email: "daniel.w@student.edu", attendance: 55, weeklyAttendance: [60, 40, 60, 60, 60] },
  
  // CIVIL - Section A
  { id: "S024", name: "Grace Scott", departmentId: "CIVIL", section: "A", email: "grace.s@student.edu", attendance: 87, weeklyAttendance: [80, 100, 80, 100, 80] },
  { id: "S025", name: "Owen Green", departmentId: "CIVIL", section: "A", email: "owen.g@student.edu", attendance: 72, weeklyAttendance: [80, 60, 60, 80, 80] },
  // CIVIL - Section B
  { id: "S026", name: "Chloe Adams", departmentId: "CIVIL", section: "B", email: "chloe.a@student.edu", attendance: 93, weeklyAttendance: [100, 80, 100, 100, 100] },
  { id: "S027", name: "Jack Baker", departmentId: "CIVIL", section: "B", email: "jack.b@student.edu", attendance: 48, weeklyAttendance: [40, 60, 40, 40, 60] },
];

// Classrooms with department assignment (some shared)
export const classrooms: Classroom[] = [
  // CSE
  { id: "R101", name: "CSE Lab 1", capacity: 60, currentUsage: 75, facilities: ["Computers", "Projector", "AC"], departmentId: "CSE" },
  { id: "R102", name: "CSE Lab 2", capacity: 40, currentUsage: 85, facilities: ["Computers", "AC"], departmentId: "CSE" },
  { id: "R103", name: "CSE Lecture Hall", capacity: 120, currentUsage: 70, facilities: ["Projector", "AC", "Smart Board"], departmentId: "CSE" },
  
  // ECE
  { id: "R201", name: "ECE Lab 1", capacity: 50, currentUsage: 80, facilities: ["Electronics", "Projector", "AC"], departmentId: "ECE" },
  { id: "R202", name: "ECE Lecture Hall", capacity: 80, currentUsage: 65, facilities: ["Projector", "AC"], departmentId: "ECE" },
  
  // EEE
  { id: "R301", name: "EEE Lab", capacity: 40, currentUsage: 90, facilities: ["Power Equipment", "AC"], departmentId: "EEE" },
  { id: "R302", name: "EEE Lecture Hall", capacity: 60, currentUsage: 55, facilities: ["Projector", "Smart Board"], departmentId: "EEE" },
  
  // MECH
  { id: "R401", name: "MECH Workshop", capacity: 50, currentUsage: 88, facilities: ["Machinery", "AC"], departmentId: "MECH" },
  { id: "R402", name: "MECH Lecture Hall", capacity: 100, currentUsage: 72, facilities: ["Projector", "AC"], departmentId: "MECH" },
  
  // CIVIL
  { id: "R501", name: "CIVIL Lab", capacity: 45, currentUsage: 60, facilities: ["Survey Equipment", "AC"], departmentId: "CIVIL" },
  { id: "R502", name: "CIVIL Lecture Hall", capacity: 80, currentUsage: 50, facilities: ["Projector", "AC", "Smart Board"], departmentId: "CIVIL" },
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

// Subjects by department
export const subjectsByDepartment: Record<string, string[]> = {
  CSE: ["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Computer Networks", "Web Development"],
  ECE: ["Digital Electronics", "Signal Processing", "VLSI Design", "Microprocessors", "Communication Systems"],
  EEE: ["Power Systems", "Control Systems", "Electrical Machines", "Power Electronics"],
  MECH: ["Thermodynamics", "Fluid Mechanics", "Manufacturing", "Machine Design", "Heat Transfer"],
  CIVIL: ["Structural Analysis", "Geotechnical Eng", "Surveying", "Construction Management"],
};

// Timetable with department and section
export const timetableData: TimetableEntry[] = [
  // CSE Section A
  { id: "TT1", day: "Monday", timeSlot: "09:00-10:00", subject: "Data Structures", teacherId: "T001", teacherName: "Dr. Sarah Johnson", classroomId: "R101", classroomName: "CSE Lab 1", departmentId: "CSE", section: "A" },
  { id: "TT2", day: "Monday", timeSlot: "10:00-11:00", subject: "Algorithms", teacherId: "T002", teacherName: "Prof. James Brown", classroomId: "R103", classroomName: "CSE Lecture Hall", departmentId: "CSE", section: "A" },
  { id: "TT3", day: "Monday", timeSlot: "11:00-12:00", subject: "Database Systems", teacherId: "T003", teacherName: "Dr. Emily Chen", classroomId: "R102", classroomName: "CSE Lab 2", departmentId: "CSE", section: "A" },
  { id: "TT4", day: "Tuesday", timeSlot: "09:00-10:00", subject: "Operating Systems", teacherId: "T004", teacherName: "Prof. Robert Lee", classroomId: "R101", classroomName: "CSE Lab 1", departmentId: "CSE", section: "A" },
  { id: "TT5", day: "Tuesday", timeSlot: "10:00-11:00", subject: "Data Structures", teacherId: "T001", teacherName: "Dr. Sarah Johnson", classroomId: "R103", classroomName: "CSE Lecture Hall", departmentId: "CSE", section: "A" },
  
  // CSE Section B
  { id: "TT6", day: "Monday", timeSlot: "09:00-10:00", subject: "Algorithms", teacherId: "T002", teacherName: "Prof. James Brown", classroomId: "R102", classroomName: "CSE Lab 2", departmentId: "CSE", section: "B" },
  { id: "TT7", day: "Monday", timeSlot: "14:00-15:00", subject: "Database Systems", teacherId: "T003", teacherName: "Dr. Emily Chen", classroomId: "R101", classroomName: "CSE Lab 1", departmentId: "CSE", section: "B" },
  
  // ECE Section A
  { id: "TT8", day: "Monday", timeSlot: "09:00-10:00", subject: "Digital Electronics", teacherId: "T005", teacherName: "Dr. Michael Chen", classroomId: "R201", classroomName: "ECE Lab 1", departmentId: "ECE", section: "A" },
  { id: "TT9", day: "Monday", timeSlot: "10:00-11:00", subject: "Signal Processing", teacherId: "T006", teacherName: "Prof. Lisa Anderson", classroomId: "R202", classroomName: "ECE Lecture Hall", departmentId: "ECE", section: "A" },
  { id: "TT10", day: "Tuesday", timeSlot: "11:00-12:00", subject: "VLSI Design", teacherId: "T007", teacherName: "Dr. David Kumar", classroomId: "R201", classroomName: "ECE Lab 1", departmentId: "ECE", section: "A" },
  
  // EEE Section A
  { id: "TT11", day: "Monday", timeSlot: "10:00-11:00", subject: "Power Systems", teacherId: "T008", teacherName: "Dr. Rachel Green", classroomId: "R301", classroomName: "EEE Lab", departmentId: "EEE", section: "A" },
  { id: "TT12", day: "Wednesday", timeSlot: "09:00-10:00", subject: "Control Systems", teacherId: "T009", teacherName: "Prof. John Smith", classroomId: "R302", classroomName: "EEE Lecture Hall", departmentId: "EEE", section: "A" },
  
  // MECH Section A
  { id: "TT13", day: "Monday", timeSlot: "09:00-10:00", subject: "Thermodynamics", teacherId: "T010", teacherName: "Dr. William Taylor", classroomId: "R402", classroomName: "MECH Lecture Hall", departmentId: "MECH", section: "A" },
  { id: "TT14", day: "Tuesday", timeSlot: "10:00-11:00", subject: "Fluid Mechanics", teacherId: "T011", teacherName: "Prof. David Martinez", classroomId: "R401", classroomName: "MECH Workshop", departmentId: "MECH", section: "A" },
  
  // CIVIL Section A
  { id: "TT15", day: "Wednesday", timeSlot: "14:00-15:00", subject: "Structural Analysis", teacherId: "T013", teacherName: "Prof. Robert Taylor", classroomId: "R502", classroomName: "CIVIL Lecture Hall", departmentId: "CIVIL", section: "A" },
  { id: "TT16", day: "Monday", timeSlot: "09:00-10:00", subject: "Geotechnical Eng", teacherId: "T014", teacherName: "Dr. Susan Clark", classroomId: "R501", classroomName: "CIVIL Lab", departmentId: "CIVIL", section: "A" },
];

// Helper functions
export const getClassroomUtilization = (departmentId: string) => {
  return classrooms
    .filter(c => c.departmentId === departmentId)
    .map(room => ({
      name: room.name,
      used: room.currentUsage,
      available: 100 - room.currentUsage,
    }));
};

export const getAttendanceBySection = (departmentId: string) => {
  const sections = ["A", "B", "C"];
  return sections.map(section => {
    const sectionStudents = students.filter(s => s.departmentId === departmentId && s.section === section);
    const avgAttendance = sectionStudents.length > 0 
      ? Math.round(sectionStudents.reduce((sum, s) => sum + s.attendance, 0) / sectionStudents.length)
      : 0;
    return { section: `Section ${section}`, attendance: avgAttendance, count: sectionStudents.length };
  }).filter(s => s.count > 0);
};
