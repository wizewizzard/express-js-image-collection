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
            await this.prepareCollectionDirectory(collectionModel.id);
            logger.info('Collection created: ', collectionModel.name);
            return { id: collectionModel.id };
        }
        catch(err) {
            logger.error('Error when creating collection ', err);
            throw err;
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
        logger.debug(`Preparing directory for collection id ${collectionId}`);
        const {collectionPath, origsPath, thumbsPath, defaultsPath} = this.getCollectionDirectories(collectionId);
        return Promise.all(
            [collectionPath, origsPath, thumbsPath, defaultsPath].map(dir => {
                return new Promise((res, rej) => {
                    fileService.dirExists(dir).then(exists => {
                        if(!exists) {
                            fileService.createDirectory(dir)
                                .then(_ => res())
                                .catch(err => rej(err));
                        }
                        res();
                    }).catch(err => rej(err));
                });
            })
        ).then(_ => {
            return {collectionPath, origsPath, thumbsPath, defaultsPath};
        });     
    },
    getCollectionDirectories(collectionId) {
        const {collectionPath, origsPath, thumbsPath, defaultsPath} = this.getCollectionRoutes(collectionId);
        return {
            collectionPath: path.resolve(__dir, config.uploadsDir, collectionId),
            origsPath: path.resolve(__dir, config.uploadsDir, origsPath), 
            thumbsPath: path.resolve(__dir, config.uploadsDir, thumbsPath), 
            defaultsPath: path.resolve(__dir, config.uploadsDir, defaultsPath)
        };
    },
    getCollectionRoutes(collectionId) {
        const origsPath = path.join(collectionId, 'origs');
        const thumbsPath = path.join(collectionId, 'thumbs');
        const defaultsPath = path.join(collectionId, 'defaults');
        return {
            origsPath,
            thumbsPath,
            defaultsPath
        }
    },
}
