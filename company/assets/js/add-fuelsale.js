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
let idinput = document.getElementById('idinput')
let customer_name= document.getElementById('customer_name');
let customer_email= document.getElementById('customer_email');
let customer_phone= document.getElementById('customer_phone');
let fuel_litter= document.getElementById('fuel_litter');
let customer_type= document.getElementById('customer_type');
let payment_method= document.getElementById('payment_method');
let fuel_type= document.getElementById('fuel_type');
let fuel_price= document.getElementById('fuel_price');
let total_price = document.getElementById('total_price');
let submitbtn= document.getElementById('submit');

// error or success message id elements
let error_msg = document.getElementById('error_msg');
let success_msg = document.getElementById('success_msg');

// customers information from the customers collection
// customers information from the customers collection
async function displayCustomersName() {
  let user = firebase.auth().currentUser;
  let userEmail = user.email;

  let Docref = collection(db, 'customers').where('comp_associated', '==', userEmail);
  let Docsnap = await getDocs(Docref);

  Docsnap.forEach((doc) => {
    var option = document.createElement('option');
    option.text = doc.data().user_fullname;
    customer_name.options.add(option);
  });

  // check the change of the value in select element
  customer_name.addEventListener('change', (event) => {
    getCurrentCustomerInfo(event.target.value, userEmail);
  });
}

async function getCurrentCustomerInfo(name, userEmail) {
  let Docref = collection(db, 'customers').where('comp_associated', '==', userEmail);
  let result = await getDocs(Docref);

  result.forEach((doc) => {
    if (doc.data().user_fullname === name) {
      console.log(doc.id);
      console.log(doc.data().user_fullname);
      console.log(doc.data().user_email);
      console.log(doc.data().user_phone);
    }
  });
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

async function AddFuelSale() {
  try {
    const fuelsRef = collection(db, "fuels"); // Reference to the "fuels" collection
    const fuelsaleRef = collection(db, "fuelsale"); // Reference to the "fuelsale" collection
    const fuelLitterValue = parseFloat(fuel_litter.value);
    const fuelTypeValue = fuel_type.value;

    // Fetch the relevant document from the "fuels" collection
    const querySnapshot = await getDocs(query(fuelsRef, where("fuel_type", "==", fuelTypeValue)));

    if (querySnapshot.empty) {
      console.log("No such document!");
      return;
    }

    const fuelDocRef = querySnapshot.docs[0].ref;
    const oldFuelLitter = querySnapshot.docs[0].data().fuel_litter;
    const newFuelLitter = oldFuelLitter - fuelLitterValue;

    // Perform the transaction to update the fuel litter value in the "fuels" collection
    await runTransaction(db, async (transaction) => {
      transaction.update(fuelDocRef, { fuel_litter: newFuelLitter });

      // Add the fuel sale document to the "fuelsale" collection
      await addDoc(fuelsaleRef, {
        customer_name: customer_name.value,
        customer_email: customer_email.value,
        customer_phone: customer_phone.value,
        fuel_litter: fuelLitterValue,
        customer_type: customer_type.value,
        payment_method: payment_method.value,
        fuel_type: fuelTypeValue,
        fuel_price: fuel_price.value,
        total_price: total_price.value,
        company_associated: useremail,
        created_date: created_date,
      });
    });

    // Display success message
    error_msg.style.display = 'none';
    success_msg.style.display = 'block';
    success_msg.innerHTML = 'Fuel Sale added successfully';
  } catch (error) {
    // Display error message
    error_msg.style.display = 'block';
    success_msg.style.display = 'none';
    error_msg.innerHTML = error;
  }
}


async function AddLoan(){
    var ref = collection(db,'loan');
    if(payment_method.value == "loan" || payment_method.value == "Loan"){
        const docRef = await addDoc(
            ref,{
                customer_name: customer_name.value,
                customer_email: customer_email.value,
                customer_phone: customer_phone.value,
                fuel_litter: fuel_litter.value,
                customer_type: customer_type.value,
                payment_method: payment_method.value,
                fuel_type: fuel_type.value,
                fuel_price: fuel_price.value,
                total_price: total_price.value,
                company_associated:useremail,
                created_date: created_date,
            })
            .then(()=>{
              error_msg.style.display = 'none';
              success_msg.style.display = 'block';
              success_msg.innerHTML = 'new loan of : ' + customer_name.value+ '   is created successfully';
              console.log('loan data added to loan collection');
            }).catch((error)=>{
              error_msg.style.display = 'block';
              success_msg.style.display = 'none';
              error_msg.innerHTML = error;
              console.log("error msg ", error);
            });
    }
}



submitbtn.addEventListener('click',function() {
    AddFuelSale();
    AddLoan();
})