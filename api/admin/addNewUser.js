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



// way to store the data 
// 1- get the data from employee form and store it in collection called employee
// 2- then create account form will be stored authtication and userdata (collection that we store the role,email,fullname,and phone of the user) so employe use the appp

// form1- get data from employee form
let fname = document.getElementById('fname');
let lname = document.getElementById('lname');
let img = document.getElementById('img');
let phone = document.getElementById('phone');
let gender = document.getElementById('gender');
let adminemail = document.getElementById('adminemail');

let enabledata = document.querySelector('.adminData');



// company respose success or failed message
let successmsg = document.querySelector('#success-msg');
let errormsg = document.querySelector('#error-msg');
// submit btn
let submitbtn = document.getElementById('submit');


// form2- get the data from create employe account(this account is for login purpose)
let email = document.getElementById('email');
let pwd = document.getElementById('pwd');
let createaccountbtn = document.getElementById('createaccount');
let createaccountform = document.getElementById('createaccountform');
    


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
// thsi button is to store data  to the employee collection
submitbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  // check input field  its filled
  if(fname.value !='' && img.value != '' && gender.value != '' && phone.value != '' &&
  lname.value !=''){
    // store employee data in firestore
    AddNewAdmin();
    //  store role to userdata collection so user can use the app
    storemployedatain_userdata_collection(adminemail.value);
  }else{
    successmsg.style.display = 'none';
    errormsg.style.display = 'block';
    errormsg.innerHTML = 'Please Fill The  Entire Form';
  }
});
// this btn is for creating account for employee(employe will have ability to login using the app)
createaccountbtn.addEventListener('click',function(e){
  e.preventDefault();
  // clicked
  if(enabledata.style.display == 'block' && fname.value =='' && img.value == '' && gender.value == '' && phone.value == '' &&
  lname.value ==''){
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

// get the current date
let c = new Date();
let created_date = c.toLocaleDateString();
// 1 - create collection name employee store data in there
// function that  add employee inforation to cloud firestore
async function AddNewAdmin(){
  var ref = collection(db,'admin');
  // call the function that uploads the ikmage to firebase storage
  let value =   uploadimagetofirebasestorage();
  // call the function that gets the returned value(downloaded imageurl from the function uploadimagetofirebasestorage  to this functions)
  let urlofimg =  await getdownloadedurlafteruploadimage(value);
  const docRef = await addDoc(
    ref,{
      admin_fname:fname.value,
      admin_lname:lname.value,
      email:adminemail.value,
      profile_image:urlofimg,
      gender:gender.value,
      phone:phone.value,
      // useremail is the company employee is registered or associated from
      created_date: created_date,
      updated_date: 'false',
      delete_status:'false',
    }
    ).then(()=>{
      errormsg.style.display = 'none';
      successmsg.style.display = 'block';
      successmsg.innerHTML = 'Data Added Successfully';
      console.log('data added to users collection');
    }).catch((error)=>{
      errormsg.style.display = 'block';
      successmsg.style.display = 'none';
      errormsg.innerHTML = error;
      console.log("error msg",error);
    });
  }


   // employee form needs service category names in service type field
    async function displayservicecategorynames(){
        let Docref = collection(db,'servicecategory');
        let Docsnap = await getDocs(Docref);
        
        Docsnap.forEach(docs => {
            var option = document.createElement('option');
            option.text = docs.data().servicename;
            servicetype.options.add(option)
        });
        

    }

    displayservicecategorynames();



    // 2- create account for the employee
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
    

    // 3- store users (email) in userdata for the role login
    async function storemployedatain_userdata_collection(email){
        let docRef = collection(db,'usersrole');
        let docSnap = await addDoc( docRef,{
            email: email,
            name:fname.value + lname.value,
            addeddate:created_date,
            id:userid,
            role:'admin',
        }).then(()=>{
            console.log('user role is created');

        }).catch((err)=>{
            console.log(err);
        })
    }




    //  addimage to firebase storeage
    async function uploadimagetofirebasestorage(){
        // const ref= app.storage().ref()
        const file  =  img.files[0];
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
   