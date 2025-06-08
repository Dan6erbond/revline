import {
  Chip,
  ChipProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { PowerUnit, TorqueUnit } from "@/gql/graphql";

import DynoSessionChart from "./chart";
import { Gauge } from "lucide-react";
import Link from "next/link";
import { useUnits } from "@/hooks/use-units";

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
  powerUnit: PowerUnit;
  torqueUnit: TorqueUnit;
} & ChipProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { powerUnit, torqueUnit } = useUnits();

  const chip = (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={<Gauge className="size-4 ml-1 text-muted-foreground" />}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
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

  if (!session.results || session.results.length === 0) {
    return chip;
  }

  return (
    <Popover isOpen={isOpen} shouldCloseOnBlur onOpenChange={onOpenChange}>
      <PopoverTrigger>{chip}</PopoverTrigger>
      <PopoverContent>
        {(titleProps) => (
          <div className="flex flex-col gap-2 min-w-[90vw] sm:min-w-0">
            <h3 className="text-small font-bold" {...titleProps}>
              {session.title}
            </h3>
            <DynoSessionChart
              session={session}
              powerUnit={powerUnit}
              torqueUnit={torqueUnit}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
