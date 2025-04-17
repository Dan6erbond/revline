import { Test, TestingModule } from '@nestjs/testing';
import { ServiceLogService } from './service-log.service';

describe('ServiceLogService', () => {
  let service: ServiceLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceLogService],
    }).compile();

    service = module.get<ServiceLogService>(ServiceLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
