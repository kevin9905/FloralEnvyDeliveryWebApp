var mainApp = {};
const welcomeEmail = document.querySelector('.welcome-email');
const adminContent = document.querySelectorAll('.admin');
const UsersRef = firebase.firestore().collection('accountManagement'); //Reference to accountManagement collection
var UsersArray = new Array(); //Array containing all user documents

(function () {
  var firebase = app_firebase;
  var userUid = 0;

  //Check if user is logged in
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      showAdminContent(user);
      welcomeAccountEmail(user);
    } else {
      // No user is signed in, send back to login screen
      window.location.replace("index.html");
    }
  });


  //Welcome account email message
  const welcomeAccountEmail = (user) => {
    if (user) {
      //account info
      const html = `
        Welcome ${user.email}
        `;
      welcomeEmail.innerHTML = html;
    } else {
      //dont show account info
      welcomeEmail.innerHTML = '';
    }

  }

 
  
  DriverNames = []; //Array containing all Driver Names
  UsersRef.get().then((snapshot) => {
    var nOrders = snapshot.docs.length; //Number of orders to loop through
    var i;
    //Push Document info to UsersArray
    snapshot.docs.forEach((doc) => {
      const data = doc.data()

      UsersArray.push(data);

    });
    //Empty DriverNames array
    DriverNames = [];


    if (UsersArray === undefined || UsersArray.length == 0) {
      // array empty or does not exist
    } else {
      //Concatenate FirstName + LastName of all Users from accountManagement and add them to array
      for (i = 0; i < nOrders; i++) {
        DriverNames.push(UsersArray[i].FirstName + " " + UsersArray[i].LastName);
      }
    }

    //Display driver dropdown dynamically by getting values from DriverNames array
    var $Driverdropdown = $("#deliveryDriver");
    $Driverdropdown.empty();
    $Driverdropdown.append("<option disabled selected> Select Driver </option>");
    $.each(DriverNames, function (index, value) {
      $Driverdropdown.append("<option>" + value + "</option>");
    });

  });


  //Function to show admin content if user is admin
  const showAdminContent = (user) =>{
    //get content from UsersRef and push the documents info into UsersArray
    UsersRef.get().then((snapshot) => {
      UsersArray = [];
      var nOrders = snapshot.docs.length; //Number of orders to loop through
      var i;
      //Push Document info to UsersArray
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        UsersArray.push(data);
  
      });
      //find index of logged in user.
      index = UsersArray.findIndex(x => x.Email === user.email);
      //testing
      //console.log(index);

      //if the user isAdmin, show admin functionalities
      if(UsersArray[index].isAdmin == 1){
        adminContent.forEach(x => x.style.display = 'block');
      }
      

      //Testing
    //console.log(UsersArray);
    //console.log(user.email);
    //console.log(UsersArray[0].Email);
  });
  }

  //Function checks if email of user if found in database
  function findEmail(email, array) {
    return array.some(function(el) {
      return el.Email === email;
    }); 
  }

  // Create new delivery
  const createForm = document.querySelector("#create-delivery-form");
  createForm.addEventListener('submit', (e) => {
    //prevent the page from reloading
    e.preventDefault();

    firebase.firestore().collection('orders').add({
      // Client info
      "ClientFirstName": createForm["clientFirstName"].value,
      "ClientLastName": createForm["clientLastName"].value,
      "ClientPhone": createForm["clientPhone"].value,
      // Recipient info
      "RecipientFirstName": createForm["recFirstName"].value,
      "RecipientLastName": createForm["recLastName"].value,
      "RecipientPhone": createForm["recPhone"].value,
      "RecipientAddress": createForm["recAddress"].value,
      // Delivery info
      "OrderNumber": createForm["orderNum"].value,
      "DeliveryDate": createForm["deliveryDate"].value,
      "DeliveryItem": createForm["deliveryItem"].value,
      "AssignedDriver": createForm["deliveryDriver"].value,
      "PayRate": createForm["deliveryPay"].value,
      // Notes
      "DeliveryNotes": createForm["deliveryNotes"].value,
      "Status": "Work In Progress"


    }).then(() => {


      //Clear form
      document.getElementById("clientFirstName").value = "";
      document.getElementById("clientLastName").value = "";
      document.getElementById("clientPhone").value = "";
      document.getElementById("recFirstName").value = "";
      document.getElementById("recLastName").value = "";
      document.getElementById("recPhone").value = "";
      document.getElementById("recAddress").value = "";
      document.getElementById("orderNum").value = "";
      document.getElementById("deliveryDate").value = "";
      document.getElementById("deliveryItem").value = "";
      document.getElementById("deliveryDriver").value = "";
      document.getElementById("deliveryPay").value = "";
      document.getElementById("deliveryNotes").value = "";

      //close modal
      $('#modal-create').modal('toggle');
      $('#deliveryToast').toast('show');
    })

  })




  // Create account
  const signupForm = document.querySelector('#newAccount-form');
  signupForm.addEventListener('submit', (e) => {
    //prevent the page from reloading
   
    e.preventDefault();

    // get user info
    const email = signupForm['newAccount-email'].value;
    const password = signupForm['newAccount-password'].value;
    //sign up the user
    secondaryApp.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        // close the signup modal & reset form
        userUid = user.user.uid;
        console.log(userUid);

        $('#create-account').modal('toggle');
        $('#accountToast').toast('show');

        // Adding User  Info to accountManagement collection
    return firebase.firestore().collection('accountManagement').doc(user.user.uid).set({
      "FirstName": signupForm["firstName"].value,
      "LastName": signupForm["lastName"].value,
      "PhoneNumber": signupForm["phoneNumber"].value,
      "Email": signupForm["newAccount-email"].value,
      "Uid": userUid,
      "isAdmin": signupForm["isAdmin"].value
    }).then(() => {
      console.log("Record Created");
      document.querySelector('#newAccount-form').reset();
    }).catch((error) => {
      console.log(error);
    });

        
        
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error " + errorMessage);
      });

    
});

  //handle user logout
  const logout = document.querySelector('#logout');
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  })//end logout event listener

  //mainApp.showAccount = showAccount;
  mainApp.display
  mainApp.logout = logout;

})()//end self calling function