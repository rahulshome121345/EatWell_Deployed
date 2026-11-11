
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: "eatwell-v1-arunima.firebaseapp.com",
    projectId: "eatwell-v1-arunima",
    storageBucket: "eatwell-v1-arunima.firebasestorage.app",
    messagingSenderId: "692904009707",
    appId: "1:692904009707:web:abe77054238c110ff103ae"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
