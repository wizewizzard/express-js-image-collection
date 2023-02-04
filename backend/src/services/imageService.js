const thumbSize = 400;
const uploadDir = '';
const uploadThubms = '';

const validTypes = ["jpg", "jpeg", "png"];

export default {
    saveImageInCollection(image, collectionId) {
        const collection = findCollectionById(collectionId);
        createThumbnail();
        saveAppropriateResolution();
        saveOriginal();
    },
    createThumbnail(image) {

    }
};