import { Car } from "./car.entity";
import { CarsResolver } from "./cars.resolver";
import { CarsService } from "./cars.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

@Module({
  imports: [MikroOrmModule.forFeature([Car])],
  providers: [CarsService, CarsResolver],
})
export class CarsModule {}
