import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ServiceItemService } from "./service-item.service";
import { AuthGuard, AuthRequired } from "../../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { CreateServiceItemInput, UpdateServiceItemInput } from "../../graphql";
import { ServiceItem } from "./service-item.entity";

@Resolver("ServiceItem")
export class ServiceItemResolver {
  constructor(private readonly serviceItemsService: ServiceItemService) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createServiceItem(@Args("input") input: CreateServiceItemInput) {
    return await this.serviceItemsService.createServiceItem(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async updateServiceItem(@Args("input") input: UpdateServiceItemInput) {
    return await this.serviceItemsService.updateServiceItem(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async deleteServiceItem(@Args("id") id: string) {
    return await this.serviceItemsService.deleteServiceItem(id);
  }

  @ResolveField()
  async car(@Parent() serviceItem: ServiceItem) {
    return await this.serviceItemsService.getCar(serviceItem);
  }
}
