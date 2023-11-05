import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

export default {
    namespaced: true,

    state() {
        return {
            register: {
                isProcessing: false,
                error: ""
            }
        }
    },

    actions: {

        async register({commit}, {email, password}) {
            commit('setRegisterIsProcessing', true)
            commit('setRegisterError', "")

            const auth = getAuth()
            try{
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password) 
                return userCredentials.user
            } catch(error) {
                console.error(error.message);
                commit('setRegisterError', error.message)
            } finally {
                commit('setRegisterIsProcessing', false)
            }
        }
    },

    mutations: {
        setRegisterIsProcessing(state, isProcessing) {
            state.register.isProcessing = isProcessing
        },

        setRegisterError(state, error) {
            state.register.error = error
        }
    }
}