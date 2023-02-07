import { Collection } from "../models/index.js"
import fileService from './fileService.js'
import path from "path";
import config from "../config/config.js";
import log4js from 'log4js';

const logger = log4js.getLogger('CollectionService');
logger.level = 'debug';

export default {
    async createCollection(collectionData) {
        const collectionModel = Collection.build(collectionData);
        try{
            await collectionModel.save();
            await fileService.createDirectory(path.resolve(config.uploadsDir, collectionModel.name));
            logger.info('Collection saved: ', collectionModel.name);
        }
        catch(err) {
            logger.error('Error when creating collection ', err)
        }
    },
    async deleteCollection(colId) {
        const collectionModel = await Collection.findOne({
            where: {
                id: colId
             }
        });
        if(!collectionModel) {
            throw new Error(`Collection with id ${colId} does not exist`)
        }
        await fileService.deleteDirectory(path.resolve(config.uploadsDir, collectionModel.name));
        await collectionModel.destroy();
        logger.info(`Collection with id ${colId} removed.`);
    },
    async collectionExistsById(colId) {
        const collectionModel = await Collection.findOne({
            where: {
                id: colId
             }
        });
        return collectionModel !== null;
    }
}
