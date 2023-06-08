// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,addDoc,collection,getDocs} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword,
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


// form1- get data from user form
let admin_email = document.getElementById('admin_email');
let admin_name = document.getElementById('admin_name');
let admin_logo = document.getElementById('admin_profile_picture');
let admin_gender = document.getElementById('admin_gender');
let admin_phone = document.getElementById('admin_phone');
let admin_city = document.getElementById('admin_city');
let admin_region = document.getElementById('admin_region');
let admin_country = document.getElementById('admin_country');

// Handle the error or success message in the storing cashier in users collection
let errormsg = document.getElementById('errormsg');
let successmsg = document.getElementById('successmsg');

// Handle the error or success message in the creating the cashier auth
let success_msg = document.querySelector('#success-msg');
let error_msg = document.querySelector('#error-msg');
// submit btn
let submitbtn = document.getElementById('createnewadmin');


// input from the creating cashier authentication
let email = document.getElementById('email');
let pwd = document.getElementById('comp_pass');
let confirm_pass = document.getElementById('confirm_pass');
let createaccountbtn = document.getElementById('createadminaccount');

// check the auth change status then get the email of the user
let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    useremail = user.email;
    userid = user.uid;
  }
});
// when it click the submit button it will check first the inputs whether its
// empty or not if is not empty it will store the collection named "users"
submitbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  //  check input field  its filled
  if(admin_email.value !='' && admin_name.value != '' && admin_gender.value != '' && admin_phone.value != '' && admin_city.value != '' && admin_region.value !='' && admin_country.value !='' && admin_logo.value !=''){
    // store cashier data in firestore
    AddCashier();
    //  store role to userdata collection so user can use the app
    storeCashierRole(admin_email.value);
  }else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});

// get the current date
let c = new Date();
let created_date = c.toLocaleDateString();
// the function to store the cashier's data inthe users collection
async function AddCashier(){
  var ref = collection(db,'users');
  // call the function that uploads the image to firebase storage
  let value =   uploadimagetofirebasestorage();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let urlofimg =  await getdownloadedurlafteruploadimage(value);
  const docRef = await addDoc(
    ref,{
      user_fullname:admin_name.value,
      user_logo:urlofimg,
      user_email:admin_email.value,
      user_gender:admin_gender.value,
      user_phone:admin_phone.value,
      user_city:admin_city.value,
      user_region:admin_region.value,
      user_country:admin_country.value,
      
      company_associated:useremail,
      created_date: created_date,
    })
    .then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'new cashier: ' +admin_email.value+ ' created successfully';
      console.log('cashier data added to users collection');
    }).catch((error)=>{
      errormsg.style.display = 'block';
      successmsg.style.display = 'none';
      errormsg.innerHTML = error;
      console.log("error msg ", error);
    });
}

// this function stores the cashier's role to be able to login the system
// as a parameter it will take the email input from the cashier's email
async function storeCashierRole(email){
  let docRef = collection(db,'usersrole');
  let docSnap = await addDoc( docRef,{
    email: admin_email.value,
    role:'cashier',
    created_date:created_date,
    id:userid,
  }).then(()=>{
    console.log('user role is created');
  }).catch((err)=>{
    console.log(err);
  })
}

//employee form needs service category names in service type field
// async function displayservicecategorynames(){
//   let Docref = collection(db,'servicecategory');
//   let Docsnap = await getDocs(Docref);
//   Docsnap.forEach(docs => {
//     var option = document.createElement('option');
//     option.text = docs.data().servicename;
//     servicetype.options.add(option)
//   });
// }

// displayservicecategorynames();



//  add the firebase storage the profile picture of the cashier
async function uploadimagetofirebasestorage(){
  // const ref= app.storage().ref()
  const file  =  admin_logo.files[0];
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

// is is the button create's the cashier's auth to able to get email & password
createaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  // if clicked it checks the inputs is empty or not
  if(email.value != '' && pwd.value != ''){
    // secondly it checks if the password and confirm password is same or not
    if(pwd.value == confirm_pass.value){
      createUserwithEmailandPwd();
    }else{
      successmsg.style.display = 'none';
      errormsg.style.display = 'block';
      errormsg.innerHTML = 'password isnot matched!.';
      errormsg.innerText = 'Password is not matched!....';
      console.log('password is not matched');
    }
  }else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'the fields is empty.';
    errormsg.innerText = 'The field is empty!....';
    console.log('empty fields');
  }
})
// create account for the cashier
// auth for the applogin
function createUserwithEmailandPwd(){
  createUserWithEmailAndPassword(auth,email.value,pwd.value).then(()=>{

  }).then(()=>{
    console.log('user email and pwd are created');
    error_msg.style.display = 'none';
    success_msg.style.display = 'block';
    success_msg.innerHTML = 'this account ' + admin_email.value + "  and password is created successfully";
    success_msg.innerText = 'this account ' + admin_email.value + "  and password is created successfully";
    const Logoutclass = async() =>{
      await signOut(auth);
      console.log('logout success');
    }
    Logoutclass();
  }).catch((error)=>{
    console.log('error from add-cashier.js in company folder: ' + error);
    success_msg.style.display = 'none';
    error_msg.style.display = 'block';
    error_msg.innerHTML = 'the fields is empty.';
    error_msg.innerText = 'error from add-cashier.js in company folder: ' + error;
  });
}