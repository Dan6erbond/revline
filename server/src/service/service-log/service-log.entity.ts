import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
} from "@mikro-orm/core";

import { BaseEntity } from "../../db/base.entity";
import { Car } from "../../cars/cars.entity";
import { OdometerReading } from "../../odometer-reading/odometer-reading.entity";
import { ServiceItem } from "../service-item/service-item.entity";
import { ServiceSchedule } from "../service-schedule/service-schedule.entity";

@Entity()
export class ServiceLog extends BaseEntity {
  @ManyToOne(() => Car)
  car!: Car;

  @Property()
  datePerformed!: Date;

  @OneToOne(() => OdometerReading, { nullable: true })
  odometerReading?: OdometerReading;

  @Property({ nullable: true })
  notes?: string;

  @ManyToMany(() => ServiceItem)
  serviceItems = new Collection<ServiceItem>(this);

  @ManyToOne({ nullable: true, entity: () => ServiceSchedule })
  schedule?: ServiceSchedule;

  @Property({ nullable: true })
  performedBy?: string;
}
