import {
  Entity,
  ManyToOne,
  Property,
  Collection,
  ManyToMany,
} from "@mikro-orm/core";
import { BaseEntity } from "../../db/base.entity";
import { Car } from "../../cars/cars.entity";
import { ServiceItem } from "../service-item/service-item.entity";

export enum RecurrenceUnit {
  DAYS = "DAYS",
  MONTHS = "MONTHS",
  YEARS = "YEARS",
}

@Entity()
export class ServiceSchedule extends BaseEntity {
  @ManyToOne(() => Car)
  car: Car;

  @Property()
  title: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ default: true })
  active: boolean = true;

  @Property({ nullable: true })
  intervalValue?: number;

  @Property({ nullable: true })
  intervalUnit?: RecurrenceUnit;

  @Property({ nullable: true })
  intervalKm?: number;

  @ManyToMany(() => ServiceItem)
  items = new Collection<ServiceItem>(this);
}
