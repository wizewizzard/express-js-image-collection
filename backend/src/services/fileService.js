import fs from 'fs';
import log4js from 'log4js';

const logger = log4js.getLogger('FileService');
logger.level = 'trace';

const fileService = {
    async saveFile(content, path, props = {}) {
        return new Promise((res, rej) => {
            fs.writeFile(path, content, (err) => {
                if (err) {
                    logger.error('Error when saving file', err);
                    rej(new Error('Error when saving file. ' + err.message));
                }
                else {
                    logger.debug('File saved');
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
    moveFile(source, destination) {
        return new Promise((res, rej) => {
            fs.rename(source, destination, (err) => {
                if (err) {
                    rej(err);
                }
                res();
            });
        })

    },
    dirExists(dir) {
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
    },
    fileExists(path, attemptCount = 3) {
        let attemptsLeft = attemptCount;
        return new Promise((res, rej) => {
            const attemptFunc =  () => {
                logger.debug(`Trying to access file ${path}`);
                fs.access(path, fs.F_OK, (err) => {
                    attemptsLeft --;
                    if (err) {
                        logger.warn(`File ${path} is not accessible. Attempts left: ${attemptsLeft}`);
                        if (attemptsLeft === 0) {
                            rej('File is not available');
                        }
                        setTimeout(attemptFunc(), 50);
                    }
                    else {
                        logger.debug(`File ${path} is available. Attempts left: ${attemptsLeft}`);
                        res('File is available to be read');
                    }
                }, 50)
            };
            setTimeout(attemptFunc, 50);
        });
    }
};

    export default fileService;
