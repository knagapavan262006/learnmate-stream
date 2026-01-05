import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useDepartments, useSections, DbDepartment, DbSection } from "@/hooks/useDatabase";

interface DepartmentContextType {
  departments: DbDepartment[];
  sections: DbSection[];
  selectedDepartmentId: string;
  setSelectedDepartmentId: (departmentId: string) => void;
  selectedSectionId: string;
  setSelectedSectionId: (sectionId: string) => void;
  selectedAcademicDay: string;
  setSelectedAcademicDay: (day: string) => void;
  getCurrentDepartment: () => DbDepartment | undefined;
  getSectionsForDepartment: (deptId: string) => DbSection[];
  isLoading: boolean;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function DepartmentProvider({ children }: { children: ReactNode }) {
  const { data: departments = [], isLoading: depsLoading } = useDepartments();
  const { data: allSections = [], isLoading: secLoading } = useSections();
  
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedAcademicDay, setSelectedAcademicDay] = useState<string>(() => 
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

  // Set initial department when data loads
  useEffect(() => {
    if (departments.length > 0 && !selectedDepartmentId) {
      setSelectedDepartmentId(departments[0].id);
    }
  }, [departments, selectedDepartmentId]);

  // Set initial section when department changes
  useEffect(() => {
    if (selectedDepartmentId && allSections.length > 0) {
      const deptSections = allSections.filter(s => s.department_id === selectedDepartmentId);
      if (deptSections.length > 0 && !deptSections.find(s => s.id === selectedSectionId)) {
        setSelectedSectionId(deptSections[0].id);
      }
    }
  }, [selectedDepartmentId, allSections, selectedSectionId]);

  const getCurrentDepartment = () => departments.find(d => d.id === selectedDepartmentId);
  
  const getSectionsForDepartment = (deptId: string) => 
    allSections.filter(s => s.department_id === deptId);

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    const deptSections = allSections.filter(s => s.department_id === deptId);
    if (deptSections.length > 0) {
      setSelectedSectionId(deptSections[0].id);
    }
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        sections: allSections,
        selectedDepartmentId,
        setSelectedDepartmentId: handleDepartmentChange,
        selectedSectionId,
        setSelectedSectionId,
        selectedAcademicDay,
        setSelectedAcademicDay,
        getCurrentDepartment,
        getSectionsForDepartment,
        isLoading: depsLoading || secLoading,
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
