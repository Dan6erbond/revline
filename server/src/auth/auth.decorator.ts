import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { GqlExecutionContext } from "@nestjs/graphql";
import { User as UserModel } from "../users/user.entity";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserModel =>
    GqlExecutionContext.create(ctx).getContext().user,
);
