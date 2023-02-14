import { Collection } from "../models/index.js"
import fileService from './fileService.js'
import imageService from './imageService.js'
import path from "path";
import config from "../config/config.js";
import log4js from 'log4js';

const logger = log4js.getLogger('CollectionService');
logger.level = 'debug';

const __dir = path.resolve();

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
    async getCollectionImageList(collectionId) {
        if(await this.collectionExistsById(collectionId)) {
            return await imageService.getImagesFromCollection(collectionId);
        }
    },
    async deleteCollection(collectionData) {
        const collectionModel = await Collection.findOne({
            where: {
                id: collectionData
             }
        });
        if(!collectionModel) {
            throw new Error(`Collection with id ${collectionData} does not exist`)
        }
        await fileService.deleteDirectory(path.resolve(config.uploadsDir, collectionModel.name));
        await collectionModel.destroy();
        logger.info(`Collection with id ${collectionData} removed.`);
    },
    async collectionExistsById(collectionData) {
        const collectionModel = await Collection.findOne({
            where: {
                id: collectionData
             }
        });
        return collectionModel !== null;
    },
    async prepareCollectionDirectory(collectionId) {
        const {collectionPath, origsPath, thumbsPath, defaultsPath} = this.getCollectionPaths(collectionId);
        if(!await fileService.dirExists(collectionPath) ){
            await fileService.createDirectory(collectionPath);
        }
        if(!await fileService.dirExists(origsPath) ){
            await fileService.createDirectory(origsPath);
        }
        if(!await fileService.dirExists(thumbsPath) ){
            await fileService.createDirectory(thumbsPath);
        }
        if(!await fileService.dirExists(defaultsPath) ){
            await fileService.createDirectory(defaultsPath);
        }
        return {collectionPath, origsPath, thumbsPath, defaultsPath};
    },
    getCollectionPaths(collectionId) {
        const collectionPath = path.resolve(__dir, config.uploadsDir, collectionId);
        const origsPath = path.resolve(collectionPath, 'origs');
        const thumbsPath = path.resolve(collectionPath, 'thumbs');
        const defaultsPath = path.resolve(collectionPath, 'defaults');
        return {
            collectionPath,
            origsPath,
            thumbsPath,
            defaultsPath
        }
    },
}
