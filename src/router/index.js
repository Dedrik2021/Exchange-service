import {createRouter, createWebHistory} from 'vue-router'

import Home from '../pages/HomePage.vue'
import About from '../pages/AboutPage.vue'
import FAQ from '../pages/FAQPage.vue'
import Login from '../pages/LoginPage.vue'
import Register from '../pages/RegisterPage.vue'

const routes = [
    {path: "/", name: "Home", component: Home},
    {path: "/about", name: "About", component: About},
    {path: "/faq", name: "Faq", component: FAQ},
    {path: "/login", name: "Login", component: Login},
    {path: "/register", name: "Register", component: Register},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router