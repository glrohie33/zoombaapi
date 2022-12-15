import { Test, TestingModule } from '@nestjs/testing';
import { CarbonZeroServiceService } from './carbon-zero-service.service';

describe('CarbonZeroServiceService', () => {
  let service: CarbonZeroServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarbonZeroServiceService],
    }).compile();

    service = module.get<CarbonZeroServiceService>(CarbonZeroServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
