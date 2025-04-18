import { Test, TestingModule } from '@nestjs/testing';
import { DragSessionsService } from './drag-sessions.service';

describe('DragSessionsService', () => {
  let service: DragSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DragSessionsService],
    }).compile();

    service = module.get<DragSessionsService>(DragSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
