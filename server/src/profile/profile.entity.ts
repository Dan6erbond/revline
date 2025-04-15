import { Entity, OneToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { User } from "../users/users.entity";

@Entity()
export class Profile extends BaseEntity {
  @OneToOne(() => User)
  user: User;

  @Property()
  username: string;
}
