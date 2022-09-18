import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Store } from '../entities/store.entity';
import { IsMatch, IsUnique } from '../../utils/customValidators';
import { UserDocument } from '../../users/entities/user.entity';
import { Dto } from '../../extensions/dto';

export class CreateStoreDto extends Dto {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  entity: string;

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  accountManager: string;

  @ApiModelProperty({ type: String })
  additionalPhone = '';

  @ApiModelProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsMatch('password')
  confirmPassword: string;

  store: Store;
  userModel: UserDocument;
  user: string;
  status = false;
}
