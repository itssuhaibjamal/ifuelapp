// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getAuth , 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged, signOut}
  from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,collection,getDocs,doc,updateDoc, deleteDoc} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();
const auth = getAuth(app);
let tr = document.querySelector('#post_list');
// check the auth change status then get the email of the user
let companyemail = '';
let userid;
auth.onAuthStateChanged((user)=>{
  if(user){
    // console.log(user.uid);
    companyemail = user.email;
    userid = user.uid;
  }
});
//    function that display employee data
async function Viewemployeedata(){
    var ref = collection(db,"posts");
    tr.innerHTML= "<p class='d-flex'>Loading Please Wait...</p>";
    
   try {
   const docSnap = await getDocs(ref);
// check if collection that we are fetching if its empty excute the else statement
   if(docSnap.empty && doc.data().company_associated == companyemail){
       // console.log("db isn't empty");
       tr.innerHTML = `<p class='text-center'>There is no data to fetched , please add new fuel to be displayed</p>`;
    
   }
   // if its not empty  log this message
   else{
    tr.innerHTML = '';
   // console.log('Database is not empty');
   let number = 1;
   docSnap.forEach(doc => {
      
       
      if(doc.data().company_associated == companyemail){
        tr.innerHTML += `

        <tr>
        <td>${number}</td>
        <td>${doc.data().post_title}</td>
        <td><img src='${doc.data().post_file}' class="rounded-circle" width='50' height='50'></td>
        <td>${doc.data().post_desc}</td>
        <td>${doc.data().created_date}</td>
        <td class='d-flex'><a href="view-single-post.html?view=${doc.id}" class='btn btn-primary'>View</a>&numsp;<a href='update-post.html?update=${doc.id}' class='btn btn-success'>Update</a> &numsp;<a href='view-posts.html?del=${doc.id}' class='btn btn-danger'>Delete</a></td>
        </tr>
        
    `;
      }else{
        // tr.innerHTML = 'Empty Table Please Enter Data'

      }
      
       number ++;
       
       
    }); 
}
} catch (error) {
    tr.innerHTML = `<p class="text-center">${error}</p>`;
    // console.log(doc.data().post_title);
   }
       
     
}

window.onload = Viewemployeedata();

let url = window.location.search;
/// delete the data 

let delcheck = url.search('del');
let delurl = window.location.search;
let deluid = delurl.slice(5,28);
// console.log(deluid);

// if the url ==delete then delete selected data
if(delcheck == 1){
  deletepost(deluid);
}
async function deletepost(deluid){
  //delete function , deletes the item selected from firestore
  const docRef  = doc(db,'posts',deluid);
  deleteDoc(docRef).then(() =>{
    alert('company data  deleted successfully');
    window.location.href = 'view-posts.html';
  }).catch((e)=>{
    alert('failed to delete company data',e);
  });
}