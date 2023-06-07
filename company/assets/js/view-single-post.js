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
let fuel_type = document.getElementById('fuel_type');
let post_title = document.getElementById('post_title');
let fuel_price = document.getElementById('fuel_price');
let created_date = document.getElementById('created_date');


// loading id
let loadingmsg = document.getElementById('loading');


let url = window.location.search;
let check = url.search('view');
//   get the id from url by slicing it  (uid is company id)
let uid = url.slice(6,26);

loadingmsg.innerHTML = 'Please Wait Data Is Loading';
async function viewsinglefuel(){
  var ref = collection(db,"posts");
  const displayselectedfuel = await getDocs(ref);
  displayselectedfuel.forEach(doc => {
    // check if doc.id  from firestore collection equals the uid or(company id)
    if(doc.id == uid){
      post_title.innerHTML = `${doc.data().post_title}`;
      fuel_type.innerHTML = `${doc.data().fuel_type}`;
      fuel_price.innerHTML = `${doc.data().fuel_price}`;
      created_date.innerHTML = `${doc.data().created_date}`;
    }
    loadingmsg.innerHTML = '';
  });
}
viewsinglefuel();