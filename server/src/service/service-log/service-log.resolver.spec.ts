import { Test, TestingModule } from '@nestjs/testing';
import { ServiceLogResolver } from './service-log.resolver';

describe('ServiceLogResolver', () => {
  let resolver: ServiceLogResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceLogResolver],
    }).compile();

    resolver = module.get<ServiceLogResolver>(ServiceLogResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
