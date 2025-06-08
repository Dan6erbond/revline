import { Chip, ChipProps } from "@heroui/react";

import { Gauge } from "lucide-react";
import Link from "next/link";

export function DynoSessionChip({
  session,
  href,
  ...props
}: {
  session: {
    id: string;
    title: string;
    notes?: string | null;
    results?:
      | Array<{
          id: string;
          rpm: number;
          powerKw?: number | null | undefined;
          torqueNm?: number | null | undefined;
        }>
      | null
      | undefined;
  };
  href?: string;
} & ChipProps) {
  return (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={<Gauge className="size-4 ml-1 text-muted-foreground" />}
      {...props}
    >
      <span className="ml-1 truncate">
        Dyno Session · {session.title}
        {session.results &&
          session.results.length > 0 &&
          ` · ${session.results.length} result${
            session.results.length > 1 ? "s" : ""
          }`}
      </span>
    </Chip>
  );
}
