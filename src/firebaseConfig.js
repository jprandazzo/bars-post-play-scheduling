import { initializeApp } from "firebase/app";  // Import `getApps` to check existing apps
import { getAuth } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDebOtDhZi9ayD_Ey_rgPySnWT_DheEsS4",
  authDomain: "bars-post-play-scheduling.firebaseapp.com",
  databaseURL: "https://bars-post-play-scheduling-default-rtdb.firebaseio.com",
  projectId: "bars-post-play-scheduling",
  storageBucket: "bars-post-play-scheduling.appspot.com",
  messagingSenderId: "723538198579",
  appId: "1:723538198579:web:cf03f3022506b644c0e346",
  measurementId: "G-45CHPMS1NF"
};

// Initialize Firebase
setLogLevel('error');

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);