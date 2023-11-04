import { initializeApp } from 'firebase/app';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
	apiKey: process.env.APY_KEY,
	authDomain: 'exchangario-41e73.firebaseapp.com',
	projectId: 'exchangario-41e73',
	storageBucket: 'exchangario-41e73.appspot.com',
	messagingSenderId: '465863707972',
	appId: '1:465863707972:web:1ca7988ab26a72b3881b11',
};

initializeApp(firebaseConfig);
export const database = getFirestore()