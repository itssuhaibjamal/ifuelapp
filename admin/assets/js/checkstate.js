import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getAuth , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {firebaseConfig} from './firebase.js';
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Authenticated user found:", user.email);
  } else {
    console.log("No authenticated user found.");
    window.location = '../../login.html';
  }
});