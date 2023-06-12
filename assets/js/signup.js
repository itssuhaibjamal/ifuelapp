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


let email = document.getElementById('email');
let pwd = document.getElementById('pwd');
let confirm_password = document.getElementById('confirm_password');

let errormsg = document.getElementById('errormsg');
let successmsg = document.getElementById('successmsg');
let redirectlogin = document.getElementById('loginpage');
let lblemail = document.getElementById('lblemail');
let lblpwd = document.getElementById('lblpwd');
let loginpage = document.getElementById('loginlink');


let registerAccountBtn = document.getElementById('registerAccount');

registerAccountBtn.addEventListener('click',function(e){
  e.preventDefault();
  if(email.value != '' && pwd.value != '' && confirm_password.value != ''){
    createUserwithEmailandPwd();
  }else{
    alert("the field are empty")
  }
});


redirectlogin.addEventListener('click',function(e){
  e.preventDefault();
  window.location.href = '../../login.html';
});




// 4- create account with  email and password (auth)
function createUserwithEmailandPwd(){
  if(pwd.value == confirm_password.value){
    createUserWithEmailAndPassword(auth,email.value,pwd.value).then(()=>{

    }).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      registerAccountBtn.style.display = 'none';
      email.style.display = 'none';
      pwd.style.display = 'none';
      lblemail.style.display = 'none';
      lblpwd.style.display = 'none';
      loginpage.style.display = 'none';
      redirectlogin.style.display = 'block';
      successmsg.innerText = 'user email and pwd are created login to your account';
      redirectlogin.innerText = 'login now';
      email.value = '';
      pwd.value = '';
      loginpage.innerText = '';
      const Logoutclass = async() =>{
        await signOut(auth);
        console.log('logout success');
      }
      Logoutclass();
    }).catch((error)=>{
      successmsg.style.display = 'none';
      errormsg.style.display = 'block';
      errormsg.innerText = 'email and password are already exists';
    });
  }else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'The password are not matched!....';
  }
}