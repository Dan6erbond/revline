import { FuelVolumeUnit } from "../gql/graphql";

export function getFuelVolume(volume: number, unit: FuelVolumeUnit) {
  switch (unit) {
    case FuelVolumeUnit.Gallon:
      return volume * 3.78541;
    default:
      return volume;
  }
}

export function getLiters(volume: number, unit: FuelVolumeUnit) {
  switch (unit) {
    case FuelVolumeUnit.Gallon:
      return volume / 3.78541;
    default:
      return volume;
  }
}
