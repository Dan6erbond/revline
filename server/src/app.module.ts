import { YogaDriver, YogaDriverConfig } from "@graphql-yoga/nestjs";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CarsModule } from "./cars/cars.module";
import { ConfigModule } from "@nestjs/config";
import { FuelupsModule } from "./fuelups/fuelups.module";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphQLUpload } from "graphql-upload-ts";
import { GraphqlModule } from "./graphql/graphql.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { OdometerReadingModule } from "./odometer-reading/odometer-reading.module";
import { ProfileModule } from "./profile/profile.module";
import { S3Module } from "./s3/s3.module";
import { UsersModule } from "./users/users.module";
import config from "./mikro-orm.config";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      typePaths: ["./**/*.graphql"],
      definitions: {
        path: join(process.cwd(), "src/graphql.ts"),
      },
      resolvers: { Upload: GraphQLUpload },
    }),
    MikroOrmModule.forRoot(config),
    AuthModule,
    ProfileModule,
    UsersModule,
    CarsModule,
    FuelupsModule,
    GraphqlModule,
    OdometerReadingModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
