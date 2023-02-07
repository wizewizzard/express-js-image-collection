import path from 'path';
import fs from 'fs';
import log4js from 'log4js';

const logger = log4js.getLogger('FileService');
logger.level = 'trace';

const fileService = {
    async saveFile(content, path, props = {}) {
        return new Promise((res, rej) => {
            fs.writeFile(path, content, (err) => {
                if (err) {
                    logger.error('Error creating dir', err);
                    rej(new Error('Error when saving file. ' + err.message));
                }
                else {
                    res('File saved');
                }
            });
        });

    },
    async createDirectory(dir, props = { recursive: true }) {
        if (!await this.dirExists(dir)) {
            await fs.mkdir(dir, props, (err) => {
                if (err) {
                    logger.error('Error creating dir', err)
                    throw new Error(`Error creating directory ${dir}. ` + err.message);
                }
            });
        }
        else {
            logger.info('Directory already exists');
        }
    },
    async deleteDirectory(dir, props = { recursive: true }) {
        logger.debug(`Trying to delete directory: ${dir}`);
        if (await this.dirExists(dir)) {
            await fs.rmdir(dir, props, (err) => {
                if (err) {
                    logger.error('Error creating dir', err);
                    throw new Error(`Error deliting directory ${dir}. ` + err.message);
                }
                else {
                    logger.info(`Directory removed ${dir}`, err);
                }
            })
        }
        else {
            logger.info('Directory does not exist');
        }
    },
    async dirExists(dir) {
        return new Promise((res, rej) => {
            fs.access(dir, (err) => {
                if (err) {
                    logger.warn(`Error checking directory: ${dir}. `, err)
                    res(false);
                }
                else {
                    logger.info(`Directory exists: ${dir}. `)
                    res(true);
                }
            });
        })
    }
};

export default fileService;
