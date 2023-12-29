import { Test, TestingModule } from '@nestjs/testing';
import { WallpapersService } from './wallpapers.service';

describe('WallpapersService', () => {
  let service: WallpapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WallpapersService],
    }).compile();

    service = module.get<WallpapersService>(WallpapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
