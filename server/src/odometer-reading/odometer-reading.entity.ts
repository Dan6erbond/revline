import { Entity, ManyToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { Car } from "../cars/cars.entity";

@Entity()
export class OdometerReading extends BaseEntity {
  @ManyToOne(() => Car)
  car!: Car;

  @Property({ type: "float" })
  readingKm!: number;

  @Property({ nullable: true })
  locationLat?: number;

  @Property({ nullable: true })
  locationLng?: number;

  @Property({ nullable: true })
  notes?: string;
}
