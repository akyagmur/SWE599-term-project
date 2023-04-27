import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmFROT6Q0_WAgGtOIjYFOJPO2UGRRkWzk",
  authDomain: "i-am-safe-swe599.firebaseapp.com",
  databaseURL: 'https://i-am-safe-swe599.firebaseio.com',
  projectId: "i-am-safe-swe599",
  storageBucket: "i-am-safe-swe599.appspot.com",
  messagingSenderId: "448572230257",
  appId: "1:448572230257:web:39fe1767321a35c53f29d0",
  measurementId: "G-XE0SG9FFD9"
};
/* 
const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase */

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export { firebaseAuth, firebaseConfig }