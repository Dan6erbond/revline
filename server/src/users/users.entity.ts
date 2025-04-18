import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { Car } from "../cars/cars.entity";
import { Profile } from "../profile/profile.entity";

@Entity()
export class User extends BaseEntity {
  @Property()
  email: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Car, (car) => car.owner)
  cars = new Collection<Car>(this);
}
