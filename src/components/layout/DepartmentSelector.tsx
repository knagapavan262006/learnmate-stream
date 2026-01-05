import { useDepartment } from "@/contexts/DepartmentContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Users2, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function DepartmentSelector() {
  const {
    departments,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedSectionId,
    setSelectedSectionId,
    selectedAcademicDay,
    setSelectedAcademicDay,
    getSectionsForDepartment,
    isLoading,
  } = useDepartment();

  const sections = getSectionsForDepartment(selectedDepartmentId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-sm">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border shadow-sm flex-wrap">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building className="w-4 h-4 text-primary" />
        </div>
        <Select value={selectedDepartmentId} onValueChange={setSelectedDepartmentId}>
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
        <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
          <SelectTrigger className="w-[110px] border-0 bg-transparent focus:ring-0 h-8">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                Section {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-px h-6 bg-border" />
      
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-success/10">
          <Calendar className="w-4 h-4 text-success" />
        </div>
        <Select value={selectedAcademicDay} onValueChange={setSelectedAcademicDay}>
          <SelectTrigger className="w-[120px] border-0 bg-transparent focus:ring-0 h-8">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
