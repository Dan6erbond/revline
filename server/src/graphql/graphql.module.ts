import { DateScalar } from "./date.scalar";
import { Module } from "@nestjs/common";

@Module({
  providers: [DateScalar],
})
export class GraphqlModule {}
