<template>
    <div id="app">
        <div class="container">
            <Header />
            <NavBar />
            <router-view />
        </div>
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';

export default {
    name: 'App',
    components: {
        NavBar,
        Header,
    },
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
