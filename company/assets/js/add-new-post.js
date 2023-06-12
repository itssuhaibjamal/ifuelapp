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

//inputs from the company create account
let post_title = document.getElementById('post_title');
let fuel_type = document.getElementById('fuel_type');
let fuel_price = document.getElementById('fuel_price');
let createnewpost = document.getElementById('createnewpost');

let errormsg = document.getElementById('error-msg');
let successmsg = document.getElementById('success-msg');

createnewpost.addEventListener('click',function(e){
  e.preventDefault();
  //  check input field  its filled
  if(post_title.value != '' && fuel_type.value != '' && fuel_price.value != ''){
    AddPost();
    // createaccountbtn.style.display = 'none';
  }
  else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});
// check state of the use
let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    // console.log(user.uid);
    useremail = user.email;
    userid = user.uid;
  }
});

// get the current date
let c = new Date();
let created_date = c.toLocaleString();

//1- add post to posts collection
async function AddPost(){
  var ref = collection(db,'posts');
  const docRef = await addDoc(
    ref,{
      post_title:post_title.value,
      fuel_type:fuel_type.value,
      fuel_price:fuel_price.value,
      company_associated:useremail,
      comp_associated_id:userid,
      created_date: created_date,
    }
    ).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Data Added Successfully';
      successmsg.innerText = post_title.value + ' New post added';
      console.log("Successfully created the post");
      post_title.value = '';
      fuel_type.value = '';
      fuel_price.value = '';
      // window.location.href = '../../register.html';
    }).catch((error)=>{
      errormsg.style.display = 'block';
      successmsg.style.display = 'none';
      errormsg.innerHTML = error;
      errormsg.innerText = "something is not right "+error;
      post_title.value = '';
      fuel_type.value = '';
      fuel_price.value = '';
    });
}