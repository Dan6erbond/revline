import { ActivitySquare } from "lucide-react";
import { Chip } from "@heroui/react";
import Link from "next/link";

export function DragSessionChip({
  session,
  href,
}: {
  session: {
    id: string;
    title: string;
    notes?: string | null;
    results?:
      | Array<{
          id: string;
          unit: string;
          value: number;
          result: number;
        }>
      | null
      | undefined;
  };
  href?: string;
}) {
  return (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={
        <ActivitySquare className="size-4 ml-1 text-muted-foreground" />
      }
    >
      <span className="ml-1 truncate">
        Drag Session · {session.title}
        {session.results &&
          session.results.length > 0 &&
          ` · ${session.results.length} result${
            session.results.length > 1 ? "s" : ""
          }`}
      </span>
    </Chip>
  );
}
