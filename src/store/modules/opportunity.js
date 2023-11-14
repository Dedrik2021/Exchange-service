import {
	Timestamp,
	doc,
	addDoc,
	collection,
	query,
	where,
	getDocs,
	getDoc,
} from 'firebase/firestore';

import { database } from '@/firebase/db';

const extraDataForOpportunity = async (opportunity, id) => {
	if (opportunity.fromExchangeId) {
		const formExchangeDoc = await getDoc(opportunity.fromExchangeId);
		opportunity.fromExchangeId = { ...formExchangeDoc.data(), id: formExchangeDoc.id };
	}

	const toExchangeDoc = await getDoc(opportunity.toExchange);
	opportunity.toExchange = { ...toExchangeDoc.data(), id: toExchangeDoc.id };

	const fromUserDoc = await getDoc(opportunity.fromUser);
	opportunity.fromUser = { ...fromUserDoc.data(), id: fromUserDoc.id };

	opportunity.id = id;

	return opportunity;
};

export default {
	namespaced: true,

	state() {
		return {
			opportunities: [],
			sendOpportunities: [],
		};
	},

	actions: {
		async getOpportunities({ rootState, dispatch, commit }) {
			const id = rootState.user.data.id;

			if (!id) {
				dispatch('toast/error', 'User is not logged in', { root: true });
			}

			const opportunityQuery = query(
				collection(database, 'opportunities'),
				where('toUser', '==', doc(database, 'users', id)),
			);

			const opportunitiesSnap = await getDocs(opportunityQuery);
			const opportunities = await Promise.all(
				opportunitiesSnap.docs.map((doc) => extraDataForOpportunity(doc.data(), doc.id)),
			);
			commit('setOpportunities', { resource: 'opportunities', opportunities });
		},

		async getSendOpportunities({ rootState, dispatch, commit }) {
			const id = rootState.user.data.id;

			if (!id) {
				dispatch('toast/error', 'User is not logged in', { root: true });
			}

			const opportunityQuery = query(
				collection(database, 'opportunities'),
				where('fromUser', '==', doc(database, 'users', id)),
			);

			const opportunitiesSnap = await getDocs(opportunityQuery);
			const opportunities = await Promise.all(
				opportunitiesSnap.docs.map((doc) => extraDataForOpportunity(doc.data(), doc.id)),
			);
			commit('setOpportunities', { resource: 'sendOpportunities', opportunities });
		},

		async createOpportunity({ dispatch }, { data, onSuccess }) {
			const opportunity = {
				title: data.title,
				createAt: Timestamp.fromDate(new Date()),
				toUser: doc(database, 'users', data.toUserId),
				fromUser: doc(database, 'users', data.formUserId),
				toExchange: doc(database, 'exchanges', data.toExchangeId),
				status: 'pending',
			};

			if (data.formExchangeId) {
				opportunity.fromExchangeId = doc(database, 'exchanges', data.formExchangeId);
			} else {
				opportunity.price = data.price;
			}

			await addDoc(collection(database, 'opportunities'), opportunity);
			dispatch('toast/success', 'Opportunity vas send!', { root: true });

			onSuccess();
		},

		async acceptOpportunity(_, { opportunity, onSuccess }) {
			console.log(opportunity);
			onSuccess();
		},

		async declineOpportunity(_, { opportunity, onSuccess }) {
			console.log(opportunity);
			onSuccess();
		},
	},

	mutations: {
		setOpportunities(state, { resource, opportunities }) {
			state[resource] = opportunities;
		},
	},
};
