import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  signInWithPopup,
  onAuthStateChanged
};

export type { User };
