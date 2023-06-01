import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';
import {getAuth ,  createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// call the get databse method

const db = getFirestore();


// call firebase auth
const auth = getAuth(app);




// get form inputs
let litters = document.getElementById('litters');
let fuel_type = document.getElementById('fuel_type');


// company respose success or failed message
let successmsg = document.querySelector('#success-msg');
let errormsg = document.querySelector('#error-msg');
// submit btn
let submitbtn = document.getElementById('savefuel');



// onclick addEventListener
submitbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  // check input field if its filled
  if(litters.value !='' && fuel_type.value != ''){
    Addfueltodb();
    errormsg.style.display = 'none';
    successmsg.style.display = 'block';
    successmsg.innerHTML = 'Fuel added successfully';
  }
  else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});

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


// get the current date
let c = new Date();
let created_date = c.toLocaleDateString();


// insert (add) company data to cloudfirestore
async function Addfueltodb(){
    var ref = collection(db,'fuels');

    const docRef = await addDoc(
        ref,{

            litters:litters.value,
            created_date:date.value,
            id:userid,
            fuel_type:fuel_type.value,
            c_email:useremail,
            companydesc:companydesc.value,
        }
    ).then(()=>{
        errormsg.style.display = 'none';
        successmsg.style.display = 'block';
        successmsg.innerHTML = 'Data Added Successfully';
    }).catch((error)=>{
        errormsg.style.display = 'block';
        successmsg.style.display = 'none';
        errormsg.innerHTML = error;
    });
    

}



