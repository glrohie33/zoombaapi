import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../paymentGateway';
import { v5 as uuid5 } from 'uuid';
import * as FlutterWave from 'flutterwave-node-v3';
import { VerifyOrderDto } from '../dto/verfy-order.dto';
@Injectable()
export class RaveService implements PaymentGateway {
  instance:any;
  constructor(){
    this.instance = new FlutterWave(process.env.FLW_PUBLIC_KEY,process.env.FLW_SECRET_KEY);
  }
  generateRef(orderId): string {
    return uuid5('ravepay'+orderId,uuid5.URL);
  }

  async verifyPayment(verifyOrderDto: VerifyOrderDto): Promise<VerifyOrderDto> {
    try{
        const resp = await this.instance.Transaction.verify({id:verifyOrderDto.data.transactionId})
        console.log(resp);
          if(resp.data.status === "successful"){
            verifyOrderDto.status = true;
          }
    }catch(e){
      console.log(e.message);
        verifyOrderDto.message = ['error verifying order'];
    }
   return verifyOrderDto;
  }

}

