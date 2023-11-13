import { Timestamp, doc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';

import { database } from '@/firebase/db';

export default {
	namespaced: true,

    state() {
        return {
            opportunities: [],
            sendOpportunities: []
        }
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
			const opportunities = opportunitiesSnap.docs.map(doc => ({...doc.data(), id: doc.id}))
            commit('setOpportunities', {resource: "opportunities", opportunities})
		},

		async createOpportunity({ dispatch }, { data, onSuccess }) {
			const opportunity = {
				title: data.title,
				createAt: Timestamp.fromDate(new Date()),
				toUser: doc(database, 'users', data.toUserId),
				fromUser: doc(database, 'users', data.formUserId),
				toExchange: doc(database, 'exchanges', data.toExchangeId),
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
	},

    mutations: {
        setOpportunities(state, {resource, opportunities}) {
            state[resource] = opportunities
        }
    }
};
