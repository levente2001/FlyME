import * as firebase from "firebase/app";
import "firebase/auth";

if (!process.env.REACT_APP_FIREBASE_CONFIG) {
  console.error("REACT_APP_FIREBASE_CONFIG must be defined");
  console.log("ENV: ", process.env);
}
const firebaseConfig = {
  apiKey: "AIzaSyDMyKH0KiWLOA3q4fodgo6V0OLBRmXKkaw",
  authDomain: "planes-2a59d.firebaseapp.com",
  databaseURL: "https://planes-2a59d-default-rtdb.firebaseio.com",
  projectId: "planes-2a59d",
  storageBucket: "planes-2a59d.appspot.com",
  messagingSenderId: "529584217224",
  appId: "1:529584217224:web:aaaeceedbb2825a736533d",
  measurementId: "G-7E08VS18LD"
};

export function initialize() {
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

export function attachAuthListener(handler) {
  return firebase.auth().onAuthStateChanged(user => {
    handler(user);
  });
}

export async function createNewUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}
