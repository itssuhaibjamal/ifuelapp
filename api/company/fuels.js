import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// call the get databse method

const db = getFirestore();



// get form inputs
let litters = document.getElementById('litters');
let date = document.getElementById('date');
let comp_id = document.getElementById('comp_id');
let fuel_type = document.getElementById('fuel_type');


// company respose success or failed message
let successmsg = document.querySelector('#success-msg');
let errormsg = document.querySelector('#error-msg');
// submit btn
let submitbtn = document.getElementById('addnewdata');



// onclick addEventListener
submitbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  // check input field if its filled
  if(litters.value !='' && date.value != '' && comp_id.value != '' && fuel_type.value != ''){
    Addfueltodb();
  }
  else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});


// insert (add) company data to cloudfirestore
 async function Addfueltodb(){
    var ref = collection(db,'company');

    const docRef = await addDoc(
        ref,{

            litters:litters.value,
            date:date.value,
            comp_id:comp_id.value,
            fuel_type:fuel_type.value,
            companyphone:comp.value,
            employeamount:employeamount.value,
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