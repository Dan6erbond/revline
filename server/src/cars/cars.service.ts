import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "../users/user.entity";
import { Car } from "./car.entity";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: EntityRepository<Car>,
    private readonly em: EntityManager,
  ) {}

  async findById(id: string) {
    return this.carRepository.findOneOrFail({
      id,
    });
  }

  async create({
    owner,
    values,
  }: {
    owner: User;
    values: {
      name: string;
      make?: string | null;
      model?: string | null;
      year?: number | null;
    };
  }) {
    const car = new Car();

    car.owner = owner;
    Object.assign(car, values);

    await this.carRepository.insert(car);

    return car;
  }

  async update({
    id,
    values,
  }: {
    owner: User;
    id: string;
    values: {
      name?: string | null;
      make?: string | null;
      model?: string | null;
      year?: number | null;
    };
  }) {
    const car = await this.findById(id);
    Object.assign(car, values);

    await this.em.persistAndFlush(car);

    return car;
  }

  async findByOwner(owner: User) {
    return await this.carRepository.findAll({ where: { owner: owner.id } });
  }
}
