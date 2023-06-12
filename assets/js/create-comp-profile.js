// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth , createUserWithEmailAndPassword,signInWithEmailAndPassword,
  onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

import {firebaseConfig} from './firebase.js';
// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();
// call firebase auth
const auth = getAuth(app);
const storage = getStorage();

// intialize input data from the form

let cname = document.getElementById('comp_name');
let comp_logo = document.getElementById('comp_logo');
let ceoname = document.getElementById('comp_ceoname');
let detail = document.getElementById('comp_detail');
let caddress = document.getElementById('comp_business');
let cphone = document.getElementById('comp_phone');
let c_city = document.getElementById('comp_city');
let cregion = document.getElementById('comp_region');
let c_country = document.getElementById('comp_country');
let createaccountbtn = document.getElementById('createaccount');
let errormsg = document.getElementById('errormsg');
let successmsg = document.getElementById('successmsg');
let createform = document.getElementById('createform');
let logindashboard = document.getElementById('reddash');


logindashboard.addEventListener('click',function(e){
  e.preventDefault();
  window.location.href = '../company/dashboard.html';
});


createaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  //  check input field  its filled
  if(cname.value != '' && ceoname.value != '' && detail.value != '' && caddress.value != '' && cphone.value != '' && c_city.value !='' && c_country.value !='' && cregion.value !=''){
    AddCompany();
    storeuserole_in_usersrole_collection(useremail);
    createaccountbtn.style.display = 'none';
    logindashboard.style.display = 'block';
    logindashboard.innerHTML = 'Go to the Dashboard';
  }
  else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});




// check state of the use

let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
    if(user){
       // console.log(user.uid);
       useremail = user.email;
       userid = user.uid;
    }
   });

// 3- ad role data usersdata collection
async function storeuserole_in_usersrole_collection(email){
let docRef = collection(db,'usersrole');
let docSnap = await addDoc( docRef,{
   email: useremail,
   role:'company',
   addeddate:created_date,
   id:userid,
}).then(()=>{
   console.log('user role is created');

}).catch((err)=>{
   console.log(err);
})
}




// get the current date
  let c = new Date();
  let created_date = c.toLocaleDateString();

// 2- add company to company collection
async function AddCompany(){
  let value =   uploadimagetofirebasestorage();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let comp_logo =  await getdownloadedurlafteruploadimage(value);
  var ref = collection(db,'company');
  const docRef = await addDoc(
      ref,{
          comp_email:useremail,
          comp_name:cname.value,
          comp_logo:comp_logo,
          comp_ceo_name:ceoname.value,
          comp_detail:detail.value,
          comp_business_card:caddress.value,
          comp_phone:cphone.value,
          comp_city:c_city.value,
          comp_region:cregion.value,
          comp_country:c_country.value,
       
          created_date: created_date,
      }
  ).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Data Added Successfully';
      successmsg.innerText = 'Company Profile Create Successfully';
      console.log("Successfully created the company");
      cname.value = '';
      ceoname.value = '';
      detail.value = '';
      caddress.value = '';
      cphone.value = '';
      c_city.value = '';
      cregion.value = '';
      c_country.value = '';
      // window.location.href = '../../register.html';
  }).catch((error)=>{
      errormsg.style.display = 'block';
      successmsg.style.display = 'none';
      errormsg.innerHTML = error;
      errormsg.innerText = "error msg"+error;
      cname.value = '';
      ceoname.value = '';
      detail.value = '';
      caddress.value = '';
      cphone.value = '';
      c_city.value = '';
      cregion.value = '';
      c_country.value = '';
  });
}


//  add image to firebase storeage
async function uploadimagetofirebasestorage(){
  // const ref= app.storage().ref()
  const file  =  comp_logo.files[0];
  const name = new Date() + '-' + file.name;
  let downloadedimageurl= [];
  let getdata;
  let result;
  // /create child refrence
  const imageref = ref(storage,`image/${name}`);
  // file metadata
  const metadata = {
      contentType: 'image/jpeg',
    };
    // 'file' comes from the Blob or File API
    await uploadBytes(imageref, file,metadata).then((snapshot) => {
      // const downloadurl = ref().getDownloadURL();
      console.log('Image Uploaded Successfully');
      getdata =  getDownloadURL(ref(storage, `image/${name}`))
      .then((url) =>  {
        // `url` is the download URL for 'images/stars.jpg'
        return downloadedimageurl[0] = url;
      })
      .catch((error) => {
        // Handle any errors
        console.log(`error message: ${error}`);
      });
      return downloadedimageurl[0]
    });
    result = await getdata;
    return result
  }
async function getdownloadedurlafteruploadimage(result){
const a = await result;
console.log('from below function ',a);
return a;
}