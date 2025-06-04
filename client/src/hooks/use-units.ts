import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  PowerUnit,
  TorqueUnit,
} from "@/gql/graphql";

export const useUnits = (
  settings?: Partial<{
    fuelVolumeUnit: FuelVolumeUnit | null;
    distanceUnit: DistanceUnit | null;
    currencyCode: string | null;
    fuelConsumptionUnit: FuelConsumptionUnit | null;
    powerUnit: PowerUnit | null;
    torqueUnit: TorqueUnit | null;
  }> | null
) => ({
  fuelVolumeUnit: settings?.fuelVolumeUnit ?? FuelVolumeUnit.Gallon,
  fuelConsumptionUnit: settings?.fuelConsumptionUnit ?? FuelConsumptionUnit.Mpg,
  distanceUnit: settings?.distanceUnit ?? DistanceUnit.Miles,
  currencyCode: settings?.currencyCode ?? "USD",
  powerUnit: settings?.powerUnit ?? PowerUnit.ImpHorsepower,
  torqueUnit: settings?.torqueUnit ?? TorqueUnit.PoundFeet,
});
