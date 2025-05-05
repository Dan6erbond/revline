import {
  Activity,
  AlertCircle,
  Baby,
  Brain,
  Car,
  ClipboardCheck,
  Clock,
  Dumbbell,
  FileBadge,
  Flame,
  Hammer,
  HelpCircle,
  Leaf,
  LucideIcon,
  Mountain,
  Paintbrush,
  Puzzle,
  ShieldAlert,
  ShieldCheck,
  Skull,
  Sparkles,
  SprayCan,
  Stethoscope,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import {
  TaskCategory,
  TaskDifficulty,
  TaskEffort,
  TaskPriority,
} from "@/gql/graphql";

import { ChipProps } from "@heroui/react";

type ChipColor = NonNullable<ChipProps["color"]>;

export const categoryColors: Record<TaskCategory, ChipColor> = {
  maintenance: "default",
  service: "default",
  repair: "danger",
  modification: "primary",
  cosmetic: "default",
  cleaning: "default",
  detailing: "default",
  inspection: "warning",
  registration: "default",
  insurance: "default",
  accessory: "default",
  diagnostics: "default",
  other: "default",
};

export const categoryLabels: Record<TaskCategory, string> = {
  maintenance: "Maintenance",
  service: "Service",
  repair: "Repair",
  modification: "Modification",
  cosmetic: "Cosmetic",
  cleaning: "Cleaning",
  detailing: "Detailing",
  inspection: "Inspection",
  registration: "Registration",
  insurance: "Insurance",
  accessory: "Accessory",
  diagnostics: "Diagnostics",
  other: "Other",
};

export const categoryIcons: Record<TaskCategory, LucideIcon> = {
  maintenance: Wrench,
  service: Car,
  repair: Hammer,
  modification: Puzzle,
  cosmetic: Paintbrush,
  cleaning: SprayCan,
  detailing: Sparkles,
  inspection: ClipboardCheck,
  registration: FileBadge,
  insurance: ShieldCheck,
  accessory: Puzzle,
  diagnostics: Stethoscope,
  other: HelpCircle,
};

export const priorityColors: Record<TaskPriority, ChipColor> = {
  low: "default",
  mid: "primary",
  high: "warning",
  urgent: "danger",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  mid: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const priorityIcons: Record<TaskPriority, LucideIcon> = {
  low: Clock,
  mid: AlertCircle,
  high: Flame,
  urgent: Zap,
};

export const effortColors: Record<TaskEffort, ChipColor> = {
  trivial: "default",
  easy: "default",
  moderate: "primary",
  hard: "warning",
  extreme: "danger",
};

export const effortLabels: Record<TaskEffort, string> = {
  trivial: "Trivial",
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  extreme: "Extreme",
};

export const effortIcons: Record<TaskEffort, LucideIcon> = {
  trivial: Leaf,
  easy: Activity,
  moderate: Dumbbell,
  hard: Mountain,
  extreme: Skull,
};

export const difficultyColors: Record<TaskDifficulty, ChipColor> = {
  beginner: "default",
  intermediate: "primary",
  advanced: "warning",
  expert: "danger",
};

export const difficultyLabels: Record<TaskDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const difficultyIcons: Record<TaskDifficulty, LucideIcon> = {
  beginner: Baby,
  intermediate: User,
  advanced: Brain,
  expert: ShieldAlert,
};
