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
// Function to search for a name in the "customers" collection
async function searchCustomerByName(name) {
  try {
    const currentUser = auth.currentUser;
    if (!companyemail) {
      console.log("User is not logged in.");
      return;
    }
    
    

    const customersCollectionRef = collection(db, 'posts');
    const q = query(customersCollectionRef, where('company_associated', '==', companyemail), where('post_title', '==', name));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Post Name:', doc.data().post_title);
      console.log('Post Email:', doc.data().post_file);
      console.log('Post Phone:', doc.data().post_desc);
    });

    if (querySnapshot.empty) {
      console.log('No matching documents found.');
    }
  } catch (error) {
    console.log("Error searching for customer:", error);
  }
}

// Keyboard event listener for searching
const searchInput = document.getElementById('search-input'); // Assuming an input element with the ID 'search-input'

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = event.target.value.trim();
    if (searchTerm !== '') {
      searchCustomerByName(searchTerm);
      event.target.value = ''; // Clear the input field after search
    }
  }
});
