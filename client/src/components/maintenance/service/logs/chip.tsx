import { Chip } from "@heroui/react";
import { DistanceUnit } from "@/gql/graphql";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { distanceUnits } from "@/literals";
import { getDistance } from "@/utils/distance";
import { useUnits } from "@/hooks/use-units";

export function ServiceLogChip({
  log,
  href,
  ...props
}: {
  log: {
    id: string;
    datePerformed: string;
    odometerReading?: { id: string; readingKm: number } | null;
    performedBy?: string | null;
    notes?: string | null;
  };
  href?: string;
  distanceUnit?: DistanceUnit | null;
}) {
  const { distanceUnit } = useUnits(props);

  return (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={<Wrench className="size-4 ml-1 text-muted-foreground" />}
    >
      <span className="ml-1 truncate">
        Service @{" "}
        {(log.odometerReading &&
          getDistance(
            log.odometerReading.readingKm,
            distanceUnit
          ).toLocaleString()) ??
          "-"}{" "}
        {distanceUnits[distanceUnit]} ·{" "}
        {new Date(log.datePerformed).toLocaleDateString()}
      </span>
    </Chip>
  );
}
