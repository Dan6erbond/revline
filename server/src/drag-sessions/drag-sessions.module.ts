import { DragResult, DragSession } from "./drag-session.entity";

import { CarsModule } from "../cars/cars.module";
import { CarsResolver } from "./cars.resolver";
import { DragResultsResolver } from "./drag-results.resolver";
import { DragSessionsResolver } from "./drag-sessions.resolver";
import { DragSessionsService } from "./drag-sessions.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

@Module({
  imports: [MikroOrmModule.forFeature([DragSession, DragResult]), CarsModule],
  providers: [
    DragSessionsService,
    DragSessionsResolver,
    CarsResolver,
    DragResultsResolver,
  ],
})
export class DragSessionsModule {}
