import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from "@mikro-orm/core";

import { BaseEntity } from "../../db/base.entity";
import { Car } from "../../cars/cars.entity";
import { ServiceSchedule } from "../service-schedule/service-schedule.entity";

@Entity()
export class ServiceItem extends BaseEntity {
  @ManyToOne(() => Car)
  car!: Car;

  @Property()
  label: string;

  @Property({ nullable: true })
  notes?: string;

  @Property({ nullable: true })
  estimatedDuration?: number; // in minutes

  @Property({ nullable: true })
  defaultIntervalKm?: number;

  @Property({ nullable: true })
  defaultIntervalMonths?: number;

  @ManyToMany(() => ServiceSchedule, (schedule) => schedule.items)
  schedules = new Collection<ServiceSchedule>(this);

  @Property({ type: "string[]", default: [] })
  tags: string[] = [];
}
