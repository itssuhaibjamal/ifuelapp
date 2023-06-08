// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth , createUserWithEmailAndPassword,signInWithEmailAndPassword,
  onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import {firebaseConfig} from './firebase.js';
// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();
// call firebase auth
const auth = getAuth(app);
const storage = getStorage();


// intialize input data from the form
let email = document.getElementById('email');
let pwd = document.getElementById('comp_pass');
let confirm_pass = document.getElementById('confirm_pass');

// creating the firebase auth of the admin
let createaccount = document.getElementById('createnewadmin');

// error or success messages
let errormsg = document.getElementById('errormsg');
let successmsg = document.getElementById('successmsg');



createaccount.addEventListener('click',function(e){
  e.preventDefault();
  // clicked
  if(email.value != '' && pwd.value != ''){
    // create employe account ((login credentails))
    createUserwithEmailandPwd();
  }else{
    alert('empty email and password field')
  }
})

// 2- create account for the employee
function createUserwithEmailandPwd(){
  createUserWithEmailAndPassword(auth,email.value,pwd.value).then(()=>{
   }).then(()=>{

           console.log('user email and pwd are created');
           const Logoutclass = async() =>{
               await signOut(auth);
               console.log('logout success');
       }

    
   }).catch((error)=>{
       console.log('error from add-employe.js in company folder: ' + error);
   });
  }