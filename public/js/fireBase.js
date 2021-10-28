//main firebase application
var app_firebase= {};
//secondary app to create accounts. Fix to users loging in when creating accounts (sign up).
var secondaryApp = {};

(function(){
//Connect application to Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDqajjnwDU4FODy208SL-Qud_CZUGHwlYQ",
  authDomain: "floralenvytrack.firebaseapp.com",
  projectId: "floralenvytrack",
  storageBucket: "floralenvytrack.appspot.com",
  messagingSenderId: "11570096028",
  appId: "1:11570096028:web:92c41a6e70d49f3396ca59",
  measurementId: "G-WRP03DFHFQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary');
app_firebase = firebase;
})()
