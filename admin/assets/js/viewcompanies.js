// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,collection,getDocs,doc} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';
// firebase intialization
const app = initializeApp(firebaseConfig);

// call the  get database method
const db = getFirestore();

let tr = document.querySelector('#comp_list');
async function ViewData(){
  var ref = collection(db,"company");
  try {
    const docSnap = await getDocs(ref);
    // check if collection that we are fetching if its empty excute the else statement
    if(docSnap.empty){
      // console.log("db isn't empty");
      tr.innerHTML = `<p class='text-center'>There is no data to fetched , please add new data to be displayed</p>`;
     
    }
    // if its not empty  log this message
    else{
      // console.log('Database is not empty');
      let number = 1;
      docSnap.forEach(doc => {
        tr.innerHTML += `
        <tr>
        <td>${number}</td>
        <td><img src='${doc.data().comp_logo}' class='rounded-circle' width=75 height=75></td>
        <td>${doc.data().comp_name}</td>
        <td>${doc.data().comp_email}</td>
        <td>${doc.data().comp_phone}</td>
        <td>${doc.data().created_date}</td>
        <td>
        <a href='view-single-company.html?view=${doc.id}' class='btn btn-primary'>View</a>
        <a href='view_service.html?delete=${doc.id}' class='btn btn-danger'>Delete</a>
        </td>
        </tr>
        `;
        number ++;
      }); 
    }
  } catch (error) {
    tr.innerHTML = '<p class="text-center">Error accoured while display data please refresh the page</p>';
  }
}

//  load website  or run this function when page is loaded
window.onload = ViewData();
//  check url if its equals view pass data to the view form
function displayselectdata () {
  // get the last of the url start from ? symbol
  let url = window.location.search;
  // check if the url contains word view and have id
  let check = url.search('view');
  // check if the url contains word update and have id
  let updateurl = url.search('update');
  // intialize input model variables comes fomt view
  let comp_logo = document.getElementById('comp_logo');
  let comp_name = document.getElementById('comp_name');
  let comp_ceo_name = document.getElementById('comp_ceo_name');
  let comp_detail = document.getElementById('comp_detail');
  let comp_phone = document.getElementById('comp_phone');
  let comp_city = document.getElementById('comp_city');
  let comp_region = document.getElementById('comp_region');
  let comp_country = document.getElementById('comp_country');
  //   get the id from url by slicing it  (uid is company id)
  let uid = url.slice(6,26);
  // read the company collection for particular clicked id (company id)
  async function ViewData(){
    var ref = collection(db,"company");
    const displayselectedcompany = await getDocs(ref);
    displayselectedcompany.forEach(doc => {
      // companylogo.innerHTML = `${doc.data()}`;
      // check if doc.id  from firestore collection equals the uid or(company id)
      if(doc.id == uid){
        comp_logo.innerHTML = `${doc.data().comp_logo}`;
        comp_name.innerHTML = `${doc.data().comp_name}`;
        comp_ceo_name.innerHTML = `${doc.data().comp_ceo_name}`;
        comp_detail.innerHTML = `${doc.data().comp_detail}`;
        comp_phone.innerHTML = `${doc.data().comp_phone}`;
        comp_city.innerHTML = `${doc.data().comp_city}`;
        comp_region.innerHTML = `${doc.data().comp_region}`;
        comp_country.innerHTML = `${doc.data().comp_country}`;
      }
    });
    //   console.log(result.includes(uid)? true : false);
    // console.log(result.valueOf());
  }
  // update singlecompany details
  function updatesinglecompanydetails()
  {
    // put update logic here
    alert('update word found in url');
  }
  // run functions based on web browser
  if(check == 1){
    ViewData();
  }
  else if(updateurl == 1){

  }
}
displayselectdata();