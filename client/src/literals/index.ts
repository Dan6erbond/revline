import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
} from "@/gql/graphql";

export const fuelConsumptionUnits: Record<FuelConsumptionUnit, string> = {
  KPL: "Kilometers per liter",
  LP100K: "Liters per 100km",
  MPG: "Miles per gallon",
  MPG_Imperial: "Imperial miles per gallon",
};

export const fuelConsumptionUnitsShort: Record<FuelConsumptionUnit, string> = {
  KPL: "k/l",
  LP100K: "l/100km",
  MPG: "MPG",
  MPG_Imperial: "IMPG",
};

export const distanceUnits: Record<DistanceUnit, string> = {
  Kilometers: "km",
  Miles: "mi",
};

export const fuelVolumeUnits: Record<FuelVolumeUnit, string> = {
  Gallon: "g",
  ImperialGallon: "g (imp)",
  Liter: "l",
};
