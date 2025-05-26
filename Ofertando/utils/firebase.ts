import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASr9evqBxl1kEjglLWtQMwlaJ5gGCJ7ZU",
  authDomain: "appofertando-43aca.firebaseapp.com",
  projectId: "appofertando-43aca",
  storageBucket: "appofertando-43aca.firebasestorage.app",
  messagingSenderId: "807399948017",
  appId: "1:807399948017:web:a634266b1c3a7fd9cef350",
  measurementId: "G-LL0WWB172F"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// aqui também anota o tipo
const auth: Auth = getAuth(app);

export { auth };