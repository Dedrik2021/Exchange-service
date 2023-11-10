import {
	getDocs,
	getDoc,
	collectionGroup,
	query,
	doc,
	addDoc,
	collection,
	where,
} from 'firebase/firestore';
import slugify from 'slugify';

import { database } from '../../firebase/db';

export default {
	namespaced: true,

	state() {
		return {
			items: [],
			item: {},
		};
	},

	actions: {
		async getExchanges({ commit }) {
			const exchangesQuery = query(collectionGroup(database, 'exchanges'));
			const snapshot = await getDocs(exchangesQuery);

			const exchanges = snapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});

			commit('setExchanges', exchanges);
		},

		async createExchange({ rootState, dispatch }, { data, onSuccess }) {
            //find user from users db
			const userRef = doc(database, 'users', rootState.user.data.id);
            //write user into data
			data.user = userRef;
            //create slug and write into data
			data.slug = slugify(`${data.title} ${Date.now()}`, {
				lower: true,
				strict: true,
			});
			await addDoc(collection(database, 'exchanges'), data);
			dispatch('toast/success', 'Exchange was created succesfuly!', { root: true });

			onSuccess();
		},

		async getExchangeBySlug({ commit }, slug) {
			commit('setExchange', {});
            //find exchange from exchanges db by slug
			const docQuery = query(collection(database, 'exchanges'), where('slug', '==', slug));
			const querySnapshot = await getDocs(docQuery);
			const exchange = querySnapshot.docs[0].data();

            //find user from users db
            const userSnap = await getDoc(exchange.user)
            exchange.user = userSnap.data()
            exchange.user.id = userSnap.id

			commit('setExchange', exchange);
		},
	},

	mutations: {
		setExchanges(state, exchanges) {
			state.items = exchanges;
		},

		setExchange(state, exchange) {
			state.item = exchange;
		},
	},
};
