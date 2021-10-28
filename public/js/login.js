var loginApp = {};

(function(){

    var firebase = app_firebase;

    //Function to handle user login
    function login(){

    //Get email and password
    var submittedEmail = document.getElementById("email_field").value;
    var submittedPass = document.getElementById("password_field").value;

    //Handle user authentication
    firebase.auth().signInWithEmailAndPassword(submittedEmail, submittedPass)
  .then((user) => {
    // Signed in 
   
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;


    window.alert("Error " + errorMessage);
  });
}

//Handle Account Status
firebase.auth().onAuthStateChanged(user => {
    if(user) {
        //user signed in, redirect to main
      window.location = 'main.html'; //After successful login, user will be redirected to main.html
    }
    else{
        //user not signed in
    }
  });


  loginApp.login = login;

})()