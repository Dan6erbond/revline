import { Gauge, Sparkles, Wrench } from "lucide-react";

import { ModCategory } from "@/gql/graphql";

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
