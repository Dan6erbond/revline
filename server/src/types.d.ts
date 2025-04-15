import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { User } from "./users/users.entity";
import { Request } from "express";

declare module "@nestjs/graphql" {
  interface GqlExecutionContext extends ExecutionContextHost {
    user: User;
    req: Request;
  }
}
