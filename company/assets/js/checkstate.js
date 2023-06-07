import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getAuth , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {firebaseConfig} from './firebase.js';
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const checkAuthState = async() =>{
  onAuthStateChanged(auth,user =>{
    if(!user){
      window.location = '../../login.html';
    }
    else{
      // return true;
      console.log("user authenticated: " + user.email);
    }
    // return false
  });
}

checkAuthState();

// setInterval(checkAuthState(), 100);
// console.log(checkAuthState  != '' ? refresh :'not working');

// auth.onAuthStateChanged((user) => {
//   if (!user) {
//     console.log("No authenticated user found.");
//     window.location = '../../login.html';
//   } else {
//     console.log("Authenticated user found." + user.email);
//   }
// });