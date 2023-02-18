import fs from 'fs';
import path from 'path';
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
    createDirectory(dir, props = { recursive: true }) {
        return new Promise((res, rej) => {
            fs.mkdir(dir, props, (err) => {
                if (err) {
                    logger.error('Error creating dir', err);
                    rej(err);
                }
                res();
            });
        })
    },
    async deleteDirectory(dir, props = { recursive: true }) {
        logger.debug(`Deleting directory: ${dir}`);
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
    async deleteFile(path) {
        logger.debug(`Deleting file ${path}`);
        if(await this.fileExists(path)) {
            fs.rmSync(path);
        }
        else {
            throw new Error('File does not exist');
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
                    res(false);
                }
                else {
                    res(true);
                }
            });
        })
    },
    fileExists(path, attemptCount = 3) {
        let attemptsLeft = attemptCount;
        return new Promise((res, rej) => {
            const attemptFunc =  () => {
                logger.debug(`Trying to access file ${path}. Attempts left: ${attemptsLeft}`);
                fs.access(path, fs.F_OK, (err) => {
                    attemptsLeft --;
                    if (err) {
                        logger.warn(`File ${path} is not accessible. Attempts left: ${attemptsLeft}`);
                        if (attemptsLeft === 0) {
                            res(false);
                            return;
                        }
                        setTimeout(attemptFunc, 50);
                    }
                    else {
                        logger.debug(`File ${path} is available. Attempts left: ${attemptsLeft}`);
                        res(true);
                    }
                }, 50)
            };
            setTimeout(attemptFunc, 50);
        });
    },
    getFilesInDirectory(dirPath, filter = (f) => f) {
        return new Promise((res, rej) => {
            fs.readdir(dirPath, (err, files) => {
                if(err) {
                    rej(err);
                }
                res(files.filter(filter));
            });
        })
    }
};

export default fileService;
