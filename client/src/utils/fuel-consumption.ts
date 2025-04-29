import { FuelConsumptionUnit } from "@/gql/graphql";

const LP100K_TO_MPG = 235.21;
const LP100K_TO_IMPG = 282.5;

export function getFuelConsumption(lpk: number, unit: FuelConsumptionUnit) {
  switch (unit) {
    case FuelConsumptionUnit.Mpg:
      return lpk * 100 * LP100K_TO_MPG;
    case FuelConsumptionUnit.ImpMpg:
      return lpk * 100 * LP100K_TO_IMPG;
    default:
      return lpk * 100;
  }
}
