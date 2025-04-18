import { Module, forwardRef } from "@nestjs/common";

import { Car } from "./cars.entity";
import { CarsResolver } from "./cars.resolver";
import { CarsService } from "./cars.service";
import { MediaModule } from "../media/media.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [MikroOrmModule.forFeature([Car]), forwardRef(() => MediaModule)],
  providers: [CarsService, CarsResolver],
  exports: [CarsService],
})
export class CarsModule {}
