import { Test, TestingModule } from "@nestjs/testing";
import { ServiceScheduleResolver } from "./service-schedule.resolver";

describe("ServiceScheduleResolver", () => {
  let resolver: ServiceScheduleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceScheduleResolver],
    }).compile();

    resolver = module.get<ServiceScheduleResolver>(ServiceScheduleResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
