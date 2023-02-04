import path from 'path';
import fs from 'fs';
import config from '../config/config.js';
import log4js from 'log4js';

const logger = log4js.getLogger();
logger.level = 'trace';

const service = {
    async saveFile (content, path, props = {}) {
        await fs.writeFile(path, content, (err) => {
            if(err) {
                logger.error('Error creating dir', err)
                throw new Error('Error when saving file. ' + err.message);
            }
        });
    },
    async createDirectory(dir) {
        if(!await fs.existsSync(dir)) {
            await fs.mkdir(dir, {recursive: false}, (err) => {
                if(err) {
                    logger.error('Error creating dir', err)
                    throw new Error('Error creating dir. ' + err.message);
                }
            });
        }
        else{
            logger.info('Directory already exists');
        }
    }
};

export default service;
