import { Test, TestingModule } from "@nestjs/testing";

import { OdometerReadingResolver } from "./odometer-reading.resolver";

describe("OdometerReadingResolver", () => {
  let resolver: OdometerReadingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdometerReadingResolver],
    }).compile();

    resolver = module.get<OdometerReadingResolver>(OdometerReadingResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
