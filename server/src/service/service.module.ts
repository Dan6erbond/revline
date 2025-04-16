import { Module } from "@nestjs/common";
import { ServiceScheduleService } from "./service-schedule/service-schedule.service";
import { ServiceScheduleResolver } from "./service-schedule/service-schedule.resolver";
import { ServiceItemResolver } from "./service-item/service-item.resolver";
import { ServiceItemService } from "./service-item/service-item.service";

@Module({
  imports: [],
  providers: [
    ServiceScheduleService,
    ServiceScheduleResolver,
    ServiceItemResolver,
    ServiceItemService,
  ],
})
export class ServiceModule {}
