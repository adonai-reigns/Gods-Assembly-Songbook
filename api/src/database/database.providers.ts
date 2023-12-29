import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

import { Song } from '../songs/song.entity';
import { Slide } from '../slides/slide.entity';
import { Screen } from 'src/screens/screen.entity';
import { Playlist, PlaylistSong } from 'src/playlists/playlist.entity';
import { Wallpaper, SystemWallpapers } from 'src/wallpapers/wallpaper.entity';

export const SequelizeConfig = {
    database: 'GodsAssemblySongbook',
    dialect: 'sqlite' as Dialect,
    username: 'root',
    password: '',
    storage: '.database/GodsAssemblySongbook.sqlite3'
};

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize(SequelizeConfig);
            sequelize.addModels([Song, Slide, Screen, Playlist, PlaylistSong, Wallpaper]);
            await sequelize.sync({ force: false, alter: false });

            // make sure default wallpaper is created
            const defaultWallpaperCount = await Wallpaper.count({
                where: {
                    id: 1
                }
            });
            if (defaultWallpaperCount < 1) {
                // create the system wallpaper
                for (let systemWallpaper of SystemWallpapers) {
                    Wallpaper.create({ ...systemWallpaper as Wallpaper });
                };
            }

            return sequelize;
        },
        inject: [],
    },
];
