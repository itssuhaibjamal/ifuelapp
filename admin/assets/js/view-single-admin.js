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
let admin_logo = document.getElementById('admin_logo');
let admin_name = document.getElementById('admin_name');
let admin_email = document.getElementById('admin_email');
let admin_gender = document.getElementById('admin_gender');
let admin_phone = document.getElementById('admin_phone');
let admin_city = document.getElementById('admin_city');
let admin_region = document.getElementById('admin_region');
let admin_country = document.getElementById('admin_country');
let created_date = document.getElementById('created_date');

// loading id
let loadingmsg = document.getElementById('loading');


let url = window.location.search;
let check = url.search('view');
//   get the id from url by slicing it  (uid is company id)
let uid = url.slice(6,26);

loadingmsg.innerHTML = 'Please Wait Data Is Loading';
async function displaysignlcompany(){
  var ref = collection(db,"users");
  const displayselectedcompany = await getDocs(ref);
  displayselectedcompany.forEach(doc => {
    // check if doc.id  from firestore collection equals the uid or(company id)
    if(doc.id == uid){
      admin_logo.innerHTML = `<img src='${doc.data().user_logo}' class='rounded-circle' width=50 height=50>`;
      admin_name.innerHTML = `${doc.data().user_fullname}`;
      admin_email.innerHTML = `${doc.data().user_email}`;
      admin_gender.innerHTML = `${doc.data().user_gender}`;
      admin_phone.innerHTML = `${doc.data().user_phone}`;
      admin_city.innerHTML = `${doc.data().user_city}`;
      admin_region.innerHTML = `${doc.data().user_region}`;
      admin_country.innerHTML = `${doc.data().user_country}`;
      created_date.innerHTML = `${doc.data().created_date}`;
    }
    loadingmsg.innerHTML = '';
  });
}
displaysignlcompany();