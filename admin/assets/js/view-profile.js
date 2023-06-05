// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
// import { getFirestore, addDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
// import { firebaseConfig } from './firebase.js';

// // Firebase initialization
// const app = initializeApp(firebaseConfig);
// const db = getFirestore();
// const auth = getAuth(app);

// let admin_logo = document.getElementById('admin_logo');
// let admin_name = document.getElementById('admin_name');
// let admin_email = document.getElementById('admin_email');
// let admin_gender = document.getElementById('admin_gender');
// let admin_phone = document.getElementById('admin_phone');
// let admin_city = document.getElementById('admin_city');
// let admin_region = document.getElementById('admin_region');
// let admin_country = document.getElementById('admin_country');


// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log("Authenticated user found:", user.email);
//     fetchProfileViewData();
//   } else {
//     console.log("No authenticated user found.");
//   }
// });


// // // Function to fetch profile view data for the currently logged-in user
// async function fetchProfileViewData() {
//   try {
//     const user = auth.currentUser;
//     if (user) {
//       const userId = user.uid;
//       const profileViewRef = collection(db, "admin"); // Replace "profileViews" with the actual name of your collection
//       const queries = query(profileViewRef, where("id", "==", userId));
//       const querySnapshot = await getDocs(queries);

//       // Loop through the documents to retrieve the profile view data
//       querySnapshot.forEach((doc) => {
//         if(doc.id == userId){
//           admin_logo.innerHTML = `<img src='${doc.data().user_logo}' class='rounded-circle' width=50 height=50>`;
//           admin_name.innerHTML = `${doc.data().user_fullname}`;
//           admin_email.innerHTML = `${doc.data().user_email}`;
//           admin_gender.innerHTML = `${doc.data().user_gender}`;
//           admin_phone.innerHTML = `${doc.data().user_phone}`;
//           admin_city.innerHTML = `${doc.data().user_city}`;
//           admin_region.innerHTML = `${doc.data().user_region}`;
//           admin_country.innerHTML = `${doc.data().user_country}`;
//         }
//         loadingmsg.innerHTML = '';
//       });
//     } 
//   } catch (error) {
//     console.error("Error fetching profile view data:", error);
//   }
// }

// fetchProfileViewData();


