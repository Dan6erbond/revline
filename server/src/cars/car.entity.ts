import { Entity, ManyToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { User } from "../graphql";

@Entity()
export class Car extends BaseEntity {
  @ManyToOne()
  owner: User;

  @Property()
  name: string;

  @Property()
  make: string;

  @Property()
  model: string;

  @Property()
  year: number;
}
