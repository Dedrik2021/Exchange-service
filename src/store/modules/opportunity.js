import { Timestamp, doc, addDoc, collection } from "firebase/firestore"

import { database } from "@/firebase/db"


export default {
    namespaced: true,

    actions: {
        async createOpportunity({dispatch}, {data, onSuccess}) {

            const opportunity = {
                title: data.title,
                createAt: Timestamp.fromDate(new Date()),
                toUser: doc(database, "users", data.toUserId),
                fromUser: doc(database, "users", data.formUserId),
                toExchange: doc(database, "exchanges", data.toExchangeId)
            }

            if (data.formExchangeId) {
                opportunity.fromExchangeId = doc(database, "exchanges", data.formExchangeId)
            } else {
                opportunity.price = data.price
            }

            await addDoc(collection(database, "opportunities"), opportunity)
            dispatch('toast/success', "Opportunity vas send!", {root: true})

            onSuccess()
        }
    }
}