// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZa5bID9BVGCHKprx7amBNt4yTeCqK_k0",
  authDomain: "edbot-6024c.firebaseapp.com",
  projectId: "edbot-6024c",
  storageBucket: "edbot-6024c.firebasestorage.app",
  messagingSenderId: "323122555465",
  appId: "1:323122555465:web:fdbeed48d1b2ee988bad98",
  measurementId: "G-H0VJLNG0ZE",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };