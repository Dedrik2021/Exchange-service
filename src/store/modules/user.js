import {
	getAuth,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {
	doc,
	setDoc,
	getDoc,
	updateDoc,
	collection,
	query,
	where,
	getDocs,
} from 'firebase/firestore';

import { database } from '../../firebase/db';

export default {
	namespaced: true,

	state() {
		return {
			data: null,
			auth: {
				isProcessing: false,
				error: '',
			},
		};
	},

	getters: {
		isAuthenticated(state) {
			return !!state.data;
		},

		isExchangeOwner: (state) => {
			return (exchangeUserId) => {
				return (
					state.data &&
					exchangeUserId &&
					state.data.id === exchangeUserId
				)
			}
		}
	},

	actions: {
		onAuthChange({ dispatch, commit }, callback) {
			commit('setAuthIsProcessing', true);

			onAuthStateChanged(getAuth(), async (user) => {
				if (user) {
					await dispatch('getUserProfile', user);
					commit('setAuthIsProcessing', false);
					callback(user);
				} else {
					console.log('Logged out');
					commit('setAuthIsProcessing', false);
					callback(null);
				}
			});
		},

		async getUserProfile({ commit }, user) {
			const docRef = doc(database, 'users', user.uid);
			const docSnap = await getDoc(docRef);
			const userProfile = docSnap.data();

			const docQuuery = query(collection(database, 'exchanges'), where('user', '==', docRef));
			const querySnap = await getDocs(docQuuery)
			const exchanges = querySnap.docs.map(doc => ({...doc.data(), id: doc.id}))

			const useWithProfile = {
				id: user.uid,
				email: user.email,
				...userProfile,
				exchanges
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
			await setDoc(doc(database, 'users', id), {...profile, id});
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

		async logIn({ commit, dispatch }, { email, password }) {
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

		async updateProfile({ commit, dispatch }, { data, onSuccess }) {
			const userRef = doc(database, 'users', data.id);

			if (data.exchanges) {
				delete data.exchanges
			}

			await updateDoc(userRef, data);
			commit('updateProfile', data);
			dispatch('toast/success', `Profile has been updated!`, { root: true });
			onSuccess();
		},

		async uploadImage(_, {bytes, name, username, onSuccess, onProgress}) {
			const storage = getStorage()
			const storageRef = ref(storage, `${username}/${username}-${name}`)

			const uploadTask = uploadBytesResumable(storageRef, bytes)
			uploadTask.on("state_changed", (snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				onProgress(progress)
			}, (error) => {
				console.error(error.message);
			}, async () => {
				const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
				onSuccess(downloadUrl)
			})
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
			state.data = { ...state.data, profile };
		},
		updateCredit(state, credit) {
			state.data.credit += credit
		}
	},
};
