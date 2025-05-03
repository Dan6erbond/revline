import { TorqueUnit } from "@/gql/graphql";

const conversionFactors: Record<TorqueUnit, number> = {
  [TorqueUnit.KilogramMeter]: 0.1019716213,
  [TorqueUnit.NewtonMeters]: 1.0,
  [TorqueUnit.PoundFeet]: 0.7375621493,
};

export function getTorque(value: number, to: TorqueUnit) {
  return value * conversionFactors[to];
}

export function getNm(value: number, from: TorqueUnit) {
  return value / conversionFactors[from];
}
