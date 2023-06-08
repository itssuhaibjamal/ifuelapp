// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {firebaseConfig} from './firebase.js';
// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();
const auth = getAuth(app);
// get element
let comp_logo = document.getElementById('comp_logo');
let comp_name = document.getElementById('comp_name');
let comp_email = document.getElementById('comp_email');
let comp_ceo_name = document.getElementById('comp_ceo_name');
let comp_phone = document.getElementById('comp_phone');
let comp_city = document.getElementById('comp_city');
let comp_region = document.getElementById('comp_region');
let comp_country = document.getElementById('comp_country');
let created_date = document.getElementById('created_date');

// loading id
let loadingmsg = document.getElementById('loading');


let url = window.location.search;
let check = url.search('view');
//   get the id from url by slicing it  (uid is company id)
let uid = url.slice(6,26);

loadingmsg.innerHTML = 'Please Wait Data Is Loading';
async function displaysignlcompany(){
  var ref = collection(db,"customers");
  const displayselectedcompany = await getDocs(ref);
  displayselectedcompany.forEach(doc => {
    // check if doc.id  from firestore collection equals the uid or(company id)
    if(doc.id == uid){
      comp_logo.innerHTML = `<img src='${doc.data().user_logo}' class='rounded-circle' width=75 height=75>`;
      comp_name.innerHTML = `${doc.data().user_fullname}`;
      comp_email.innerHTML = `${doc.data().user_email}`;
      comp_ceo_name.innerHTML = `${doc.data().user_ceo_name}`;
      comp_phone.innerHTML = `${doc.data().user_phone}`;
      comp_city.innerHTML = `${doc.data().user_city}`;
      comp_region.innerHTML = `${doc.data().user_region}`;
      comp_country.innerHTML = `${doc.data().user_country}`;
      created_date.innerHTML = `${doc.data().created_date}`;
    }
    loadingmsg.innerHTML = '';
  });
}
displaysignlcompany();