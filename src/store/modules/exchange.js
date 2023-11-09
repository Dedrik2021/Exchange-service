import {getDocs, collectionGroup, query, doc, addDoc, collection} from 'firebase/firestore'

import {database} from '../../firebase/db'

export default {
    namespaced: true,

	state() {
		return {
			items: []
		};
	},

    actions: {
        async getExchanges({commit}) {
            const exchangesQuery = query(collectionGroup(database, 'exchanges'))
            const snapshot = await getDocs(exchangesQuery)

            const exchanges = snapshot.docs.map((doc) => {
                return {id: doc.id, ...doc.data()}
            })

            commit('setExchanges', exchanges)
        },

        async createExchange({rootState, dispatch}, {data, onSuccess}) {
            const userRef = doc(database, "users", rootState.user.data.id)
            data.user = userRef
            await addDoc(collection(database, "exchanges"), data)
            dispatch("toast/success", "Exchange was created succesfuly!", {root: true})

            onSuccess()
        }
    },

    mutations: {
        setExchanges(state, exchanges) {
            state.items = exchanges
        }
    }
};
