import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
} from "@/gql/graphql";

export const fuelConsumptionUnits: Record<FuelConsumptionUnit, string> = {
  kpl: "Kilometers per liter",
  lp100k: "Liters per 100km",
  mpg: "Miles per gallon",
  imp_mpg: "Imperial miles per gallon",
};

export const fuelConsumptionUnitsShort: Record<FuelConsumptionUnit, string> = {
  kpl: "k/l",
  lp100k: "l/100km",
  mpg: "MPG",
  imp_mpg: "IMPG",
};

export const distanceUnits: Record<DistanceUnit, string> = {
  kilometers: "km",
  miles: "mi",
};

export const fuelVolumeUnits: Record<FuelVolumeUnit, string> = {
  gallon: "gal",
  imp_gallon: "gal (imp)",
  liter: "l",
};
