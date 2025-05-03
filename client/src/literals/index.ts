import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  PowerUnit,
  TorqueUnit,
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

export const powerUnits: Record<PowerUnit, string> = {
  [PowerUnit.ElectricHorsepower]: "Electric horsepower",
  [PowerUnit.ImpHorsepower]: "Imperial horsepower",
  [PowerUnit.Kilowatts]: "Kilowatts",
  [PowerUnit.MechHorsepower]: "Mechanical horsepower",
  [PowerUnit.MetricHorsepower]: "Metric horsepower",
};

export const powerUnitsShort: Record<PowerUnit, string> = {
  [PowerUnit.ElectricHorsepower]: "ehp",
  [PowerUnit.ImpHorsepower]: "hp (imp)",
  [PowerUnit.Kilowatts]: "kW",
  [PowerUnit.MechHorsepower]: "hp",
  [PowerUnit.MetricHorsepower]: "PS",
};

export const torqueUnits: Record<TorqueUnit, string> = {
  [TorqueUnit.KilogramMeter]: "Kilogram meter",
  [TorqueUnit.NewtonMeters]: "Newton meter",
  [TorqueUnit.PoundFeet]: "Pound-foot",
};

export const torqueUnitsShort: Record<TorqueUnit, string> = {
  [TorqueUnit.KilogramMeter]: "kg·m",
  [TorqueUnit.NewtonMeters]: "Nm",
  [TorqueUnit.PoundFeet]: "lb·ft",
};
