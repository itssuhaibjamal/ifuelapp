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
const loginbtn = document.querySelector('#login');
const errormsg = document.querySelector('#errormsg');




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
    Checkuserrole(user.email)
  
  }).catch((error) =>{
    //    const errorcode = error.code;
    const errormessage = error.message;
    errormsg.style.display = 'block';
    errormsg.innerHTML = errormessage;
  });
}
// check logged user role then redirect it with the suitable dashboard
async function Checkuserrole(useremail) {  
            const docRef = query(collection(db, "userdata") , where("Email", "==", useremail));
            const docSnap = await getDocs(docRef);
            docSnap.forEach((doc) => {
               // doc.data() is never undefined for query doc snapshots
               // console.log(doc.id, " => ", doc.data().role);

               if(doc.data().role == 'admin'){
                  console.log('welcome admin');
                  window.location = 'dashboard.html';

               }
               else if(doc.data().role == 'company'){
                  console.log('welcome Company');
                  window.location = 'company/dashboard.html';

                  
               }
               else if(doc.data().role != 'admin' || doc.data().role == 'company'){
                  errormsg.style.display = 'block';
                  errormsg.innerHTML = 'Sorry You are not allowed to Access the dashboard';
                  
               }else{
                  errormsg.style.display = 'block';
                  errormsg.innerHTML = 'Something went wrong please try again later';


               }
             });
           
   }

   

//    loginbtn.addEventListener('click',Login);
loginbtn.addEventListener('click',function(e){
    e.preventDefault();
    Loginfunction();
});