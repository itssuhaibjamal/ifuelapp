import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,getDoc,doc,updateDoc} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();

// intialize input model variables comes from db
let cashier_name = document.getElementById('cashier_name');
let cashier_profile_picture = document.getElementById('cashier_profile_picture');
let cashier_email = document.getElementById('cashier_email');
let cashier_phone = document.getElementById('cashier_phone');
let cashier_city = document.getElementById('cashier_city');
let cashier_region = document.getElementById('cashier_region');
let cashier_country = document.getElementById('cashier_country');

// company respose success or failed message
let successmsg = document.querySelector('#successmsg');
let errormsg = document.querySelector('#errormsg');
// submitbtn
let update_cashier = document.getElementById('update_cashier');


  // get the last of the url start from ? symbol
  let url = window.location.search;
  // get the url to verify if that should be displayed or not 
  let check = url.search('update');


   
if(check == 1){
viewdatainupdateform();
   
}
else{
   alert('Error Occur While Displaying The Data Please Try Again....');
}



// displaydata in update form function
async function viewdatainupdateform(){
    
    //   get the id from url by slicing it  (uid is company id)
    let uid = url.slice(8,28);
    console.log(uid)
    const docRef = doc(db, "users", uid);
    const result = await getDoc(docRef);
    var option = document.createElement('option');
    // option.text = docs.data().servicename;
    if (result.exists()) {
        cashier_name.value= result.data().user_fullname;
        cashier_profile_picture.src =result.data().user_logo;
        cashier_email.value = result.data().user_email;
        cashier_phone.value = result.data().user_phone;
        cashier_city.value = result.data().user_city;
        cashier_region.value = result.data().user_region;
        cashier_country.value = result.data().user_country;

        console.log(result.data().user_email);
        console.log(result.data().user_logo);
        // console.log("Document data:", result.data().fullname);
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      } 
    }

   
    // update data form function
    async function updatedata(){
    
        //   get the id from url by slicing it  (uid is company id)
        let uid = url.slice(8,28);
        const ref = doc(db, "users", uid.toString());
        await updateDoc(
            ref,{
                user_fullname:cashier_name.value,
                user_logo:cashier_profile_picture.src,
                user_phone:cashier_phone.value,
                user_city:cashier_city.value,
                user_region:cashier_region.value,
                user_country:cashier_country.value,
            }
        ).then(()=>{
            errormsg.style.display = 'none';
            successmsg.style.display = 'block';
            successmsg.innerHTML = 'The customer Updated Successfully';
        }).catch((error)=>{
            errormsg.style.display = 'block';
                successmsg.style.display = 'none';
                errormsg.innerHTML = error;
        });
    
       
        }
        


        update_cashier.addEventListener('click',function(e){
        e.preventDefault();
        updatedata();
    });