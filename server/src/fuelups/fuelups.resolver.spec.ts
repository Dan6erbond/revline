import { Test, TestingModule } from '@nestjs/testing';
import { FuelupsResolver } from './fuelups.resolver';

describe('FuelupsResolver', () => {
  let resolver: FuelupsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelupsResolver],
    }).compile();

    resolver = module.get<FuelupsResolver>(FuelupsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
