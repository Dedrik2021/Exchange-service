import {
	Timestamp,
	doc,
	addDoc,
	collection,
	query,
	where,
	getDocs,
	getDoc,
    updateDoc,
    increment
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

		async createOpportunity({ dispatch, commit }, { data, onSuccess }) {
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

            if (opportunity.price) {
                await updateDoc(opportunity.fromUser, {
                    credit: increment(-opportunity.price)
                })
                commit('user/updateCredit', -opportunity.price, {root: true})
            }

			dispatch('toast/success', 'Opportunity vas send!', { root: true });

			onSuccess();
		},

		async acceptOpportunity({commit, dispatch}, { opportunity, onSuccess }) {
			const oppRef = doc(database, 'opportunities', opportunity.id)
            await updateDoc(oppRef, {status: 'accepted'})

            if (opportunity.price) {
                const userRef = doc(database, 'users', opportunity.toUser.id)
                await updateDoc(userRef, {
                    credit: increment(opportunity.price)
                })
                commit('user/updateCredit', opportunity.price, {root: true})
            }

            commit('changeOpportunityStatus', {id: opportunity.id, status: 'accepted'})
            dispatch('toast/success', 'Opportunity vas accepted!', { root: true });

			onSuccess();
		},

		async declineOpportunity({commit, dispatch}, { opportunity, onSuccess }) {
			const oppRef = doc(database, 'opportunities', opportunity.id)
            await updateDoc(oppRef, {status: 'declined'})
            if (opportunity.price) {
                const fromUserRef = doc(database, 'users', opportunity.fromUser.id)
                await updateDoc(fromUserRef, {
                    credit: increment(opportunity.price)
                })
            }

            commit('changeOpportunityStatus', {id: opportunity.id, status: 'declined'})
            dispatch('toast/error', 'Opportunity vas declined!', { root: true });
			onSuccess();
		},
	},

	mutations: {
		setOpportunities(state, { resource, opportunities }) {
			state[resource] = opportunities;
		},

        changeOpportunityStatus(state, {id, status}) {
            const index = state.opportunities.findIndex(o => o.id === id)
            state.opportunities[index].status = status
        }
	},
};
