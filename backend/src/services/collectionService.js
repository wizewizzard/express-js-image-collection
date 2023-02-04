import { Collection } from "../models/index.js"

export default {
    async createCollection(collectionData) {
        const collectionModel = Collection.build(collectionData);
        try{
            await collectionModel.save();
            console.log('Collection saved: ', collectionModel.name);
        }
        catch(err) {
            console.log('Error when creating collection ', err)
        }

        //createDirectory();
    },
    updateCollection(colId, colFields) {
        
    },
    deleteCollection(colId) {
        
    }
}
