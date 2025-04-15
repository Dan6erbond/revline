import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { FuelCategory, OctaneRating } from "../graphql";

import { BaseEntity } from "../db/base.entity";
import { Car } from "../cars/cars.entity";

@Entity()
export class FuelUp extends BaseEntity {
  @ManyToOne(() => Car)
  car: Car;

  @Property()
  occurredAt: Date;

  @Property()
  station: string;

  @Property()
  amount: number;

  @Property({ type: "float" })
  cost: number;

  @Enum(() => FuelCategory)
  fuelCategory: FuelCategory;

  @Enum(() => OctaneRating)
  octane?: OctaneRating;

  @Property({ type: "float", nullable: true })
  odometerKm?: number;

  @Property({ nullable: true })
  notes?: string;

  @Property({ default: false })
  isFullTank: boolean = false;

  @Property({ nullable: true })
  locationLat?: number;

  @Property({ nullable: true })
  locationLng?: number;
}
