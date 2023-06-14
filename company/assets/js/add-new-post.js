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

//inputs from the company create account
let post_title = document.getElementById('post_title');
let post_desc = document.getElementById('post_desc');
let post_file = document.getElementById('post_file');
let createnewpost = document.getElementById('createnewpost');

let errormsg = document.getElementById('error-msg');
let successmsg = document.getElementById('success-msg');

createnewpost.addEventListener('click',function(e){
  e.preventDefault();
  //  check input field  its filled
  if(post_title.value != '' && post_desc.value != ''){
    AddPost();
    // createaccountbtn.style.display = 'none';
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

// get the current date
let c = new Date();
let created_date = c.toLocaleString();

//1- add post to posts collection
async function AddPost(){
  var ref = collection(db,'posts');
  let value =   uploadimagetofirebasestorage();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let post_file =  await getdownloadedurlafteruploadimage(value);
  const docRef = await addDoc(
    ref,{
      post_title:post_title.value,
      post_desc:post_desc.value,
      post_file:post_file,
      company_associated:useremail,
      comp_associated_id:userid,
      created_date: created_date,
    }
    ).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Data Added Successfully';
      successmsg.innerText = post_title.value + ' New post added';
      console.log("Successfully created the post");
      post_title.value = '';
      post_desc.value = '';
      // window.location.href = '../../register.html';
    }).catch((error)=>{
      errormsg.style.display = 'block';
      successmsg.style.display = 'none';
      errormsg.innerHTML = error;
      errormsg.innerText = "something is not right "+error;
      post_title.value = '';
      post_desc.value = '';
    });
}



//  add the firebase storage the profile picture of the cashier
async function uploadimagetofirebasestorage(){
  // const ref= app.storage().ref()
  const file  =  post_file.files[0];
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