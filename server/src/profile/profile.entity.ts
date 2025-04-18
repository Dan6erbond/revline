import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  TemperatureUnit,
} from "../graphql";
import { Entity, Enum, OneToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { User } from "../users/users.entity";

@Entity()
export class Profile extends BaseEntity {
  @OneToOne(() => User)
  user: User;

  @Property({ nullable: true, unique: true })
  username: string;

  @Property({ nullable: true })
  firstName: string;

  @Property({ nullable: true })
  lastName: string;

  @Property({ nullable: true })
  currencyCode: string;

  @Enum({ items: () => FuelVolumeUnit, nullable: true })
  fuelVolumeUnit: FuelVolumeUnit;

  @Enum({ items: () => DistanceUnit, nullable: true })
  distanceUnit: DistanceUnit;

  @Enum({ items: () => FuelConsumptionUnit, nullable: true })
  fuelConsumptionUnit: FuelConsumptionUnit;

  @Enum({ items: () => TemperatureUnit, nullable: true })
  temperatureUnit: TemperatureUnit;

  @Property({ type: "uuid", nullable: true })
  profilePicture?: string;
}
