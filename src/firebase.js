
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0SO9uPz_8jz0RZCbbRRcjLKu4DEaBpsI",
  authDomain: "hackathon-c7932.firebaseapp.com",
  projectId: "hackathon-c7932",
  storageBucket: "hackathon-c7932.firebasestorage.app",
  messagingSenderId: "455885554812",
  appId: "1:455885554812:web:84dd70d3ddd412fd5535f9",
  measurementId: "G-LPR7Y28DKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleProvider };
