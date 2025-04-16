import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../db/base.entity";
import { ServiceSchedule } from "../service-schedule/service-schedule.entity";

@Entity()
export class ServiceItem extends BaseEntity {
  @Property()
  label: string;

  @Property({ nullable: true })
  notes?: string;

  @ManyToMany(() => ServiceSchedule, (schedule) => schedule.items)
  schedules = new Collection<ServiceSchedule>(this);
}
