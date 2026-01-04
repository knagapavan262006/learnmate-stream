import { useDepartment } from "@/contexts/DepartmentContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Users2 } from "lucide-react";

export function DepartmentSelector() {
  const {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    selectedSection,
    setSelectedSection,
    getSectionsForDepartment,
  } = useDepartment();

  const sections = getSectionsForDepartment(selectedDepartment);

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building className="w-4 h-4 text-primary" />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[140px] border-0 bg-transparent focus:ring-0 h-8">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-px h-6 bg-border" />
      
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-accent/10">
          <Users2 className="w-4 h-4 text-accent" />
        </div>
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-[100px] border-0 bg-transparent focus:ring-0 h-8">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section} value={section}>
                Section {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
