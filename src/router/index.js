import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

import Home from '../pages/HomePage.vue';
import About from '../pages/AboutPage.vue';
import FAQ from '../pages/FAQPage.vue';
import Login from '../pages/LoginPage.vue';
import Register from '../pages/RegisterPage.vue';
import Profile from '@/pages/ProfilePage.vue'
import Exchange from '@/pages/ExchangeCreate.vue'
import ExchangeDetail from '@/pages/ExchangeDetail.vue'

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{ path: '/about', name: 'About', component: About },
	{ path: '/faq', name: 'Faq', component: FAQ },
	{ path: '/profile', name: 'Profile', component: Profile, meta: {onlyAuthUser: true} },
	{ path: '/exchanges/:slug', name: 'ExchangeDetail', component: ExchangeDetail, meta: {onlyAuthUser: true} },
	{ path: '/exchanges/new', name: 'Exchange', component: Exchange, meta: {onlyAuthUser: true} },
	{ path: '/login', name: 'Login', component: Login, meta: { onlyGuestUser: true } },
	{ path: '/register', name: 'Register', component: Register, meta: { onlyGuestUser: true } },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach( (to, _, next) => {
	const isAuth = !!getAuth().currentUser;

	if (to.meta.onlyAuthUser) {
		if (isAuth) {
			next();
		} else {
			next({name: "Login"});
		}
	} else if (to.meta.onlyGuestUser) {
        if (isAuth) {
            next({name: 'Home'});
        } else {
            next()
        }
	} else {
        next()
    }
});

export default router;
