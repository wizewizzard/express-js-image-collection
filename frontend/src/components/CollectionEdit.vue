<template>
    <div>
        <h1>Collection edit</h1>
        <form>
            <p v-if="errors.length">
                <strong>Please correct the following error(s)</strong>
                <ul>
                    <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                </ul>
            </p>
            <div class="mb-3">
                <label for="collectionName" class="form-label">Collection name</label>
                <input type="text" v-model="collectionName" class="form-control" id="collectionName">
            </div>
            <div class="mb-3">
                <label for="collectionDescription" class="form-label">Collection description</label>
                <textarea v-model="collectionDescription" class="form-control" id="collectionDescription" />
            </div>
            <div class="mb-3">
                <label for="collectionImages" class="form-label">Attach images</label>
                <input type="file" multiple=true class="form-control" id="collectionImages" />
            </div>
            <button type="submit" @click="createCollection" class="btn btn-primary">Create</button>
        </form>
    </div>
</template>

<script>
export default {
    data: () => ({
        collectionName: '',
        collectionDescription: '',
        errors: [],
    }),
    watch: {
    },
    methods: {
        createCollection(e) {
            this.errors = [];
            if (!this.collectionName) {
                this.errors.push('Name required.');
            }
            const formData = new FormData();
            formData.append('collectionName', this.collectionName);
            formData.append('collectionDescription', this.collectionDescription);

            e.preventDefault();
        },
    },
};
</script>
