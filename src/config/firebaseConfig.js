import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCF_3eNJU4SZp_WumuaGubBUXH9CPfebTk",
    authDomain: "instagram-clone-1308.firebaseapp.com",
    databaseURL: "https://instagram-clone-1308.firebaseio.com",
    projectId: "instagram-clone-1308",
    storageBucket: "instagram-clone-1308.appspot.com",
    messagingSenderId: "379123168607",
    appId: "1:379123168607:web:0014cb2559017e7864b2ea",
    measurementId: "G-4VVHJ79EZD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export { storage, db, auth, timestamp }