import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'

export default {
    namespaced: true,

    actions: {
        async register(_, {email, password}) {
            const auth = getAuth()

            try{
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password) 
                console.log('success register');
                return userCredentials.user
            } catch(error) {
                console.error(error.message);
            }
        }
    }
}