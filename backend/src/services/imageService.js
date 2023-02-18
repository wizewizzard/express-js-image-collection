import config from "../config/config.js";
import collectionService from "./CollectionService.js";
import path from 'path';
import fs from 'fs';
import sharp from "sharp";
import fileService from "./fileService.js";
import log4js from 'log4js';

const logger = log4js.getLogger('ImageService');
logger.level = 'trace';

const uploadsDir = config.uploadsDir;
const validImageExtensions = config.image.validImageExtensions;
const thumbnailOptions = { width: config.image.thumbnailSize, height: config.image.thumbnailSize };
const defaultOptions = { width: config.image.defaultSize, height: config.image.defaultSize };

const imageService = {
    async saveImageInCollection(collectionId, uploadedFile, props) {
        logger.trace(`Saving images in collection with id ${collectionId}`);
        if(await collectionService.collectionExistsById(collectionId)) {
            const {
                origsPath,
                thumbsPath,
                defaultsPath
            } = await collectionService.prepareCollectionDirectory(collectionId);
            const fileName = uploadedFile[1].originalFilename;
            const fileExists = await(fileService.fileExists(uploadedFile[1].filepath));
            if(!fileExists) {
                throw new Error('Uploaded file does not exist');
            }
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
    async removeImageFromCollection(collectionId, imageName) {
        if(await collectionService.collectionExistsById(collectionId)) {
            logger.debug(`Deleting image ${imageName} frim collection ${collectionId}`);
            const {
                origsPath,
                thumbsPath,
                defaultsPath
            } = collectionService.getCollectionDirectories(collectionId);
            logger.debug(origsPath,
                thumbsPath,
                defaultsPath);
            await fileService.deleteFile(path.resolve(origsPath, imageName));
            await fileService.deleteFile(path.resolve(thumbsPath, imageName));
            await fileService.deleteFile(path.resolve(defaultsPath, imageName));
        }
    },
    async getImagesFromCollection(collectionId) {
        const { origsPath } = collectionService.getCollectionDirectories(collectionId);
        const imagesInDirectory = await fileService.getFilesInDirectory(origsPath, f => validImageExtensions.indexOf(path.extname(f)) !== -1);
        return imagesInDirectory.map(i => {
            return {
                imageName: i,
                ...this.getImageUrls(collectionId, i)
            };
        })
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
    getImageUrls(collectionId, imageName) {
        const { origsPath, thumbsPath, defaultsPath } = collectionService.getCollectionRoutes(collectionId);
        return {
            origUrl:  path.join(origsPath, imageName),
            thumbUrl:  path.join(thumbsPath, imageName),
            defaultUrl:  path.join(defaultsPath, imageName)
        }
    }
};

export default imageService;
