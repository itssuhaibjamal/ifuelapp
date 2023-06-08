import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getAuth , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {firebaseConfig} from './firebase.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// check user state of login (if user login redirect to dashboard or loginpage)
const checkAuthState = async() =>{
  onAuthStateChanged(auth,user =>{
    if(!user){
      window.location = '../../login.html';
    }
    else{
      return true;
    }
    // return false
  });
}
setInterval(checkAuthState(), 100);
// console.log(checkAuthState  != '' ? refresh :'not working');