import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { DragResult } from "./drag-session.entity";
import { DragSessionsService } from "./drag-sessions.service";

@Resolver("DragResult")
export class DragResultsResolver {
  constructor(private readonly dragSessionsService: DragSessionsService) {}

  @ResolveField()
  async session(@Parent() result: DragResult) {
    return await this.dragSessionsService.getSession(result);
  }
}
