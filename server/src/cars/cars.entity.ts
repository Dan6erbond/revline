import { Entity, ManyToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { User } from "../users/users.entity";

@Entity()
export class Car extends BaseEntity {
  @ManyToOne(() => User)
  owner: User;

  @Property()
  name: string;

  @Property()
  make: string;

  @Property()
  model: string;

  @Property()
  year: number;

  @Property({ type: "uuid", nullable: true })
  bannerImage: string;
}
