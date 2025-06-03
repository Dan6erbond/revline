import { Chip, ChipProps, Tooltip } from "@heroui/react";
import { ModCategory, ModStatus } from "@/gql/graphql";
import {
  categoryColors,
  categoryIcons,
  statusIcons,
  statusLabels,
} from "./shared";

import Link from "next/link";
import React from "react";

export default function ModChip({
  mod,
  href,
  ...props
}: {
  mod: {
    title: string;
    stage?: string | null;
    category?: ModCategory | null;
    status?: ModStatus | null;
  };
  href?: string;
} & ChipProps) {
  const CategoryIcon = mod.category ? categoryIcons[mod.category] : null;
  const StatusIcon = mod.status ? statusIcons[mod.status] : null;

  const tooltipText = `${mod.title}${
    mod.status ? ` (${statusLabels[mod.status]})` : ""
  }`;

  return (
    <Tooltip content={tooltipText}>
      <Chip
        as={href ? Link : undefined}
        href={href}
        variant="faded"
        color={mod.category ? categoryColors[mod.category] : "default"}
        startContent={
          CategoryIcon ? <CategoryIcon className="h-4 w-4 mx-1" /> : null
        }
        endContent={StatusIcon ? <StatusIcon className="h-4 w-4 mx-1" /> : null}
        {...props}
      >
        {mod.title}
      </Chip>
    </Tooltip>
  );
}
