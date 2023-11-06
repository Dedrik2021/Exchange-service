import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { database } from '../../firebase/db';

export default {
	namespaced: true,

	state() {
		return {
            data: null,
			register: {
				isProcessing: false,
				error: '',
			},
		};
	},

	actions: {
        onAuthChange({dispatch}) {
            onAuthStateChanged(getAuth(), (user) => {
                if (user) {
                    dispatch('getUserProfile', user)
                } else {
                    console.log("Logged out");
                }
            })
        },

        async getUserProfile({commit}, user) {
            const docRef = doc(database, "users", user.uid)
            const docSnap = await getDoc(docRef)
            const userProfile = docSnap.data()
            const useWithProfile = {
                id: user.uid,
                email: user.email,
                ...userProfile
            }
            commit('setUser', useWithProfile)
        },

		async register({ commit, dispatch }, { email, username, password  }) {
			commit('setRegisterIsProcessing', true);
			commit('setRegisterError', '');

			const auth = getAuth();
			try {
				const { user } = await createUserWithEmailAndPassword(auth, email, password);
				dispatch(
					'toast/success',
					`Congratulations ${username}! You are registered successfully!`,
					{
						root: true,
					},
				);
				await dispatch('createUserProfile', {
					id: user.uid,
					username,
					avatar: 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
                    credit: 0,
                    exchanges: []
				});
			} catch (error) {
				console.error(error.message);
				commit('setRegisterError', error.message);
				dispatch('toast/error', error.message, { root: true });
			} finally {
				commit('setRegisterIsProcessing', false);
			}
		},

		async createUserProfile(_, { id, ...profile }) {
            await setDoc(doc(database, "users", id), profile)
        },

    
	},

	mutations: {
		setRegisterIsProcessing(state, isProcessing) {
			state.register.isProcessing = isProcessing;
		},

		setRegisterError(state, error) {
			state.register.error = error;
		},

        setUser(state, user) {
            state.data = user
        }
	},
};
