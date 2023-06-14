import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,getDoc,doc,updateDoc} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();

// intialize input model variables comes from db
let customer_name = document.getElementById('customer_name');
let customer_logo = document.getElementById('customer_logo');
let cust_docs = document.getElementById('cust_docs');
let customer_email = document.getElementById('customer_email');
let customer_phone = document.getElementById('customer_phone');
let customer_city = document.getElementById('customer_city');
let customer_region = document.getElementById('customer_region');
let customer_country = document.getElementById('customer_country');

// company respose success or failed message
let successmsg = document.querySelector('#successmsg');
let errormsg = document.querySelector('#errormsg');
// submitbtn
let update_customer = document.getElementById('update_customer');


  // get the last of the url start from ? symbol
  let url = window.location.search;
  // get the url to verify if that should be displayed or not 
  let check = url.search('update');


   
if(check == 1){
viewdatainupdateform();
   
}
else{
   alert('Error Occur While Displaying The Data Please Try Again....');
}



// displaydata in update form function
async function viewdatainupdateform(){
  //   get the id from url by slicing it  (uid is company id)
  let uid = url.slice(8,28);
  console.log(uid)
  const docRef = doc(db, "customers", uid);
  const result = await getDoc(docRef);
  var option = document.createElement('option');
  // option.text = docs.data().servicename;
  if (result.exists()) {
    customer_name.value= result.data().user_fullname;
    customer_logo.file =result.data().user_logo;
    cust_docs.file = result.data().user_document;
    customer_email.value = result.data().user_email;
    customer_phone.value = result.data().user_phone;
    customer_city.value = result.data().user_city;
    customer_region.value = result.data().user_region;
    customer_country.value = result.data().user_country;
    console.log(result.data().user_email);
    console.log(result.data().user_logo);
    // console.log("Document data:", result.data().fullname);
  }
  else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  } 
}

// update data form function
async function updatedata(){
  //   get the id from url by slicing it  (uid is company id)
  let uid = url.slice(8,28);
  const ref = doc(db, "customers", uid.toString());
  await updateDoc(
    ref,{
      user_fullname:cashier_name.value,
      user_logo:cashier_profile_picture.src,
      user_phone:cashier_phone.value,
      user_city:cashier_city.value,
      user_region:cashier_region.value,
      user_country:cashier_country.value,
    }
  ).then(()=>{
    errormsg.style.display = 'none';
    successmsg.style.display = 'block';
    successmsg.innerHTML = 'The customer Updated Successfully';
  }).catch((error)=>{
    errormsg.style.display = 'block';
    successmsg.style.display = 'none';
    errormsg.innerHTML = error;
  });
}
update_customer.addEventListener('click',function(e){
  e.preventDefault();
  updatedata();
});