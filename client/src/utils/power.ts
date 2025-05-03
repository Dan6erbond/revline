import { PowerUnit } from "@/gql/graphql";

const conversionFactors: Record<PowerUnit, number> = {
  electric_horsepower: 1.3404825737,
  imp_horsepower: 1.34102209,
  mech_horsepower: 1.34102209,
  metric_horsepower: 1.3596216173,
  kilowatts: 1,
};

export function getPower(value: number, to: PowerUnit) {
  return value * conversionFactors[to];
}

export function getKilowatts(value: number, from: PowerUnit) {
  return value / conversionFactors[from];
}
