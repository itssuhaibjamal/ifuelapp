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
let company_profile = document.getElementById('company_profile');
let company_name = document.getElementById('company_name');
let c_role = document.getElementById('company_role');
let comp_email = document.getElementById('company_email');


// success or fail messages
let successmsg = document.getElementById('successmsg');
let errormsg = document.getElementById('errormsg');

// Company Profile Details form
let comp_name = document.getElementById('comp_names');
let comp_role = document.getElementById('comp_role');
let comp_phone = document.getElementById('comp_phone');
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
  const docRef = query(collection(db, "company"), where("comp_email", "==", useremail));
  const result = await getDocs(docRef);
  // console.log(result.data().id);
  result.forEach(docs => {
    // console.log(docs.data().company_name);
    // compare the id for company collection to current company account
    if(docs.data().comp_email == useremail){
      company_profile.src =`${docs.data().comp_logo}`;
      company_name.innerHTML = `${docs.data().comp_name}`;
      // role of the company will be hand coded no need for the db
      // c_role.innerHTML= `${docs.data().comp_name}`;
      comp_email.innerHTML = `${docs.data().comp_email}`;
      comp_name.innerHTML = `${docs.data().comp_name}`;
      comp_role.innerHTML = 'Company';
      comp_phone.innerHTML = `${docs.data().comp_phone}`;
      comp_ceo.innerHTML = `${docs.data().comp_ceo_name}`;
      // display data inside update form
      updatefullname.value = `${docs.data().comp_name}`;
      updatePhone.value = `${docs.data().comp_phone}`;
      updateCeo.value = `${docs.data().comp_ceo_name}`;
      // update btn when clicked excute the following
      updatebtn.addEventListener('click',function (e) {
        e.preventDefault();
        updatedata(docs.id,uploadprofileimage.src,updateCeo,updatePhone)
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
      comp_phone:updatePhone.value,
      comp_ceo_name:updateCeo.value,
    }).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Data Updated Successfully';
      successmsg.innerText = 'Company Profile Updated Successfully';
      console.log('Data Updated Successfully');
    }).catch((error)=>{
      successmsg.style.display = 'none';
      errormsg.style.display = 'block';
      errormsg.innerHTML = 'Data Updated Successfully';
      errormsg.innerText = 'Company Profile Updated Successfully';
      console.log(error);
    });
}