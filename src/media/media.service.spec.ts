import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModel } from './entities/media.entity';
import mongourl from '../utils/mongourl';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongourl.url),
        MongooseModule.forFeature([MediaModel]),
      ],
      providers: [MediaService],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
