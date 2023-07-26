// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA_LMVxRtS6ccYSRbWpQkXb5PXF2UcZ4gQ',
  authDomain: 'ltcproject-aa796.firebaseapp.com',
  projectId: 'ltcproject-aa796',
  storageBucket: 'ltcproject-aa796.appspot.com',
  messagingSenderId: '42246760273',
  appId: '1:42246760273:web:007e2dbea8a6193cee1570',
  measurementId: 'G-GD34NJT311'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
