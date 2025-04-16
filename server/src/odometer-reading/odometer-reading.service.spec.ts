import { Test, TestingModule } from "@nestjs/testing";

import { OdometerReadingService } from "./odometer-reading.service";

describe("OdometerReadingService", () => {
  let service: OdometerReadingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdometerReadingService],
    }).compile();

    service = module.get<OdometerReadingService>(OdometerReadingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
