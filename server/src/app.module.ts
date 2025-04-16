import { YogaDriver, YogaDriverConfig } from "@graphql-yoga/nestjs";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CarsModule } from "./cars/cars.module";
import { ConfigModule } from "@nestjs/config";
import { FuelupsModule } from "./fuelups/fuelups.module";
import { GraphQLModule } from "@nestjs/graphql";
import { GraphqlModule } from "./graphql/graphql.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProfileModule } from "./profile/profile.module";
import { UsersModule } from "./users/users.module";
import config from "./mikro-orm.config";
import { join } from "path";
import { OdometerReadingModule } from './odometer-reading/odometer-reading.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<YogaDriverConfig>({
      driver: YogaDriver,
      typePaths: ["./**/*.graphql"],
      definitions: {
        path: join(process.cwd(), "src/graphql.ts"),
      },
    }),
    MikroOrmModule.forRoot(config),
    AuthModule,
    ProfileModule,
    UsersModule,
    CarsModule,
    FuelupsModule,
    GraphqlModule,
    OdometerReadingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
