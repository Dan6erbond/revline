import { DistanceUnit } from "@/gql/graphql";

export function getDistance(km: number, unit: DistanceUnit) {
  switch (unit) {
    case DistanceUnit.Miles:
      return km * 0.621371;
    default:
      return km;
  }
}

export function getKilometers(value: number, unit: DistanceUnit) {
  switch (unit) {
    case DistanceUnit.Miles:
      return value / 0.621371;
    default:
      return value;
  }
}
