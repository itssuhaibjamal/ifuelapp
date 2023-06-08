// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,getDocs,doc,updateDoc,collection, query, where} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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

// form data
let profile = document.getElementById('profile');
let fullname = document.getElementById('fullname');
let role = document.getElementById('role');
let comp_email = document.getElementById('c_email');

// Company Profile Details form
let fullname2 = document.getElementById('fullname2');
let roles = document.getElementById('roles');
let phonenumber = document.getElementById('phonenumber');
let comp_ceo = document.getElementById('comp_ceo');

// check the auth change status then get the email of the user
let useremail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    // console.log(user.uid);
    useremail = user.email;
    userid = user.uid;
    Displayprofiledata(userid);
  }
});

// update section form
let updatefullname = document.getElementById('updatefullname');
let updatePhone = document.getElementById('updatePhone');
let updateCeo = document.getElementById('updateCeo');
let updatebtn = document.getElementById('updatebtn');

// Displayprofiledata();
// add image to firebase storeage

async function uploadimagetofirebasestorage(){
  let uploadprofileimage = document.getElementById('uploadprofileimage');
  // const ref= app.storage().ref()
  const file  =  uploadprofileimage.files[0];
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

async function Displayprofiledata(id){
  const docRef = query(collection(db, "admin"), where("id", "==", id));
  const result = await getDocs(docRef);
  // console.log(result.data().id);
  result.forEach(docs => {
    // console.log(docs.data().company_name);
    // compare the id for company collection to current company account
    if(docs.data().id == id){
      profile.src =`${docs.data().user_logo}`;
      fullname.innerHTML = `${docs.data().user_fullname}`;
      // role of the company will be hand coded no need for the db
      role.innerHTML= `${docs.data().user_fullname}`;
      fullname2.innerHTML = `${docs.data().user_fullname}`;
      comp_email.innerHTML = `${docs.data().user_email}`;
      roles.innerHTML = 'Super Admin';
      phonenumber.innerHTML = `${docs.data().user_phone}`;
      comp_ceo.innerHTML = `${docs.data().user_city}`;
      // display data inside update form
      updatefullname.value = `${docs.data().user_fullname}`;
      updatePhone.value = `${docs.data().user_phone}`;
      updateCeo.value = `${docs.data().user_city}`;
      // update btn when clicked excute the following
      updatebtn.addEventListener('click',function (e) {
        e.preventDefault();
        updatedata(docs.id,uploadprofileimage.src,updatefullname,updatePhone, comp_ceo_name)
      });
    }
  });
  // check if collection that we are fetching if its empty excute the else statement
  // if its not empty  log this message
}

// update function
async function updatedata(id,img){
  // call the function that uploads the ikmage to firebase storage
  let value =   uploadimagetofirebasestorage();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let urlofimg =  await getdownloadedurlafteruploadimage(value);
  //   get the id from url by slicing it  (uid is company id)
  const ref = doc(db, "company", id.toString());
  await updateDoc(
    ref,{
      comp_logo:urlofimg,
      comp_name:updatefullname.value,
      comp_phone:updatePhone.value,
      comp_ceo_name:comp_ceo_name.value,
    }).then(()=>{
      console.log('Data Updated Successfully');
    }).catch((error)=>{
      console.log(error);
    });
}