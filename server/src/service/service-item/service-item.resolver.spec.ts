import { Test, TestingModule } from "@nestjs/testing";
import { ServiceItemResolver } from "./service-item.resolver";

describe("ServiceItemResolver", () => {
  let resolver: ServiceItemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceItemResolver],
    }).compile();

    resolver = module.get<ServiceItemResolver>(ServiceItemResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
