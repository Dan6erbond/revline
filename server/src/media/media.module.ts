import { Module, forwardRef } from "@nestjs/common";

import { CarsModule } from "../cars/cars.module";
import { CarsResolver } from "./cars.resolver";
import { Media } from "./media.entity";
import { MediaResolver } from "./media.resolver";
import { MediaService } from "./media.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
  imports: [MikroOrmModule.forFeature([Media]), forwardRef(() => CarsModule)],
  providers: [MediaService, MediaResolver, CarsResolver],
  exports: [MediaService],
})
export class MediaModule {}
