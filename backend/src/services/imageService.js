import config from "../config/config.js";
import collectionService from "./CollectionService.js";
import path from 'path';
import fs from 'fs';
import sharp from "sharp";
import fileService from "./fileService.js";
import log4js from 'log4js';

const logger = log4js.getLogger('ImageService');
logger.level = 'debug';

const __dir = path.resolve();
const uploadsDir = config.uploadsDir;
const validTypes = config.image.validTypes;
const thumbnailOptions = { width: config.image.thumbnailSize, height: config.image.thumbnailSize };
const defaultOptions = { width: config.image.defaultSize, height: config.image.defaultSize };

const imageService = {
    async saveImageInCollection(collectionId, uploadedFile, props) {
        logger.trace('Saving images in collection');
        if(await collectionService.collectionExistsById(collectionId)) {
            const {
                origsPath,
                thumbsPath,
                defaultsPath
            } = await this.prepareCollectionDirectory(collectionId);
            const fileName = uploadedFile[1].originalFilename;
            await(fileService.fileExists(uploadedFile[1].filepath));
            await fileService.moveFile(uploadedFile[1].filepath, path.resolve(origsPath, fileName));
            const contents = fs.readFileSync(path.resolve(origsPath, fileName));
            const thumbnail = await this.resizeImage(contents, thumbnailOptions);
            const defaultImage = await this.resizeImage(contents, defaultOptions);                
            await fileService.saveFile(thumbnail, path.resolve(thumbsPath, fileName));
            await fileService.saveFile(defaultImage, path.resolve(defaultsPath, fileName));
            logger.debug('Saved image thumb and default');
        }
        else {
            logger.error(`Collection with id ${collectionId} does not exist'`);
            throw new Error(`Collection with id ${collectionId} does not exist'`);
        }
    },
    resizeImage(data, opts) {
        return new Promise((res, rej) => {
            sharp(data)
                .resize({height: opts.height})
                .toBuffer()
                .then(data =>  {
                    res(data);
                })
                .catch(function(err) {
                    rej(err);
                });
        });
    },
    async prepareCollectionDirectory(collectionId) {
        const collectionPath = path.resolve(__dir, config.uploadsDir, collectionId);
        const origsPath = path.resolve(collectionPath, 'origs');
        const thumbsPath = path.resolve(collectionPath, 'thumbs');
        const defaultsPath = path.resolve(collectionPath, 'defaults');
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

        return {
            collectionPath,
            origsPath,
            thumbsPath,
            defaultsPath
        }
    }

};

export default imageService;
