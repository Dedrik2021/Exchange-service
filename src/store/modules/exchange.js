import {
	getDocs,
	getDoc,
	collectionGroup,
	query,
	doc,
	addDoc,
	collection,
	where,
	Timestamp,
	limit,
	startAfter,
	startAt,
} from 'firebase/firestore';
import slugify from 'slugify';

import { database } from '../../firebase/db';

const initPagination = () => {
	return {
		itemCount: 3,
		lastItem: null,
		paginationHistory: [],
		isFetchingData: false
	};
};

export default {
	namespaced: true,

	state() {
		return {
			items: [],
			item: {},
			pagination: initPagination(),
		};
	},

	getters: {
		currentPage(state) {
			if (!state.pagination.paginationHistory) return 1;
			return state.pagination.paginationHistory.length;
		},
	},

	actions: {
		async getExchanges({ commit, state }) {
			commit('resetPagination')

			const exchangesQuery = query(
				collectionGroup(database, 'exchanges'),
				limit(state.pagination.itemCount),
			);
			const snapshot = await getDocs(exchangesQuery);

			const exchanges = snapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});

			commit('setExchanges', exchanges);
			commit('setLastItem', snapshot.docs[snapshot.docs.length - 1]);
			commit('setPaginationHistory', snapshot.docs[0]);
		},

		async getMoreExchanges({ commit, state }, { page }) {
			let queryData;

			if (state.pagination.isFetchingData) return;
			commit('setIsFetching', true);

			if (page === 'next') {
				queryData = query(
					collectionGroup(database, 'exchanges'),
					startAfter(state.pagination.lastItem),
					limit(state.pagination.itemCount),
				);
			} else if (page === 'prev') {
				const lastItemIndex = state.pagination.paginationHistory.length - 1;
				const prevItem = state.pagination.paginationHistory[lastItemIndex - 1];

				if (!prevItem) {
					commit('setIsFetching', false);
					return;
				}

				state.pagination.paginationHistory.splice(lastItemIndex, 1);
				queryData = query(
					collectionGroup(database, 'exchanges'),
					startAt(prevItem),
					limit(state.pagination.itemCount),
				);
			}

			const snapshot = await getDocs(queryData);
			commit('setIsFetching', false);
			if (snapshot.docs.length === 0) return;
			const exchanges = snapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});

			commit('setExchanges', exchanges);
			commit('setLastItem', snapshot.docs[snapshot.docs.length - 1]);

			if (page === 'next') commit('setPaginationHistory', snapshot.docs[0]);
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
			data.createAt = Timestamp.fromDate(new Date());
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
			exchange.id = querySnapshot.docs[0].id;

			//find user from users db
			const userSnap = await getDoc(exchange.user);
			exchange.user = userSnap.data();
			exchange.user.id = userSnap.id;

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
		setLastItem(state, item) {
			state.pagination.lastItem = item;
		},
		setPaginationHistory(state, item) {
			state.pagination.paginationHistory.push(item);
		},
		setIsFetching(state, isFetching) {
			state.pagination.isFetchingData = isFetching;
		},
		resetPagination(state) {
			state.pagination = initPagination()
		}
	},
};
