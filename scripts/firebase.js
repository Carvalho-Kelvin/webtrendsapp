// ../scripts/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOejFC9TvqKs7kXAlA9odjvOtuquwDcKs",
  authDomain: "habit-tracker-519c9.firebaseapp.com",
  databaseURL: "https://habit-tracker-519c9-default-rtdb.firebaseio.com/",
  projectId: "habit-tracker-519c9",
  storageBucket: "habit-tracker-519c9.firebasestorage.app",
  messagingSenderId: "513570413784",
  appId: "1:513570413784:web:5253609787097ff37ecbad",
  measurementId: "G-GBMETG3157"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
