import { CarsModule } from "../cars/cars.module";
import { CarsResolver } from "./cars.resolver";
import { FuelUp } from "./fuelups.entity";
import { FuelupsResolver } from "./fuelups.resolver";
import { FuelupsService } from "./fuelups.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

@Module({
  imports: [MikroOrmModule.forFeature([FuelUp]), CarsModule],
  providers: [FuelupsResolver, FuelupsService, CarsResolver],
})
export class FuelupsModule {}
