import { Test, TestingModule } from "@nestjs/testing";

import { DragResultsResolver } from "./drag-results.resolver";

describe("DragResultsResolver", () => {
  let resolver: DragResultsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DragResultsResolver],
    }).compile();

    resolver = module.get<DragResultsResolver>(DragResultsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
