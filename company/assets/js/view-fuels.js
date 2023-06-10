// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getAuth , 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged, signOut}
  from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {getFirestore,collection,getDocs,doc,updateDoc} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();
const auth = getAuth(app);
let tr = document.querySelector('#fuel_list');
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
    var ref = collection(db,"fuels");
    tr.innerHTML= "<p class='d-flex'>Loading Please Wait...</p>";
    
   try {
   const docSnap = await getDocs(ref);
// check if collection that we are fetching if its empty excute the else statement
   if(docSnap.empty){
       // console.log("db isn't empty");
       tr.innerHTML = `<p class='text-center'>There is no data to fetched , please add new fuel to be displayed</p>`;
    
   }
   // if its not empty  log this message
   else{
    tr.innerHTML = '';
   // console.log('Database is not empty');
   let number = 1;
   docSnap.forEach(doc => {
      
       
      if(doc.data().comp_associated_email == companyemail){
        tr.innerHTML += `

        <tr>
        <td>${number}</td>
        <td>${doc.data().fuel_type}</td>
        <td>${doc.data().fuel_litter}</td>
        <td>${doc.data().fuel_price}</td>
        <td>${doc.data().comp_associated_email}</td>
        <td>${doc.data().created_date}</td>
        <td class='d-flex'><a href="view-single-fuel.html?view=${doc.id}" class='btn btn-primary'>View</a>&numsp;
        <a href='update-fuel.html?update=${doc.id}' class='btn btn-success'>Update</a> &numsp;
        <a href='view-fuels.html?delete=${doc.id}' class='btn btn-danger'>Delete</a></td>
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
    console.log(doc.data().fuel_type);
   }
       
     
}

window.onload = Viewemployeedata();


// get the last of the url start from ? symbol
let url = window.location.search;

// check if the url contains word update and have id
let deleteurl = url.search('delete');


let uid = url.slice(8,28).toString();

if(deleteurl == 1){
    async function delete_employee(){

        deleteDoc(doc(db,'fuels',uid),{
            delete_status:"true",
            }).then(()=>{
                alert('item deleted successfully');
            }).catch(()=>{
                console.log('failed to delete');
                
            });
    }
     delete_employee();
}else{
    // console.log(updateurl);
    
}
