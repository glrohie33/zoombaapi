import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsMatch, IsUnique } from '../../utils/customValidators';
import { User } from '../entities/user.entity';

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
  refferalCode: string;

  newUser: User;
  status = false;
  errorMessage: string[] = [];
  token: string;
}
