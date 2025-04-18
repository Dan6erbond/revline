import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { User } from "../users/users.entity";
import { Car } from "./cars.entity";
import { FileUpload } from "graphql-upload-ts";
import { v4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { MediaService } from "../media/media.service";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: EntityRepository<Car>,
    private readonly em: EntityManager,
    private readonly s3: S3Client,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService,
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
    id: string;
    values: {
      name?: string | null;
      make?: string | null;
      model?: string | null;
      year?: number | null;
      bannerImage?: string | null;
    };
  }) {
    const car = await this.findById(id);
    Object.assign(car, values);

    await this.em.persistAndFlush(car);

    return car;
  }

  async uploadBannerImage({ car }: { car: Car }) {
    const { uploadUrl, media } = await this.mediaService.upload({
      carId: car.id,
    });

    car.bannerImage = media;

    await this.em.persistAndFlush(car);

    return { uploadUrl, media };
  }

  async findByOwner(owner: User) {
    return await this.carRepository.findAll({ where: { owner: owner.id } });
  }
}
