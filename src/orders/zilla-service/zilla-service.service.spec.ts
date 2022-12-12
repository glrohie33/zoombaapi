import { Test, TestingModule } from '@nestjs/testing';
import { ZillaServiceService } from './zilla-service.service';

describe('ZillaServiceService', () => {
  let service: ZillaServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZillaServiceService],
    }).compile();

    service = module.get<ZillaServiceService>(ZillaServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
