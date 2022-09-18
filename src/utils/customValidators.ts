import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { UserSchema } from '../users/entities/user.entity';

interface IsUniqueOptions extends ValidationOptions {
  column: string;
}

export function IsMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value == relatedValue
          ); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}

const model = mongoose.model('users', UserSchema);
export function IsUnique(
  property: string,
  validationOptions?: IsUniqueOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const { column } = validationOptions;
          const search = {};
          if (column) {
            search[column] = value;
          } else {
            search['id'] =  value ;
          }

          const relatedValue = (args.object as any)[relatedPropertyName];
          return true; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}

