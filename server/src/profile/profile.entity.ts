import { Entity, OneToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { User } from "../users/user.entity";

@Entity()
export class Profile extends BaseEntity {
  @OneToOne()
  user: User;

  @Property()
  username: string;
}
