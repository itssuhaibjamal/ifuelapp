// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
  
import {getStorage,ref,uploadBytes,getDownloadURL} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);

// call the  get database method
const db = getFirestore();

// call firebase auth
const auth = getAuth(app);
// check the auth change status then get the email of the user
let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    // console.log(user.uid);
    useremail = user.email;
    userid = user.uid;
  }
});
let comp_logo = document.getElementById('comp_logo');
let comp_name = document.getElementById('comp_name');
let comp_subname = document.getElementById('comp_subname');

async function getCompProfile(){
  let dRef = collection(db,'company');
  let docRef = await getDocs(dRef);
  docRef.forEach(doc => {
    if(doc.data().comp_email == useremail){
      comp_logo.src = `${doc.data().comp_logo}`;
      comp_name.innerHTML = doc.data().comp_name;
      comp_subname.innerHTML = doc.data().comp_name;
    }
  });
}
window.onload = getCompProfile();