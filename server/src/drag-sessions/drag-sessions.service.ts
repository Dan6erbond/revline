import { InjectRepository } from "@mikro-orm/nestjs";
import { DragResult, DragSession } from "./drag-session.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Car } from "../cars/cars.entity";
import { CarsService } from "../cars/cars.service";
import { DragResultUnit } from "../graphql";

@Injectable()
export class DragSessionsService {
  constructor(
    @InjectRepository(DragSession)
    private readonly dragSessionsRepository: EntityRepository<DragSession>,
    private readonly em: EntityManager,
    private readonly carsService: CarsService,
  ) {}

  async findById(id: string) {
    return await this.dragSessionsRepository.findOneOrFail({
      id,
    });
  }

  async create({
    carId,
    ...values
  }: {
    carId: string;
    title: string;
    notes?: string | null;
  }) {
    const session = new DragSession();

    const car = await this.carsService.findById(carId);

    session.car = car;

    Object.assign(session, values);

    await this.em.persistAndFlush(session);

    return session;
  }

  async createResult({
    sessionId,
    ...values
  }: {
    sessionId: string;
    unit: DragResultUnit;
    value: number;
    result: number;
    notes?: string | null;
  }) {
    const session = await this.findById(sessionId);

    const result = new DragResult();
    result.session = session;

    Object.assign(result, values);

    await this.em.persistAndFlush(result);

    return result;
  }

  async findByCar(car: Car) {
    return await this.dragSessionsRepository.findAll({
      where: { car: car.id },
    });
  }

  async getCar(session: DragSession) {
    if (!session.car) {
      await this.em.populate(session, ["car"]);
    }

    return session.car;
  }

  async getResults(session: DragSession) {
    if (!session.results.isInitialized()) {
      await this.em.populate(session, ["results"]);
    }

    return session.results;
  }

  async getSession(result: DragResult) {
    if (!result.session) {
      await this.em.populate(result, ["session"]);
    }

    return result.session;
  }
}
