import { User, UserDocument } from '../users/entities/user.entity';
import { Request as ExpressRequest } from 'express';
import * as multer from 'multer';
import { model, Model } from 'mongoose';
import { MediaDocument } from '../media/entities/media.entity';
import { mkdir } from 'fs';

export const JWT_TOKEN = 'ASDKNGLKADKNG';
export const JWT_EXPIRES = '2d';
export const COOKIE_NAME = 'zoombajwttoken';
export const COOKIE_EXPIRE: Date = new Date(
  Date.now() + 2 * 24 * 60 * 60 * 1000,
);
export const STORAGE_PATH = './public/data/uploads/';
export const ZOOMBACART = 'zoombaCart';
export const KAMPECART = 'zoombaKampeCart';
export const SHIPPINGDATAURL = {
  states: '://api.clicknship.com.ng/clicknship/Operations/States',
  city: '://api.clicknship.com.ng/clicknship/Operations/StateCities?StateName=',
  town: '://api.clicknship.com.ng/clicknship/Operations/DeliveryTowns?CityCode=',
};

const enviroment = process.env.APP_ENV;

if (enviroment == 'development') {
  const ALLOWEDLIST = ['http://seller.dev.zoomba.ng', 'http://dev.zoomba.ng'];
} else if (enviroment == 'production') {
  const ALLOWEDLIST = ['https://seller.zoomba.ng', 'https://zoomba.ng'];
} else {
  const ALLOWEDLIST = ['http://localhost:4000', 'http://localhost:5000'];
}

export interface Request extends ExpressRequest {
  user: UserDocument;
}

async function makeDirectory(dest, cb) {
  await mkdir(
    dest,
    {
      recursive: true,
    },
    (err, path) => {
      if (!err) {
        cb(null, dest);
      }
    },
  );
}

export const uploadFileHelper = (dest) => {
  return multer.diskStorage({
    destination: async function (req, file, cb) {
      const finalDestination = './public' + dest;
      await makeDirectory(finalDestination, cb);
    },
    filename: async function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${file.originalname}`);
    },
  });
};

export const filterObject = (object) => {
  console.log(object);
  const entries = Object.entries(object);
  console.log(entries);
  return Object.fromEntries(
    entries.filter((entry: [string, string | any[]]) => {
      let status = false;
      const data = entry[1];
      if (Array.isArray(data)) {
        status = data.length > 0;
      } else {
        status = Boolean(data);
      }
      return status;
    }),
  );
};
