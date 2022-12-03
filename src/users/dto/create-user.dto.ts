import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsMatch, IsUnique } from '../../utils/customValidators';
import {User, UserDocument} from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

export class CreateUserDto {
  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  phone: number;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsUnique('users', {
    column: 'email',
  })
  email: string;

  @ApiModelProperty({ type: String, minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiModelProperty({ type: String, minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsMatch('password', {
    message: 'Confirm Password field must match password',
  })
  confirmPassword: string;

  @ApiModelProperty({ type: String })
  referalCode: string;

  @ApiModelProperty({ type: String })
  @IsNotEmpty()
  username: string;

  @ApiModelProperty({ type: String })
  referee: string = null;

  newUser: UserDocument;
  status = false;
  errorMessage: string[] = [];
  token: string;
  role = 'user';
}
