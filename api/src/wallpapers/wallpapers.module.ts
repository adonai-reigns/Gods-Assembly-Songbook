import { Module } from '@nestjs/common';
import { WallpapersController } from './wallpapers.controller';
import { WallpapersService } from './wallpapers.service';
import { wallpapersProviders } from './wallpapers.providers';

@Module({
  controllers: [WallpapersController],
  providers: [WallpapersService, ...wallpapersProviders]
})
export class WallpapersModule {}
