import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { Car } from "../cars/cars.entity";
import { DragResultUnit } from "../graphql";

@Entity()
export class DragSession extends BaseEntity {
  @ManyToOne(() => Car)
  car: Car;

  @Property()
  title: string;

  @Property({ nullable: true })
  notes?: string;

  @OneToMany(() => DragResult, (result) => result.session)
  results = new Collection<DragResult>(this);
}

@Entity()
export class DragResult extends BaseEntity {
  @ManyToOne(() => DragSession)
  session: DragSession;

  @Enum(() => DragResultUnit)
  unit: DragResultUnit;

  @Property({ type: "float" })
  value: number;

  @Property({ type: "float" })
  result: number;

  @Property({ nullable: true })
  notes?: string;
}
