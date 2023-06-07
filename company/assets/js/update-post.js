import { initializeApp} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {getFirestore,getDoc,doc,updateDoc} from"https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import {firebaseConfig} from './firebase.js';

// firebase intialization
const app = initializeApp(firebaseConfig);
// call the  get database method
const db = getFirestore();

// intialize input model variables comes from db
let fuel_type = document.getElementById('fuel_type');
let post_title = document.getElementById('post_title');
let fuel_price = document.getElementById('fuel_price');
// update button
let updatefuel = document.getElementById('updatefuel');


// company respose success or failed message
let successmsg = document.querySelector('#successmsg');
let errormsg = document.querySelector('#errormsg');


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
    const docRef = doc(db, "posts", uid);
    const result = await getDoc(docRef);
    var option = document.createElement('option');
    // option.text = docs.data().servicename;
    if (result.exists()) {
        fuel_type.value = result.data().fuel_type;
        post_title.value = result.data().post_title;
        fuel_price.value = result.data().fuel_price;

        console.log(result.data().fuel_type);
        console.log(result.data().fuel_price);
        // console.log("Document data:", result.data().fullname);
      }
      else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      } 
    }

   
    // update data form function
    async function updatefuels(){
    
        //   get the id from url by slicing it  (uid is company id)
        let uid = url.slice(8,28);
        const ref = doc(db, "posts", uid.toString());
        await updateDoc(
            ref,{
                fuel_type:fuel_type.value,
                post_title:post_title.src,
                fuel_price:fuel_price.value,
            }
        ).then(()=>{
            errormsg.style.display = 'none';
            successmsg.style.display = 'block';
            successmsg.innerHTML = "this " + result.data().fuel_type + ' is Updated Successfully';
        }).catch((error)=>{
            errormsg.style.display = 'block';
                successmsg.style.display = 'none';
                errormsg.innerHTML = error;
        });
    
       
        }
        


        updatefuel.addEventListener('click',function(e){
        e.preventDefault();
        updatefuels();
    });