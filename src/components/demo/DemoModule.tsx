import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  PlayCircle,
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  Calendar,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Department Management",
    description: "Create and manage departments like CSE, ECE, EEE. Each department has sections (A, B, C).",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Teacher Management",
    description: "Add teachers to departments, assign subjects, and manage their availability.",
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    title: "Student Records",
    description: "Track students by department and section. View attendance with visual indicators.",
    color: "text-success",
  },
  {
    icon: Calendar,
    title: "Smart Timetable",
    description: "AI-powered scheduling that prevents conflicts and optimizes room usage.",
    color: "text-warning",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Department-wise attendance charts, classroom utilization graphs, and insights.",
    color: "text-primary",
  },
];

const steps = [
  {
    step: 1,
    title: "Select Department",
    description: "Use the selector at the top to choose your department (CSE, ECE, etc.)",
  },
  {
    step: 2,
    title: "Choose Section",
    description: "Select the section (A, B, C) to view specific data for that class",
  },
  {
    step: 3,
    title: "Navigate Modules",
    description: "Use the sidebar to access Teachers, Students, Timetable, and Analytics",
  },
  {
    step: 4,
    title: "Generate Timetable",
    description: "Go to Timetable Generator, select resources, and click Generate",
  },
];

const faqs = [
  {
    question: "How is data isolated between departments?",
    answer: "All data (students, teachers, classrooms, timetables) is linked to specific departments. The global selector filters everything automatically.",
  },
  {
    question: "Can teachers be shared across departments?",
    answer: "Currently, teachers are assigned to one department. For cross-department teaching, create separate teacher entries.",
  },
  {
    question: "How does the smart timetable work?",
    answer: "The algorithm checks teacher availability, classroom capacity, and existing schedules to prevent double-booking conflicts.",
  },
  {
    question: "Is the data persistent?",
    answer: "This is a demo with in-memory data. For production, connect to a database backend.",
  },
];

export function DemoModule() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-success/10 border border-primary/20">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          AI Smart Classroom System
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          A department-wise academic management platform for colleges. Manage teachers, students, 
          classrooms, timetables, and attendance with intelligent scheduling.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">React + TypeScript</Badge>
          <Badge variant="secondary" className="px-3 py-1">Tailwind CSS</Badge>
          <Badge variant="secondary" className="px-3 py-1">Recharts</Badge>
          <Badge variant="secondary" className="px-3 py-1">shadcn/ui</Badge>
        </div>
      </div>

      {/* Video Placeholder */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Demo Video
          </h2>
        </div>
        <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <PlayCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Video Demo Placeholder</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Embed your project walkthrough video here for presentations and expo demonstrations
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <feature.icon className={`w-6 h-6 ${feature.color} mb-3`} />
              <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          How to Use This System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm mb-3">
                {item.step}
              </div>
              <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <h2 className="font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Technical Highlights */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
        <h2 className="font-semibold text-foreground mb-4">Technical Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Department-wise data isolation architecture",
            "Real-time conflict detection in scheduling",
            "Responsive design for all devices",
            "Interactive charts with Recharts",
            "Modern UI with shadcn/ui components",
            "Context API for global state management",
            "Type-safe with TypeScript",
            "Production-ready code structure",
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
