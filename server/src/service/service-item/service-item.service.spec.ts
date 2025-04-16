import { Test, TestingModule } from "@nestjs/testing";
import { ServiceItemService } from "./service-item.service";

describe("ServiceItemService", () => {
  let service: ServiceItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceItemService],
    }).compile();

    service = module.get<ServiceItemService>(ServiceItemService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
