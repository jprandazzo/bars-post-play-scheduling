import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

const firebaseConfigProd = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_PROD,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_PROD,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_PROD,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_PROD,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_PROD,
    appId: process.env.REACT_APP_FIREBASE_APP_ID_PROD,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_PROD,
};

const firebaseConfigDev = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
    appId: process.env.REACT_APP_FIREBASE_APP_ID_DEV,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_DEV,
};

const firebaseConfig =
    process.env.NODE_ENV === 'development'
        ? firebaseConfigDev
        : firebaseConfigProd;

setLogLevel('error');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
