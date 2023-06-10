import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,getDoc,doc,updateDoc, increment} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();

// intialize input model variables comes from db
let fuel_type = document.getElementById('fuel_type');
let fuel_litter = document.getElementById('fuel_litter');
let fuel_price = document.getElementById('fuel_price');
// update button
let updatefuel = document.getElementById('updatefuel');


// company respose success or failed message
let successmsg = document.querySelector('#successmsg');
let errormsg = document.querySelector('#errormsg');


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
    const docRef = doc(db, "fuels", uid);
    const result = await getDoc(docRef);
    var option = document.createElement('option');
    // option.text = docs.data().servicename;
    if (result.exists()) {
        fuel_type.value = result.data().fuel_type;
        fuel_litter.value = result.data().fuel_litter;
        fuel_price.value = result.data().fuel_price;

        console.log(result.data().fuel_type);
        console.log(result.data().fuel_price);
        // console.log("Document data:", result.data().fullname);
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      } 
    }

    
    
    // update data form function
async function updatefuels() {
  try {
    // get the id from url by slicing it (uid is company id)
    let uid = url.slice(8, 28);
    const ref = doc(db, "fuels", uid.toString());

    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      let oldfuel_litter = docSnap.data().fuel_litter;
      let newfuel_litter = oldfuel_litter + parseFloat(fuel_litter.value);

      await updateDoc(ref, {
        fuel_type: fuel_type.value,
        fuel_litter: newfuel_litter,
        fuel_price: fuel_price.value,
      });

      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Fuel is Updated Successfully';
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    errormsg.style.display = 'block';
    successmsg.style.display = 'none';
    errormsg.innerHTML = error;
  }
}

updatefuel.addEventListener('click', function(e) {
  e.preventDefault();
  updatefuels();
});
