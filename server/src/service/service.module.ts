import { CarsModule } from "../cars/cars.module";
import { CarsResolver } from "./cars.resolver";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { OdometerReadingModule } from "../odometer-reading/odometer-reading.module";
import { ServiceItem } from "./service-item/service-item.entity";
import { ServiceItemResolver } from "./service-item/service-item.resolver";
import { ServiceItemService } from "./service-item/service-item.service";
import { ServiceLog } from "./service-log/service-log.entity";
import { ServiceLogResolver } from "./service-log/service-log.resolver";
import { ServiceLogService } from "./service-log/service-log.service";
import { ServiceSchedule } from "./service-schedule/service-schedule.entity";
import { ServiceScheduleResolver } from "./service-schedule/service-schedule.resolver";
import { ServiceScheduleService } from "./service-schedule/service-schedule.service";

@Module({
  imports: [
    CarsModule,
    MikroOrmModule.forFeature([ServiceLog, ServiceItem, ServiceSchedule]),
    OdometerReadingModule,
  ],
  providers: [
    ServiceScheduleService,
    ServiceScheduleResolver,
    ServiceItemResolver,
    ServiceItemService,
    ServiceLogService,
    ServiceLogResolver,
    CarsResolver,
  ],
})
export class ServiceModule {}
