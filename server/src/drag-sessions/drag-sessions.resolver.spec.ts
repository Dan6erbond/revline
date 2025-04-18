import { Test, TestingModule } from "@nestjs/testing";

import { DragSessionsResolver } from "./drag-sessions.resolver";

describe("DragSessionsResolver", () => {
  let resolver: DragSessionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DragSessionsResolver],
    }).compile();

    resolver = module.get<DragSessionsResolver>(DragSessionsResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
