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
let email = document.getElementById('email');
let pwd = document.getElementById('comp_pass');
let confirm_pass = document.getElementById('confirm_pass');

//inputs from the company create account
let comp_email = document.getElementById('admin_email');
let cname = document.getElementById('admin_name');
let comp_logo = document.getElementById('admin_profile_picture');
let ceoname = document.getElementById('admin_gender');
let cphone = document.getElementById('admin_phone');
let c_city = document.getElementById('admin_city');
let cregion = document.getElementById('admin_region');
let c_country = document.getElementById('admin_country');


// creating the firebase auth of the admin
let createaccountbtn = document.getElementById('createnewadmin');

// create the cashier account details
let createcashier = document.getElementById('createcashier');

// creating account of the admin
let createaccount = document.getElementById('createadminaccount');
let errormsg = document.getElementById('errormsg');
let successmsg = document.getElementById('successmsg');

let error_msg = document.getElementById('error-msg');
let success_msg = document.getElementById('success-msg');

createaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  //  check input field  its filled
  if(cname.value != '' && ceoname.value != '' && cphone.value != '' && c_city.value !='' && c_country.value !='' && cregion.value !='' && comp_logo.value !=''){
    AddAdmin();
    storeuserole_in_usersrole_collection(comp_email);
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
async function storeuserole_in_usersrole_collection(comp_email){
let docRef = collection(db,'usersrole');
let docSnap = await addDoc( docRef,{
   email: comp_email.value,
   role:'cashier',
   created_date:created_date,
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
async function AddAdmin(){
  var ref = collection(db,'users');
  let value =   uploadimagetofirebasestorage();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let comp_logo =  await getdownloadedurlafteruploadimage(value);

  const docRef = await addDoc(
      ref,{
        user_fullname:cname.value,
        user_logo:comp_logo,
        user_email:comp_email.value,
        user_gender:ceoname.value,
        user_phone:cphone.value,
        user_city:c_city.value,
        user_region:cregion.value,
        user_country:c_country.value,
        comp_associated:useremail,
        id:userid,
        created_date: created_date,
        
      
      }
  ).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Data Added Successfully';
      successmsg.innerText = 'Admin Profile Create Successfully';
      console.log("Successfully created the admin");
      cname.value = '';
      ceoname.value = '';
      comp_email.value = '';
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
      comp_email.value = '';
      cphone.value = '';
      c_city.value = '';
      cregion.value = '';
      c_country.value = '';
  });
}



//this btn is for creating account for company(company will have ability to login using the dashboard)




//  addimage to firebase storeage
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