import { Test, TestingModule } from '@nestjs/testing';
import { CartFactoryService } from './cart-factory.service';

describe('CartFactoryService', () => {
  let service: CartFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartFactoryService],
    }).compile();

    service = module.get<CartFactoryService>(CartFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
