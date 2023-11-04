import {database} from '../../firebase/db'
import {getDocs, collectionGroup, query} from 'firebase/firestore'

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
        }
    },

    mutations: {
        setExchanges(state, exchanges) {
            state.items = exchanges
        }
    }
};
