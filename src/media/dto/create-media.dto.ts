import { IsNotEmpty, IsString } from 'class-validator';
import { Dto } from '../../extensions/dto';
import { Media } from '../entities/media.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto extends Dto {
  constructor() {
    super();
  }
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];

  name: string;
  title: string;
  link: string;
  fileType: string;
  url: string;
  user: string;
  model: string;
  docModel: string;

  get media(): Media {
    return this._media;
  }

  set media(value: Media) {
    this._media = value;
  }

  private _media: Media;
}
