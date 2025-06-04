import {
  DistanceUnit,
  FuelCategory,
  FuelVolumeUnit,
  OctaneRating,
} from "@/gql/graphql";
import { distanceUnits, fuelVolumeUnits } from "@/literals";

import { Chip } from "@heroui/react";
import { Fuel } from "lucide-react";
import Link from "next/link";
import { getDistance } from "@/utils/distance";
import { getFuelVolume } from "@/utils/fuel-volume";
import { useUnits } from "@/hooks/use-units";

export function FuelUpChip({
  fuelUp,
  href,
  ...props
}: {
  fuelUp: {
    id: string;
    occurredAt: string;
    station?: string;
    amountLiters: number;
    expense?: { id: string; amount: number } | null;
    fuelCategory?: FuelCategory | null;
    octaneRating?: OctaneRating | null;
    odometerReading?: { id: string; readingKm: number } | null;
    notes?: string | null;
    isFullTank: boolean;
  };
  href?: string;
  fuelVolumeUnit?: FuelVolumeUnit | null;
  distanceUnit?: DistanceUnit | null;
}) {
  const { fuelVolumeUnit, distanceUnit } = useUnits(props);

  return (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={<Fuel className="size-4 ml-1 text-muted-foreground" />}
    >
      <span className="ml-1 truncate">
        {getFuelVolume(fuelUp.amountLiters, fuelVolumeUnit).toLocaleString()}
        {fuelVolumeUnits[fuelVolumeUnit]} @{" "}
        {(fuelUp.odometerReading &&
          getDistance(
            fuelUp.odometerReading.readingKm,
            distanceUnit
          ).toLocaleString()) ??
          "-"}{" "}
        {distanceUnits[distanceUnit]} ·{" "}
        {new Date(fuelUp.occurredAt).toLocaleDateString()}
      </span>
    </Chip>
  );
}
