import formidable from 'formidable';
import collectionService from './services/CollectionService.js';
import imageService from './services/imageService.js';

export default (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve("static", "index.html"));
    });
    
    app.get('/api/collection', (req, res) => {
        res.send('Showing collection');
    });

    app.post('/api/collection', (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields) => {
            console.log(fields);
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

    app.put('/api/collection', (req, res) => {
        const form = new formidable.IncomingForm();
        const fields = [];

        form.on('field', function(field, value) {
            fields.push([field, value]);
        })

        form.on('end', function() {
            console.log('done');

            res.end();
        });

        form.parse(req);
    });

    app.post('/api/collection/:id/upload', (req, res) => {
        var collectionId = req.params['id'] ;
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
        form.on('end', function() {
            console.log(`Uploaded images to collection with id ${collectionId} `);
            res.end('Uploaded');
        });
        
        form.parse(req);
    });

    app.delete('/api/collection/:id', (req, res) => {

    });

    app.delete('/api/collection/:id/delete/:name', (req, res) => {
        
    });
}