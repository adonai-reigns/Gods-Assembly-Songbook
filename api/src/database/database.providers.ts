import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

import { Song } from '../songs/song.entity';
import { Slide } from '../slides/slide.entity';

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
            sequelize.addModels([Song, Slide]);
            await sequelize.sync({ force: false, alter: false });
            return sequelize;
        },
        inject: [],
    },
];
