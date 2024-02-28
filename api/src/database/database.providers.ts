import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

import { Song } from '../songs/song.entity';
import { Slide } from '../slides/slide.entity';
import { Screen } from 'src/screens/screen.entity';
import { Playlist, PlaylistSong } from 'src/playlists/playlist.entity';
import { Wallpaper, SystemWallpapers } from 'src/wallpapers/wallpaper.entity';
import { Setting, defaultSettings, settingsAttributes } from 'src/settings/settings.entity';
import { SongCopyright } from 'src/songs/songCopyright.entity';

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
            sequelize.addModels([Song, SongCopyright, Slide, Screen, Playlist, PlaylistSong, Wallpaper, Setting]);
            await sequelize.sync({ force: false, alter: false });

            // @todo: enables forced database re-creation (only use for development!)
            // await sequelize.sync({ force: true, alter: true });

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

            defaultSettings.map(async (defaultSetting: settingsAttributes) => {
                // make sure default setting is created
                const defaultSettingCount = await Setting.count({
                    where: {
                        id: defaultSetting.id
                    }
                });
                if (defaultSettingCount < 1) {
                    // create the setting
                    Setting.create({ ...defaultSetting as Setting });
                }
            });

            return sequelize;
        },
        inject: [],
    },
];
