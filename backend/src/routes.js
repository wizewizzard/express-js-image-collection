import formidable from 'formidable';
import collectionService from './services/CollectionService.js';
import imageService from './services/imageService.js';
import log4js from 'log4js';


const logger = log4js.getLogger('Routes');
logger.level = 'debug';

export default (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve("static", "index.html"));
    });
    
    app.get('/api/collection/:id', async (req, res) => {
        var collectionId = req.params['id'] ;
        try{
            const result = await collectionService.getCollectionImageList(collectionId);
            res.send({'status': true, 'data': result}).end();
        }
        catch(err) {
            logger.error(`Error when listing images of collection ${collectionId}`, err);
            res.status(500);
            res.send({status: false, message: err.message}).end();
        }
        
    });

    app.post('/api/collection', (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields) => {
            try{
                await collectionService.createCollection(fields);
                res.end('Created');
            }
            catch(err) {
                console.log(err);
                res.end('Error occured');
            }
        });
    });

    app.delete('/api/collection/:id', async (req, res) => {
        var collectionId = req.params['id'] ;

        try{
            await collectionService.deleteCollection(collectionId);
            console.log('abc')
            res.status(204);
            res.end('Deleted');
        }
        catch(err) {
            logger.error('Unable to delete collection', err)
            res.status(404);
            res.send(err.message).end();
        }
    });

    app.post('/api/collection/:id/image', (req, res) => {
        const collectionId = req.params['id'] ;
        const form = new formidable.IncomingForm();
        const files = [];
        const fields = [];

        form.on('field', function(field, value) {
            fields.push([field, value]);
        });
        form.on('file', function(field, file) {
            console.log(file.originalFilename);
            files.push([field, file]);
        });
        form.once('end', async () => {
            try{
                await Promise.all(files.map(async (file) => {
                    await(imageService.saveImageInCollection(collectionId, file));
                }), (err) => { logger.error('Error!', err)})
                logger.debug(`Uploaded images to collection with id ${collectionId} `);
                res.send({status: true, message: 'Uploaded'}).end();
            }
            catch(err) {
                logger.error('Error uploading files in collection', err);
                res.status(500);
                res.send({status: false, message: err.message}).end();
            }
        });
        
        form.parse(req);
    });

    app.delete('/api/collection/:id/image/:name', async (req, res) => {
        const collectionId = req.params['id'];
        const imageName = req.params['name'];
        try{
            await imageService.removeImageFromCollection(collectionId, imageName);
            res.send({status: true, message: 'Deleted'}).end();
        }
        catch(err) {
            logger.warn('Error deleting image from collection', err);
            res.status(500);
                res.send({status: false, message: err.message}).end();
        }
    });
}
