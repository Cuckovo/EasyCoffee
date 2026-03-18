import {createRouter, createWebHistory} from "vue-router";
import indexPage from "../pages/index/index.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/',
        component: indexPage
    }]
})

export default router;