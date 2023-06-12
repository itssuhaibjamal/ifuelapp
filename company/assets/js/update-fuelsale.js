// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,collection,getDocs,doc,updateDoc, query, runTransaction ,deleteDoc,getDoc,addDoc, where} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();
//getting the function getAuth of the firebase authentications
const auth = getAuth(app);

// id element of the input and assigning variable
let customer_name= document.getElementById('customer_name');
let customer_email= document.getElementById('customer_email');
let customer_phone= document.getElementById('customer_phone');
let fuel_litter= document.getElementById('fuel_litter');
let customer_type= document.getElementById('customer_type');
let payment_method= document.getElementById('payment_method');
let fuel_type= document.getElementById('fuel_type');
let fuel_price= document.getElementById('fuel_price');
let total_price = document.getElementById('total_price');

//button to update the fuelsale collection declaring
let submitbtn= document.getElementById('updatefuelsale');

// error or success message id elements
let errormsg = document.getElementById('error_msg');
let successmsg = document.getElementById('success_msg');

// customers information from the customers collection
async function displayCustomersName(){
    let Docref = collection(db,'customers');
    let Docsnap = await getDocs(Docref);
    Docsnap.forEach(docs => {
        var option = document.createElement('option');
        option.text = docs.data().user_fullname;
        customer_name.options.add(option)
    });
    // check the change of the value in select element
    customer_name.addEventListener('change',(event)=>{
        getCurrentCustomerInfo(event.target.value)
    });
}

async function getCurrentCustomerInfo(name){
    let Docref = collection(db,'customers');
    let result = await getDocs(Docref);
    result.forEach(doc =>{
        // check if the select element inside the subscription form
        if(doc.data().user_fullname == name){
            console.log(idinput.textContent);
            idinput.innerHTML =doc.id;
                customer_email.value= doc.data().user_email;
                customer_phone.value = doc.data().user_phone;
            }
        });
        // console.log(result.id);
}
// display company names in the select form
displayCustomersName();

// fuels information
// customers information from the customers collection
async function displayFuelsType(){
  let Docref = collection(db,'fuels');
  let Docsnap = await getDocs(Docref);
  Docsnap.forEach(docs => {
      var option = document.createElement('option');
      option.text = docs.data().fuel_type;
      fuel_type.options.add(option)
  });
  // check the change of the value in select element
  fuel_type.addEventListener('change',(event)=>{
      getCurrentFuelInfo(event.target.value)
  });
}

async function getCurrentFuelInfo(name){
  let Docref = collection(db,'fuels');
  let result = await getDocs(Docref);
  result.forEach(doc =>{
      // check if the select element inside the subscription form
      if(doc.data().fuel_type == name){
          console.log(idinput.textContent);
          idinput.innerHTML =doc.id;
              fuel_price.value= doc.data().fuel_price;
              total_price.value = doc.data().fuel_price * fuel_litter.value;
          }
      });
      // console.log(result.id);
}
// display company names in the select form
displayFuelsType();

// getting the current user login email and uid
let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    useremail = user.email;
    userid = user.uid;
  }
});

// store subscription data in the subscription collection
let c = new Date();
let created_date = new Date().toLocaleString();

//update the fuelsale collections

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
  const docRef = doc(db, "fuelsale", uid);
  const result = await getDoc(docRef);
  var option = document.createElement('option');
  // option.text = docs.data().servicename;
  if (result.exists()) {
    fuel_type.value = result.data().fuel_type;
    fuel_litter.value = result.data().fuel_litter;
    fuel_price.value = result.data().fuel_price;
    customer_name.value = result.data().customer_name
    customer_email.value = result.data().customer_email
    customer_phone.value = result.data().customer_phone
    customer_type.value = result.data().customer_type
    payment_method.value = result.data().payment_method
    total_price.value = result.data().total_price
    console.log(result.data().fuel_type);
    console.log(result.data().fuel_price);
    // console.log("Document data:", result.data().fullname);
  }
  else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  } 
}


// Update data function
async function UpdateFuelSale() {
  try {
    let uid = url.slice(8, 28); // Assuming the UID is 20 characters long
    const docRef = doc(db, "fuelsale", uid);
    const fuelSaleDoc = await getDoc(docRef);

    if (fuelSaleDoc.exists()) {
      // Get the updated values
      const newFuelLitter = fuel_litter.value;
      const newCustomerName = customer_name.value;
      const newCustomerEmail = customer_email.value;
      const newCustomerPhone = customer_phone.value;
      const newCustomerType = customer_type.value;
      const newPaymentMethod = payment_method.value;

      // Update the "fuelsale" collection only if the fuel_type matches
      if (fuelSaleDoc.data().fuel_type === fuel_type.value) {
        // Calculate the difference in fuel_litter
        const fuelLitterDifference = newFuelLitter - fuelSaleDoc.data().fuel_litter;

        // Update the "fuelsale" collection
        await updateDoc(docRef, {
          fuel_litter: newFuelLitter,
          customer_name: newCustomerName,
          customer_email: newCustomerEmail,
          customer_phone: newCustomerPhone,
          customer_type: newCustomerType,
          payment_method: newPaymentMethod,
          total_price: total_price.value
        });

        // Update the "fuels" collection where fuel_type matches
        const fuelsRef = collection(db, "fuels");
        const fuelsQuerySnapshot = await getDocs(fuelsRef);

        fuelsQuerySnapshot.forEach(async (fuelsDoc) => {
          if (fuelsDoc.data().fuel_type === fuel_type.value) {
            const oldFuelsLitter = fuelsDoc.data().fuel_litter;

            // Calculate the new fuel_litter value for the "fuels" collection
            const newFuelsLitter = oldFuelsLitter - fuelLitterDifference;

            // Update the "fuels" collection with the new fuel_litter value
            await updateDoc(fuelsDoc.ref, {
              fuel_litter: newFuelsLitter
            });
          }
        });

        console.log("Fuel sale updated successfully");
        window.location.href = "view-fuelsale.html";
        alert("Fuel sale updated successfully");
      } else {
        console.log("No matching fuel type!");
      }
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error updating fuel sale:", error);
  }
}





submitbtn.addEventListener('click',function() {
  UpdateFuelSale();
})