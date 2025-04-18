import { UseGuards } from "@nestjs/common";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { DragSessionsService } from "./drag-sessions.service";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CreateDragResultInput, CreateDragSessionInput } from "../graphql";
import { DragSession } from "./drag-session.entity";

@Resolver("DragSession")
export class DragSessionsResolver {
  constructor(private readonly dragSessionsService: DragSessionsService) {}

  @Query()
  async dragSession(@Args("id") id: string) {
    return await this.dragSessionsService.findById(id);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createDragSession(@Args("input") input: CreateDragSessionInput) {
    return await this.dragSessionsService.create(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createDragResult(@Args("input") input: CreateDragResultInput) {
    return await this.dragSessionsService.createResult(input);
  }

  @ResolveField()
  async car(@Parent() session: DragSession) {
    return await this.dragSessionsService.getCar(session);
  }

  @ResolveField()
  async results(@Parent() session: DragSession) {
    return await this.dragSessionsService.getResults(session);
  }
}
