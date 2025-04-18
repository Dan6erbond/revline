import { InjectRepository } from "@mikro-orm/nestjs";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Media } from "./media.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Car } from "../cars/cars.entity";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { CarsService } from "../cars/cars.service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: EntityRepository<Media>,
    private readonly em: EntityManager,
    private readonly s3: S3Client,
    @Inject(forwardRef(() => CarsService))
    private readonly carService: CarsService,
  ) {}

  async upload({ carId }: { carId: string }) {
    const car = await this.carService.findById(carId);

    const media = new Media();
    media.car = car;

    await this.em.persistAndFlush(media);

    if (!car.owner) {
      await this.em.populate(car, ["owner"]);
    }

    const key = `${car.owner.id}/cars/${car.id}/media/${media.id}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60 * 5,
    });

    return { uploadUrl: signedUrl, media };
  }

  async findByCar(car: Car) {
    return this.mediaRepository.findAll({ where: { car: car.id } });
  }
}
