import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { FileUpload } from "graphql-upload-ts";
import { v4 } from "uuid";
import { User } from "../users/users.entity";
import { Profile } from "./profile.entity";
import {
  DistanceUnit,
  FuelConsumptionUnit,
  FuelVolumeUnit,
  TemperatureUnit,
} from "../graphql";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: EntityRepository<Profile>,
    private readonly s3: S3Client,
    private readonly em: EntityManager,
  ) {}

  async getUserProfile(user: User) {
    if (user.profile) {
      return user.profile;
    }

    return await this.profileRepository.findOne({ user: user.id });
  }

  async updateProfile({
    user,
    ...values
  }: {
    user: User;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    currencyCode?: string | null;
    fuelVolumeUnit?: FuelVolumeUnit | null;
    distanceUnit?: DistanceUnit | null;
    fuelConsumptionUnit?: FuelConsumptionUnit | null;
    temperatureUnit?: TemperatureUnit | null;
    profilePicture?: string | null;
  }) {
    let profile = await this.getUserProfile(user);

    if (!profile) {
      profile = new Profile();

      profile.user = user;
    }

    Object.assign(profile, values);

    await this.em.persistAndFlush(profile);

    return profile;
  }

  async uploadProfilePicture({
    user,
    picture,
  }: {
    user: User;
    picture: Promise<FileUpload>;
  }) {
    const id = v4();
    const key = `${user.id}/profile-pictures/${id}`;

    const { createReadStream } = await picture;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: createReadStream(),
      },
    });

    await upload.done();

    return await this.updateProfile({ user, profilePicture: id });
  }
}
