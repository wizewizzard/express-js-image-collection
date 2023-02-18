import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import CollectionEdit from '@/components/CollectionEdit';
import Collections from '@/components/Collections';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
        },
        {
            path: '/create',
            name: 'Create collection',
            component: CollectionEdit,
        },
        {
            path: '/collections',
            component: Collections,
        },
    ],
    mode: 'history',
});
