// Import the non-modular version of Firebase SDK
import firebase from "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js";
import { firebaseConfig } from './firebase.js';

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();

// Check user state of login (if user is logged in, redirect to dashboard or login page)
const checkAuthState = async () => {
  await new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = 'index.html';
      } else {
        resolve(true);
      }
    }, reject);
  });
};

setInterval(checkAuthState, 100);