import * as firebase from "firebase/app";
import "firebase/auth";

if (!process.env.REACT_APP_FIREBASE_CONFIG) {
  console.error("REACT_APP_FIREBASE_CONFIG must be defined");
  console.log("ENV: ", process.env);
}
const firebaseConfig = {
  apiKey: "AIzaSyBiHEwEm7xUXnkbCjRPMT2bhbGVAxg8lpM",
  authDomain: "uberforplanes.firebaseapp.com",
  projectId: "uberforplanes",
  storageBucket: "uberforplanes.appspot.com",
  messagingSenderId: "333900224975",
  appId: "1:333900224975:web:2f4aa920a2123f9ffb1aba",
  measurementId: "G-BZ6R6RF1C7"
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
