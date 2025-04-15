import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { Profile } from "./profile.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
  ) {}

  async getUserProfile(user: User) {
    if (user.profile) {
      return user.profile;
    }

    return await this.profileRepository.findOne({ user: user.id });
  }
}
