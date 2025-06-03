import {
  CalendarCheck2,
  CheckCircle2,
  Gauge,
  Lightbulb,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ModCategory, ModStatus } from "@/gql/graphql";

export const categoryLabels = {
  [ModCategory.Performance]: "Performance",
  [ModCategory.Aesthetic]: "Aesthetic",
  [ModCategory.Utility]: "Utility",
};

export const categoryIcons = {
  [ModCategory.Performance]: Gauge,
  [ModCategory.Aesthetic]: Sparkles,
  [ModCategory.Utility]: Wrench,
};

export const categoryColors = {
  [ModCategory.Performance]: "secondary",
  [ModCategory.Aesthetic]: "primary",
  [ModCategory.Utility]: "default",
} as const;

export const statusLabels = {
  [ModStatus.Idea]: "Idea",
  [ModStatus.Planned]: "Planned",
  [ModStatus.Completed]: "Completed",
};

export const statusIcons = {
  [ModStatus.Idea]: Lightbulb,
  [ModStatus.Planned]: CalendarCheck2,
  [ModStatus.Completed]: CheckCircle2,
};

export const statusColors = {
  [ModStatus.Idea]: "secondary",
  [ModStatus.Planned]: "primary",
  [ModStatus.Completed]: "success",
} as const;
