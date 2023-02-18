<template>
    <nav>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/collections">Collections</router-link></li>
            <li><router-link to="/create">Create</router-link></li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'NavBar',
};
</script>
