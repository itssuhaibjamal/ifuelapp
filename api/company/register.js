// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);

// call the  get database method
const db = getFirestore();
// call firebase auth
    
const auth = getAuth(app);
const storage = getStorage();


// form2- get the data from create employe account(this account is for login purpose)
let email = document.getElementById('email');
let pwd = document.getElementById('pwd');
let createaccountbtn = document.getElementById('createaccount');

// this btn is for creating account for company to login their account
createaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  // clicked
  if(email.value != '' && pwd.value != ''){
    // create employe account ((login credentails))
    createUserwithEmailandPwd();
  }else{
    console.log('empty fields');
  }
})




// create account for the company
function createUserwithEmailandPwd(){
  createUserWithEmailAndPassword(auth,email.value,pwd.value).then(()=>{
   }).then(()=>{

           console.log('user email and pwd are created');
           const Logoutclass = async() =>{
               await signOut(auth);
               console.log('logout success');
       }
       Logoutclass();

    
   }).catch((error)=>{
       console.log('error from register.js in company folder: ' + error);
   });
  }