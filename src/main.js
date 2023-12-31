import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Toast from 'vue-toastification';

import 'vue-toastification/dist/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

library.add([faStar, faUpload]);
let app;

store.dispatch('user/onAuthChange', () => {
	if (!app) {
		app = createApp(App);

		app.use(store).use(router).use(Toast);

		app.component('font-awesome-icon', FontAwesomeIcon);
		app.mount('#app');
	}
});
