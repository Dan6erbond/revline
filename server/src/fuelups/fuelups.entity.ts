import { Entity, Enum, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { FuelCategory, OctaneRating } from "../graphql";

import { BaseEntity } from "../db/base.entity";
import { Car } from "../cars/cars.entity";
import { OdometerReading } from "../odometer-reading/odometer-reading.entity";

@Entity()
export class FuelUp extends BaseEntity {
  @ManyToOne(() => Car)
  car: Car;

  @Property()
  occurredAt: Date;

  @Property()
  station: string;

  @Property({ type: "float" })
  amountLiters: number;

  @Property({ type: "float" })
  cost: number;

  @Enum(() => FuelCategory)
  fuelCategory: FuelCategory;

  @Enum(() => OctaneRating)
  octane?: OctaneRating;

  @OneToOne(() => OdometerReading, { nullable: true })
  odometerReading?: OdometerReading;

  @Property({ nullable: true })
  notes?: string;

  @Property({ default: false })
  isFullTank: boolean = false;

  @Property({ nullable: true })
  locationLat?: number;

  @Property({ nullable: true })
  locationLng?: number;
}
