import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "../users/users.entity";
import { Car } from "./cars.entity";
import { FileUpload } from "graphql-upload-ts";
import { v4 } from "uuid";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: EntityRepository<Car>,
    private readonly em: EntityManager,
    private readonly s3: S3Client,
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
      bannerImage?:string|null
    };
  }) {
    const car = await this.findById(id);
    Object.assign(car, values);

    await this.em.persistAndFlush(car);

    return car;
  }

  async uploadBannerImage({
    car,
    image,
  }: {
    car: Car;
    image: Promise<FileUpload>;
  }) {
    const id = v4();

    if (!car.owner) {
      await this.em.populate(car, ["owner"]);
    }

    const key = `${car.owner.id}/cars/${car.id}/banner-images/${id}`;

    const { createReadStream } = await image;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: createReadStream(),
      },
    });

    await upload.done();

    return await this.update({ id: car.id, values: { bannerImage: id } });
  }

  async findByOwner(owner: User) {
    return await this.carRepository.findAll({ where: { owner: owner.id } });
  }
}
