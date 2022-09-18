import { Test, TestingModule } from '@nestjs/testing';
import { PaymentOptionsController } from './payment-options.controller';
import { PaymentOptionsService } from './payment-options.service';

describe('PaymentOptionsController', () => {
  let controller: PaymentOptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentOptionsController],
      providers: [PaymentOptionsService],
    }).compile();

    controller = module.get<PaymentOptionsController>(PaymentOptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
