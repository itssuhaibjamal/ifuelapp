   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
   import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";
   import {getAuth , 
       createUserWithEmailAndPassword,
       signInWithEmailAndPassword,
       onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
       import {getFirestore,where,collection,getDocs,query} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
   
    import {firebaseConfig} from './firebase.js';
    
   // get id names from the form
   const email = document.querySelector('#email');
   const password = document.querySelector('#pwd');
   const loginbtn = document.querySelector('#createaccount');
   const errormsg = document.querySelector('#errormsg');
   const successmsg = document.querySelector('#successmsg');
   
   let redirectlogin = document.getElementById('reddash');
   let loginpage = document.getElementById('loginlink');
   let registerAccountBtn = document.getElementById('registerAccount');
   
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   
   // call the  get database method
const db = getFirestore();
// Login user
const Loginfunction = async() =>{
   const loginwithemail = email.value;
   const loginwithpassword = password.value;
   signInWithEmailAndPassword(auth,loginwithemail,loginwithpassword).then((usercredential)=>{
      // getting the current user that logged in email
      const user = usercredential.user;
      //   this function check user role to decide wheather to let the user in or not (admin,company are only allowed)
      CheckUserRole(user.email);
      email.innerText = '';
      pwd.innerText = '';
   }).catch((error) =>{
      //    const errorcode = error.code;
      const errormessage = error.message;
      errormsg.style.display = 'block';
      errormsg.innerHTML = errormessage;
      email.innerHTML = '';
      pwd.innerHTML = '';
   });
}
// check logged user role then redirect it with the suitable dashboard
async function CheckUserRole(useremail) {
  const docRef = collection(db, "usersrole");
  const q = query(docRef, where("email", "==", useremail));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // User role not found
    errormsg.style.display = 'block';
    window.location = '../../create-profile-company.html';
    email.innerHTML = '';
    pwd.innerHTML = '';
    return;
  }

  const userRole = querySnapshot.docs[0].data().role;

  if (!userRole) {
    // Role field is empty
    console.log('Hey, you haven\'t created your profile yet.');
    errormsg.style.display = 'Something is not right';
    window.location = '../../create-profile-company.html';
  } else if (userRole === 'admin') {
    console.log('Welcome admin');
    window.location = '../../admin/index.html';
    successmsg.innerHTML = 'Sorry, you are not allowed to access the dashboard.';
  } else if (userRole === 'company') {
    console.log('Welcome company');
    window.location = '../company/index.html';
    email.value = '';
    pwd.value = '';
  } else {
    // Invalid role
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Sorry, you are not allowed to access the dashboard.';
    email.value = '';
    pwd.value = '';
  }
}


// when it click the fill the account btn
redirectlogin.addEventListener('click',function(e){
  e.preventDefault();
  window.location.href = '../../login.html';
});


//    loginbtn.addEventListener('click',Login);
loginbtn.addEventListener('click',function(e){
  e.preventDefault();
  Loginfunction();
  window.onload = function() {
    // Your code here
    document.getElementById('email').textContent = 'none';
  };
});   