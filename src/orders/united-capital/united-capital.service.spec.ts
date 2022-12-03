import { Test, TestingModule } from '@nestjs/testing';
import { UnitedCapitalService } from './united-capital.service';

describe('UnitedCapitalService', () => {
  let service: UnitedCapitalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitedCapitalService],
    }).compile();

    service = module.get<UnitedCapitalService>(UnitedCapitalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
