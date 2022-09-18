import { Test, TestingModule } from '@nestjs/testing';
import { RaveService } from './rave.service';

describe('RaveService', () => {
  let service: RaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaveService],
    }).compile();

    service = module.get<RaveService>(RaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
