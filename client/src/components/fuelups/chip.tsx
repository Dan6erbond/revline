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

export function FuelUpChip({
  fuelUp,
  href,
  fuelVolumeUnit,
  distanceUnit,
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
  return (
    <Chip
      as={href ? Link : undefined}
      href={href}
      className="capitalize"
      startContent={<Fuel className="size-4 ml-1 text-muted-foreground" />}
    >
      <span className="ml-1 truncate">
        {getFuelVolume(
          fuelUp.amountLiters,
          fuelVolumeUnit ?? FuelVolumeUnit.Gallon
        ).toLocaleString()}
        {fuelVolumeUnits[fuelVolumeUnit ?? FuelVolumeUnit.Gallon]} @{" "}
        {(fuelUp.odometerReading &&
          getDistance(
            fuelUp.odometerReading.readingKm,
            distanceUnit ?? DistanceUnit.Miles
          ).toLocaleString()) ??
          "-"}{" "}
        {distanceUnits[distanceUnit ?? DistanceUnit.Miles]} ·{" "}
        {new Date(fuelUp.occurredAt).toLocaleDateString()}
      </span>
    </Chip>
  );
}
