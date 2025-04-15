import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findById(id: string) {
    return await this.userRepository.findOneOrFail({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne(
      { email },
      { populate: ["profile"] },
    );
  }

  async create(values: { email: string }) {
    const user = new User();

    Object.assign(user, values);

    await this.em.persistAndFlush(user);

    return values;
  }
}
