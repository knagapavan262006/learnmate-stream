import { createContext, useContext, useState, ReactNode } from "react";

export interface Department {
  id: string;
  name: string;
  code: string;
  sections: string[];
}

interface DepartmentContextType {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  getCurrentDepartment: () => Department | undefined;
  getSectionsForDepartment: (deptId: string) => string[];
}

const defaultDepartments: Department[] = [
  { id: "CSE", name: "Computer Science & Engineering", code: "CSE", sections: ["A", "B", "C"] },
  { id: "ECE", name: "Electronics & Communication", code: "ECE", sections: ["A", "B"] },
  { id: "EEE", name: "Electrical & Electronics", code: "EEE", sections: ["A", "B"] },
  { id: "MECH", name: "Mechanical Engineering", code: "MECH", sections: ["A", "B", "C"] },
  { id: "CIVIL", name: "Civil Engineering", code: "CIVIL", sections: ["A", "B"] },
];

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function DepartmentProvider({ children }: { children: ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("CSE");
  const [selectedSection, setSelectedSection] = useState<string>("A");

  const getCurrentDepartment = () => departments.find(d => d.id === selectedDepartment);
  
  const getSectionsForDepartment = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.sections || [];
  };

  // Reset section when department changes
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    const dept = departments.find(d => d.id === deptId);
    if (dept && dept.sections.length > 0) {
      setSelectedSection(dept.sections[0]);
    }
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        setDepartments,
        selectedDepartment,
        setSelectedDepartment: handleDepartmentChange,
        selectedSection,
        setSelectedSection,
        getCurrentDepartment,
        getSectionsForDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment must be used within a DepartmentProvider");
  }
  return context;
}
