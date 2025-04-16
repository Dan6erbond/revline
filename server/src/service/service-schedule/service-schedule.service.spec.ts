import { Test, TestingModule } from "@nestjs/testing";
import { ServiceScheduleService } from "./service-schedule.service";

describe("ServiceScheduleService", () => {
  let service: ServiceScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceScheduleService],
    }).compile();

    service = module.get<ServiceScheduleService>(ServiceScheduleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
