import { Test, TestingModule } from '@nestjs/testing';
import { FuelupsService } from './fuelups.service';

describe('FuelupsService', () => {
  let service: FuelupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelupsService],
    }).compile();

    service = module.get<FuelupsService>(FuelupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
