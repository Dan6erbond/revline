import { Entity, ManyToOne } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { Car } from "../cars/cars.entity";

@Entity()
export class Media extends BaseEntity {
  @ManyToOne(() => Car)
  car: Car;
}
