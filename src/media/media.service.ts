import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaDocument } from './entities/media.entity';
import * as mongoose from 'mongoose';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { ProductDocument } from '../products/entities/product.entity';
import { Params } from './dto/params';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel('medias') private mediaModel: Model<MediaDocument>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}
  async create(createMediaDto: CreateMediaDto): Promise<CreateMediaDto> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const media = await this.mediaModel.create(createMediaDto);
      createMediaDto.status = true;
      createMediaDto.media = media;
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
      console.log(e.message);
      createMediaDto.message =
        'There is an error creating media please try again later';
    } finally {
      await session.endSession();
    }
    return createMediaDto;
  }

  async findAll(params: Params): Promise<Array<MediaDocument>> {
    let medias: MediaDocument[] = [];
    const filter = {};
    const { fileType, perPage, currentPage, sort } = params;
    console.log(currentPage);
    try {
      medias = await this.mediaModel
        .find(filter)
        .sort({ createdAt: sort })
        .regex('fileType', fileType)
        .skip((currentPage - 1) * perPage)
        .limit(params.perPage);
    } catch (e) {}
    return medias;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }

  async uploadImage(
    file: Express.Multer.File,
    model,
    docModel,
    createMediaDto: CreateMediaDto = null,
  ): Promise<MediaDocument> {
    if (!createMediaDto) {
      createMediaDto = new CreateMediaDto();
    }

    createMediaDto.name = file.filename;
    createMediaDto.fileType = file.mimetype;
    createMediaDto.model = model;
    createMediaDto.docModel = docModel;
    createMediaDto.url = process.env.BASE_URL + '\\' + file.path;

    const { status, media } = await this.create(createMediaDto);
    if (!status) {
      throw new Error('error uploading file');
    }
    return <MediaDocument>media;
  }

  async uploadFiles(
    files: Array<Express.Multer.File>,
    model,
    docModel,
  ): Promise<Array<MediaDocument>> {
    const uploadedFiles: MediaDocument[] = [];
    for (const file of files) {
      const uploadedFile = await this.uploadImage(file, model, docModel);
      uploadedFiles.push(uploadedFile);
    }
    return uploadedFiles;
  }

  deleteImages(model: string, docModel: string, images: string[]) {
    this.mediaModel
      .deleteMany({ model, docModel, url: { $in: images } })
      .then((r) => true);
  }
}
