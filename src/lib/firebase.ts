import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyAO1sgh0jJz-sqg33uzZ4Z3gs69Yxt1XME",
 authDomain: "gen-lang-client-0736198980.firebaseapp.com",
 projectId: "gen-lang-client-0736198980",
 storageBucket: "gen-lang-client-0736198980.firebasestorage.app",
 messagingSenderId: "583781781396",
 appId: "1:583781781396:web:7686bd03ea1d41f3d78981"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => {
 return signInWithPopup(auth,googleProvder);
};

export default app;
