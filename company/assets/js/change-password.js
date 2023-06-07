// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
import {getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged,signOut,updatePassword} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,where,collection,getDocs,query} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// call the  get database method
const db = getFirestore();
// change password form
let newpwd = document.getElementById('newPassword');
let re_enterpwd = document.getElementById('renewPassword');
let changepwdbtn = document.getElementById('changepwd')

let errormsg = document.getElementById('error-msg');
let successmsg = document.getElementById('success-msg');

changepwdbtn.addEventListener('click',function (e) {
  e.preventDefault();
  if(newpwd.value == ''){
    errormsg.style.display= 'block';
    successmsg.style.display = 'none';
    errormsg.innerHTML = "Empty  password fields";
  }else if(re_enterpwd.value == ''){
    errormsg.style.display = 'block';
    successmsg.style.display = 'none';
    errormsg.innerHTML = "Empty re-enter password fields";
  }else if(newpwd.value != re_enterpwd.value ){
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = "Password don't match";
  }else{
    auth.onAuthStateChanged((user)=>{
      if(user !=null){
        user.email;
        const users = auth.currentUser;
        console.log(users.accessToken
          );
          // update password 
          updatePassword(users,newpwd.value).then(() => {
            // Update successful.
            errormsg.style.display = 'none';
            successmsg.style.display = 'block';
            successmsg.innerHTML = 'password changed successfully';
          }).catch((error) => {
            // An error ocurred
            errormsg.style.display= 'block';
            successmsg.style.display = 'none';
            errormsg.innerHTML = 'password failed to change';
          });
        }
      });
    }
  })