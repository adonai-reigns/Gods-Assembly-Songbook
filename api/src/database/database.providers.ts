import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

import { Song } from '../songs/song.entity';
import { Slide } from '../slides/slide.entity';
import { Screen } from 'src/screens/screen.entity';
import { Playlist, PlaylistSong } from 'src/playlists/playlist.entity';

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
            sequelize.addModels([Song, Slide, Screen, Playlist, PlaylistSong]);
            await sequelize.sync({ force: false, alter: false });
            return sequelize;
        },
        inject: [],
    },
];
