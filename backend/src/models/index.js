import config from '../config/config.js';
import { Sequelize } from 'sequelize';
import initCollectionModel from './collection.js';

export const db = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
);

try {
  await db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

;

export const Collection = initCollectionModel(db);
