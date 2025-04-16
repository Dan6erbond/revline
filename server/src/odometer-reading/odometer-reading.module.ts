import { CarsModule } from "../cars/cars.module";
import { CarsResolver } from "./cars.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { OdometerReading } from "./odometer-reading.entity";
import { OdometerReadingResolver } from "./odometer-reading.resolver";
import { OdometerReadingService } from "./odometer-reading.service";

@Module({
  imports: [CarsModule, MikroOrmModule.forFeature([OdometerReading])],
  providers: [OdometerReadingService, OdometerReadingResolver, CarsResolver],
  exports: [OdometerReadingService],
})
export class OdometerReadingModule {}
