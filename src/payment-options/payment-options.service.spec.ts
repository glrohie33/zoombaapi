import { Test, TestingModule } from '@nestjs/testing';
import { PaymentOptionsService } from './payment-options.service';

describe('PaymentOptionsService', () => {
  let service: PaymentOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentOptionsService],
    }).compile();

    service = module.get<PaymentOptionsService>(PaymentOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
