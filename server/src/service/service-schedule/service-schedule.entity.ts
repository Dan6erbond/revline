import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { BaseEntity } from "../../db/base.entity";
import { Car } from "../../cars/cars.entity";
import { ServiceItem } from "../service-item/service-item.entity";
import { ServiceLog } from "../service-log/service-log.entity";

@Entity()
export class ServiceSchedule extends BaseEntity {
  @ManyToOne(() => Car)
  car: Car;

  @Property()
  title: string;

  @Property({ nullable: true })
  notes?: string;

  @Property({ nullable: true })
  repeatEveryKm?: number;

  @Property({ nullable: true })
  repeatEveryMonths?: number;

  @Property({ nullable: true })
  startsAtKm?: number;

  @Property({ nullable: true })
  startsAtDate?: Date;

  @Property({ default: false })
  archived: boolean = false;

  @ManyToMany(() => ServiceItem)
  items = new Collection<ServiceItem>(this);

  @OneToMany({ entity: () => ServiceLog, mappedBy: (sl) => sl.schedule })
  logs = new Collection<ServiceLog>(this);
}
