import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/HomePage.vue';
import About from '../pages/AboutPage.vue';
import FAQ from '../pages/FAQPage.vue';
import Login from '../pages/LoginPage.vue';
import Register from '../pages/RegisterPage.vue';
import { getAuth } from 'firebase/auth';

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{ path: '/about', name: 'About', component: About },
	{ path: '/faq', name: 'Faq', component: FAQ },
	{ path: '/login', name: 'Login', component: Login, meta: { onlyGuestUser: true } },
	{ path: '/register', name: 'Register', component: Register, meta: { onlyGuestUser: true } },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(async (to, _, next) => {
	const isAuth = await getAuth().currentUser;

	if (to.meta.onlyGuestUser) {
		if (isAuth) {
			next({ name: 'Home' });
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
