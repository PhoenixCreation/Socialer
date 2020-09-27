// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA79AKi494FNiNFUNjCBqqOneDthQMhpUE",
  authDomain: "socialer-ab176.firebaseapp.com",
  databaseURL: "https://socialer-ab176.firebaseio.com",
  projectId: "socialer-ab176",
  storageBucket: "socialer-ab176.appspot.com",
  messagingSenderId: "62578825669",
  appId: "1:62578825669:web:e65a6d0979b8c3f07093ac",
  measurementId: "G-R00TB46SH7"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }
