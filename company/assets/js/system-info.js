// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,collection,getDocs,doc,updateDoc,deleteDoc,getDoc,addDoc,getCountFromServer} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

     // firebase intialization
 const app = initializeApp(firebaseConfig);
 
     // call the  get database method
 const db = getFirestore();

 
 let fuel_litter = document.getElementById('fuel_litter');
 let post_list = document.getElementById('post_list');
 let comp_list = document.getElementById('comp_list');
 let users_list = document.getElementById('customer_list');

 async function allfuels() {
  const coll = collection(db, "fuels");
  const snapshot = await getDocs(coll);

  let totalFuelLitter = 0;

  snapshot.forEach((doc) => {
    const fuelData = doc.data();
    const fuelLitter = parseFloat(fuelData.fuel_litter) || 0; // Parse value as a float or default to 0
    totalFuelLitter += fuelLitter;
  });

  fuel_litter.innerHTML = totalFuelLitter;
}

allfuels();





async function allusers(){
  const coll = collection(db, "users");
  const snapshot = await getCountFromServer(coll);
  users_list.innerHTML = snapshot.data().count;
}
allusers();

async function numberOfCompanies(){
  const coll = collection(db, "company");
  const snapshot = await getCountFromServer(coll);
  comp_list.innerHTML = snapshot.data().count;
}
numberOfCompanies();


async function allposts(){
  const coll = collection(db, "posts");
  const snapshot = await getCountFromServer(coll);
  post_list.innerHTML = snapshot.data().count;
}
allposts();