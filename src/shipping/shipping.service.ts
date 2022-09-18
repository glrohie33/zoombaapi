import { Injectable } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import * as qs from 'qs';
import axios from 'axios';
import { SHIPPINGDATAURL } from '../utils/config';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingDocument } from './entities/shipping.entity';

@Injectable()
export class ShippingService {
  constructor(
    private httpService: HttpService,
    @InjectModel('shippings') private shippingModel: Model<ShippingDocument>,
  ) {}

  create(createShippingDto: CreateShippingDto) {
    return 'This action adds a new shipping';
  }

  findAll() {
    return `This action returns all shipping`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipping`;
  }

  update(id: number, updateShippingDto: UpdateShippingDto) {
    return `This action updates a #${id} shipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipping`;
  }

  async getShippingToken() {
    let token = '';
    let shippingModel = await this.shippingModel.findOne({name:'redstar'});
    if(!shippingModel){
      shippingModel = await this.shippingModel.create({name:'redstar'});
    }
    const exp = new Date(shippingModel.expiresIn).getTime();
    const now = Date.now();
    if(shippingModel.token && exp>now){
      return shippingModel.token;
    }
    try {
      const config = {
        method: 'post',
        url: 'https://api.clicknship.com.ng/Token',
        data: qs.stringify({
          username: 'cnsdemoapiacct',
          password: 'ClickNShip$12345',
          grant_type: 'password',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const req = await axios(config);
      token = req.data.access_token;
      shippingModel.token = token;
      shippingModel.expiresIn = req.data['.expires'];
      shippingModel.save();
    } catch (e) {
      console.log('error', e);
    }
    return token;
  }
  async shippingData(type, data, req) {
    const protocol = 'https';
    const urldata = SHIPPINGDATAURL[type];
    let url = `${protocol}${urldata}`;
    console.log(data);
    if (data) {
      url += data;
    }
    const token = await this.getShippingToken();
    const shipppingData: any = {
      status: false,
      shippingData: [],
    };

    try {
      console.log(url);
      const data = await this.httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res.data));
      shipppingData.status = true;

      shipppingData.shippingData = await lastValueFrom(data);
    } catch (e) {
      console.log(e.message);
    }
    return shipppingData;
  }

  async getDeliveryPrice(
    createShippingDto: CreateShippingDto,
  ): Promise<CreateShippingDto> {
    const token = await this.getShippingToken();
    const postData: any = {
      Origin: createShippingDto.from,
      Destination: createShippingDto.to,
      Weight: createShippingDto.weight,
      PickupType: 1,
    };

    if (createShippingDto.forwarding) {
      postData.OnforwardingTownID = createShippingDto.forwarding;
    }
    try {
      const http = await this.httpService
        .post(
          'https://api.clicknship.com.ng/clicknship/Operations/DeliveryFee',
          postData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .pipe(map((res) => res.data));
      const data = await lastValueFrom(http);
      console.log(data);
      createShippingDto.status = true;
      createShippingDto.fee = data[0].TotalAmount;
    } catch (e) {
      createShippingDto.message = 'sorry could not get delivery price for now';
    }
    return createShippingDto;
  }
}
