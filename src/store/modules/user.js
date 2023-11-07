import {
	getAuth,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

import { database } from '../../firebase/db';

export default {
	namespaced: true,

	state() {
		return {
            data: null,
			auth: {
                isProcessing: false,
				error: '',
			}
		};
	},

	getters: {
		isAuthenticated(state) {
			return !!state.data;
		},
	},

	actions: {
		onAuthChange({ dispatch, commit }, callback) {
            commit("setAuthIsProcessing", true)

			onAuthStateChanged(getAuth(), async (user) => {
				if (user) {
					await dispatch('getUserProfile', user);
                    commit("setAuthIsProcessing", false)
                    callback(user)
				} else {
					console.log('Logged out');
                    commit("setAuthIsProcessing", false)
                    callback(null)
				}
			});
		},

		async getUserProfile({ commit }, user) {
			const docRef = doc(database, 'users', user.uid);
			const docSnap = await getDoc(docRef);
			const userProfile = docSnap.data();
			const useWithProfile = {
				id: user.uid,
				email: user.email,
				...userProfile,
			};
			commit('setUser', useWithProfile);
		},

		async register({ commit, dispatch }, { email, username, password }) {
			commit('setAuthIsProcessing', true);
			commit('setAuthError', '');

			try {
				const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
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
					exchanges: [],
				});
			} catch (error) {
				console.error(error.message);
				commit('setAuthError', error.message);
				dispatch('toast/error', error.message, { root: true });
			} finally {
				commit('setAuthIsProcessing', false);
			}
		},

		async createUserProfile(_, { id, ...profile }) {
			await setDoc(doc(database, 'users', id), profile);
		},

		async logout({ commit, dispatch }) {
			if (window.confirm('Do you want to logout?')) {
				try {
					await signOut(getAuth());
					commit('setUser', null);
					dispatch('toast/success', 'You are logout successfully!', { root: true });
				} catch (e) {
					console.error('Cannot logout');
					dispatch('toast/error', e.message, { root: true });
				}
			}
		},

		async logIn({commit, dispatch}, { email, password }) {
			commit('setAuthIsProcessing', true);
			commit('setAuthError', '');

			try {
				const { user } = await signInWithEmailAndPassword(getAuth(), email, password);
				dispatch('toast/success', `Hello ${user.email}!`, { root: true });
			} catch (e) {
				console.error(e);
				dispatch('toast/error', e.message, { root: true });
				commit('setAuthError', e.message);
			} finally {
				commit('setAuthIsProcessing', false);
			}
		},

        async updateProfile({commit, dispatch}, {data, onSuccess}) {
            const userRef = doc(database, "users", data.id)
            await updateDoc(userRef, data)
            commit("updateProfile", data)
            dispatch('toast/success', `Profile has been updated!`, { root: true });
            onSuccess()
        }
	},

	mutations: {
		setAuthIsProcessing(state, isProcessing) {
			state.auth.isProcessing = isProcessing;
		},

		setAuthError(state, error) {
			state.auth.error = error;
		},

		setUser(state, user) {
			state.data = user;
		},

        updateProfile(state, profile) {
            state.data = {...state.data, profile}
        }
	},
};
