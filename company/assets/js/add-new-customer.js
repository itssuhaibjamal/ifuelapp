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
let email = document.getElementById('customer_email');
let pwd = document.getElementById('comp_pass');
let confirm_pass = document.getElementById('confirm_pass');

//inputs from the company create account
let comp_email = document.getElementById('email');
let cname = document.getElementById('customer_name');
let comp_logo = document.getElementById('customer_logo');
let cust_docs = document.getElementById('cust_docs');
let cphone = document.getElementById('customer_phone');
let c_city = document.getElementById('customer_city');
let cregion = document.getElementById('customer_region');
let c_country = document.getElementById('customer_country');


// buttons to submit and the messages
let createaccountbtn = document.getElementById('createnewcustomer');
let createcustomeraccount = document.getElementById('createcustomeraccount');

let errormsg = document.getElementById('errormsg');
let successmsg = document.getElementById('successmsg');

let error_msg = document.getElementById('error-msg');
let success_msg = document.getElementById('success-msg');


createaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  //  check input field  its filled
  if(cname.value != '' && cust_docs.value != ''  && cphone.value != '' && c_city.value !='' && c_country.value !='' && cregion.value !='' && comp_logo.value !=''){
    AddCompany();
    storeuserole_in_usersrole_collection(comp_email);
    
    // createaccountbtn.style.display = 'none';
  }
  else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});

email.addEventListener('change',(event)=>{
  getCurrentFuelInfo(event.target.value)
});

async function getCurrentFuelInfo(name){
  comp_email.value = email.value
      // console.log(result.id);
}

// create customer account
createcustomeraccount.addEventListener('click',function(e){
  e.preventDefault();
  //  check input field  its filled
  if(pwd.value != '' && email.value != ''){
    createUserwithEmailandPwd();
  }
  else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Form Email and Password';
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
   role:'customer',
   created_date:created_date,
   id:userid,
}).then(()=>{
   console.log('user role is created');

}).catch((err)=>{
   console.log("The role isn't created " + err);
   cname.value = '';
   cphone.value = '';
   c_city.value = '';
   cregion.value = '';
   c_country.value = '';
})
}

// get the current date
  let c = new Date();
  let created_date = c.toLocaleDateString();

//2- add company to company collection
async function AddCompany(){
  var ref = collection(db,'customers');
  let value =   uploadimagetofirebasestorage();
  let value2 =   uploadCustomerDocs();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let comp_logo =  await getdownloadedurlafteruploadimage(value);
  let cust_docs =  await getdownloadedurlafteruploadimage(value2);
      const docRef = await addDoc(
        ref,{
          user_fullname:cname.value,
          user_logo:comp_logo,
          user_email:comp_email.value,
          user_document:cust_docs,
          user_phone:cphone.value,
          user_city:c_city.value,
          user_region:cregion.value,
          user_country:c_country.value,
          company_associated: useremail,
          id:userid,
          created_date: created_date,
        }
    ).then(()=>{
        errormsg.style.display = 'none';
        successmsg.style.display = 'block';
        successmsg.innerHTML = 'Data Added Successfully';
        successmsg.innerText = cname.value + ' Company Profile Create Successfully';
        console.log("Successfully created the company");
        cname.value = '';
        cphone.value = '';
        c_city.value = '';
        cregion.value = '';
        c_country.value = '';
        // window.location.href = '../../register.html';
    }).catch((error)=>{
        errormsg.style.display = 'block';
        successmsg.style.display = 'none';
        errormsg.innerHTML = error;
        errormsg.innerText = "error msg "+error;
        cname.value = '';
        cphone.value = '';
        c_city.value = '';
        cregion.value = '';
        c_country.value = '';
    });
}



// //this btn is for creating account for company(company will have ability to login using the dashboard)
// createaccount.addEventListener('click',function(e){
//   e.preventDefault();
//   // clicked
//   if(email.value != '' && pwd.value != ''){
//     // create employe account ((login credentails))
//     createUserwithEmailandPwd();
//     createcustomer.style.display = 'block';
//   }else{
//     alert('empty email and password field')
//   }
// })

// 2- create account for the employee
// auth for the applogin
function createUserwithEmailandPwd(){
  if(email.value != '' && pwd.value == confirm_pass.value){
    createUserWithEmailAndPassword(auth,email.value,pwd.value).then(()=>{

    }).then(()=>{
      console.log('user email and password are created');
      error_msg.style.display = 'none';
      success_msg.style.display = 'block';
      success_msg.innerHTML = 'Data Added Successfully';
      success_msg.innerText = 'This account ' + email.value +  ' and Password are Created Successfully';
      pwd.value = '';
      confirm_pass.value = '';
    }).catch((error)=>{
      console.log('error from assets/js/addnewcompany.js in admin folder: ' + error);
      success_msg.style.display = 'none';
      error_msg.style.display = 'block';
      error_msg.innerText = 'This account ' + email.value +  ' is already exists';
      pwd.value = '';
      confirm_pass.value = '';
    });
  }else{
    alert('The Password is not matched');
    email.value = '';
    pwd.value = '';
    confirm_pass.value = '';
  }
}



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


// upload customer documents
async function uploadCustomerDocs(){
  // const ref= app.storage().ref()
  const file  =  cust_docs.files[0];
  const name = new Date() + '-' + file.name;
  let downloadedimageurl= [];
  let getdata;
  let result;
  // /create child refrence
  const imageref = ref(storage,`images/${name}`);
  // file metadata
  const metadata = {
    contentType: 'image/jpeg',
  };
  // 'file' comes from the Blob or File API
  await uploadBytes(imageref, file,metadata).then((snapshot) => {
    // const downloadurl = ref().getDownloadURL();
    console.log('Image Uploaded Successfully');
    getdata =  getDownloadURL(ref(storage, `images/${name}`))
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
  result =  getdata;
  return result
}