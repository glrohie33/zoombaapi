import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiModelProperty({ type: String })
  email: string;

  @ApiModelProperty({ type: String, minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @Allow()
  status = false;

  @Allow()
  errorMessage = 'invalid credentials';
  user: { firstname; lastname; email; role; id };
  token = '';
}
