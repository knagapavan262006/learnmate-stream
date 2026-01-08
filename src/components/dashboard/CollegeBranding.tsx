import { GraduationCap } from "lucide-react";

export function CollegeBranding() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 text-primary-foreground shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            PSCMR College of Engineering & Technology
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/90 font-medium">
            Smart Classroom & Academic Management System
          </p>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Empowering Education Through Technology
          </p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-accent/30 blur-xl" />
    </div>
  );
}