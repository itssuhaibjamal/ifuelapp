// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth ,  createUserWithEmailAndPassword, signInWithEmailAndPassword,
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

let compemail = document.getElementById('useremail');
let cname = document.getElementById('cname');
let urlofimg = document.getElementById('clogo');
let ceoname = document.getElementById('ceoname');
let detail = document.getElementById('detail');
let caddress = document.getElementById('caddress');
let cphone = document.getElementById('cphone');
let c_city = document.getElementById('c_city');
let cregion = document.getElementById('cregion');
let c_country = document.getElementById('c_country');


// company respose success or failed message
let successmsg = document.getElementById('successmsg');
let errormsg = document.getElementById('errormsg');


let signupaccountbtn = document.getElementById('signupaccount');
let createaccountbtn = document.getElementById('createaccount');
let enabledata = document.getElementById('adminData');

signupaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  // clicked
  console.log('working');
  if(enabledata.style.display == 'block' && cname.value =='' && clogo.value == '' && ceoname.value == '' && detail.value == '' &&
  caddress.value =='' && cphone.value == '' && c_city.value == '' && cregion.value == '' && c_country.value ==''){
    // create employe account ((login credentails))
    console.log('empty fields');
    enabledata.style.display = 'none';
    errormsg.style.display = 'block';
    successmsg.style.display = 'none';
    errormsg.innerHTML = error;
  }else{
    createUserwithEmailandPwd();
    enabledata.style.display = 'block';
    errormsg.style.display = 'none';
    successmsg.style.display = 'block';
    successmsg.innerHTML = 'Your Account Created Successfully';
    // createaccountform.style.display = 'block';
  }
})



// auth for the applogin
function createUserwithEmailandPwd(){
  createUserWithEmailAndPassword(auth,email.value,pwd.value).then(()=>{
   }).then(()=>{
    console.log('user email and pwd are created');
    const Logoutclass = async() =>{
      await signOut(auth);
      console.log('logout success');
    }
    Logoutclass();
  }).catch((error)=>{
    console.log('error from addNewUser.js in company folder: ' + error);
  });
}

// check the auth change status then get the email of the user
let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    // console.log(user.uid);
    useremail = user.email;
    userid = user.uid;
  }
});

createaccountbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  // check input field  its filled
  if(cname.value !='' && clogo.value != '' && ceoname.value != '' && detail.value != '' &&
  caddress.value !='' && cphone.value != '' && c_city.value != '' && cregion.value != '' && c_country.value !=''){
    console.log('working');
    // store employee data in firestore
    CreateNewComp();
    //  store role to userdata collection so user can use the app
    storcompdata_inn_usersrole_collection(compemail.value);
  }else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});


// get the current date
let c = new Date();
let created_date = c.toLocaleDateString();

// 2- add company to company collection
async function CreateNewComp(){
var ref = collection(db,'company');
 // call the function that uploads the ikmage to firebase storage
 let value =   uploadimagetofirebasestorage();
 // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
 let urlofimg =  await getdownloadedurlafteruploadimage(value);

const docRef = await addDoc(
    ref,{
        
        c_email:compemail.value,
        cname:cname.value,
        c_logo:urlofimg,
        ceoname:ceoname.value,
        c_detail:detail.value,
        c_address:caddress.value,
        c_phone:cphone.value,
        c_city:c_city.value,
        c_region:cregion.value,
        c_country:c_country.value,
        id:userid,
     
        created_date: created_date,
      
    
    }
).then(()=>{
    errormsg.style.display = 'none';
    successmsg.style.display = 'block';
    successmsg.innerHTML = 'Data Added Successfully';
    successmsg.innerText = 'Company Data Create Successfully';
    // window.location.href = '../../login.html';
}).catch((error)=>{
    errormsg.style.display = 'block';
    successmsg.style.display = 'none';
    errormsg.innerHTML = error;
    errormsg.innerText = "error msg"+error;
});


}


// 3- store users (email) in userdata for the role login
async function storcompdata_inn_usersrole_collection(email){
  let docRef = collection(db,'usersrole');
  let docSnap = await addDoc( docRef,{
    email: email,
    name:cname.value,
    addeddate:created_date,
    id:userid,
    role:'company',
  }).then(()=>{
    console.log('user role is created');
  }).catch((err)=>{
    console.log(err);
  })
}


//  addimage to firebase storeage
async function uploadimagetofirebasestorage(){
  // const ref= app.storage().ref()
  const file  =  urlofimg.files[0];
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
  result = await getdata;
  return result
}



async function getdownloadedurlafteruploadimage(result){
const a = await result;
console.log('from below function ',a);
return a;
}