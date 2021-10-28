/**
 * author: Yucong
 * 
 * Version： 3.0
 * 
 * Updates: 1. Now only showing the order for today
 * 2. Now notes and save button are added and can be able to push the notes and status to database
 * 3. Added a notice button to cancelled and delayed orders
 * 
 * 
 */




var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 

today = yyyy + '-'+mm+'-'+dd;



var i;
var db = app_firebase.firestore();

const yucongRef = db.collection('orders');
var query = yucongRef.where("DeliveryDate","==",today);
const userRef = db.collection('accountManagement');
var orderArray = new Array();
var docIdArray = new Array();

//var email;

var isAdminFlag = 1;

firebase.auth().onAuthStateChanged(user => {

    if(user){
        //var assignedId;
        
        var driverFullName;
        var user = firebase.auth().currentUser;
        var email = user.email;
        //console.log(email);
        const userRefQuery = userRef.where("Email","==",email);
        userRefQuery.get().then((snapshot) => {
            snapshot.docs.forEach((doc) => {
        
        if(doc.data().isAdmin == "0"){
            isAdminFlag = 0;
        }
        //console.log(isAdminFlag);

        driverFullName = doc.data().FirstName + " "+doc.data().LastName;
        });
        
        });
    }
    else{

    }
















query.get().then((snapshot) => {

    

   

    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const docId = doc.id;
        
        if(isAdminFlag == 0){
            if(data.AssignedDriver == driverFullName){
            orderArray.push(data);
            docIdArray.push(docId);
            }
        }else{

        orderArray.push(data);
        docIdArray.push(docId);}

    });

    var nOrders = orderArray.length;










    for (i = 0; i < nOrders; i++) {

        var Upper = document.createElement("div");
        //Upper.innerText = "try";
        Upper.className = "accordion-item";
        var orderH2 = document.createElement("h2");
        orderH2.className = "accordion-header";
        var number = i + 1;
        var htwoID = "heading" + number;
        orderH2.id = htwoID;
        var collapseDivId = "collapse" + number;
        var collapseButton = document.createElement("button");
        collapseButton.setAttribute("class", "accordion-button");
        collapseButton.setAttribute("type", "button");
        collapseButton.setAttribute("data-bs-target", "#" + collapseDivId);
        collapseButton.setAttribute("data-bs-toggle", "collapse");
        collapseButton.setAttribute("aria-expanded", "true");
        collapseButton.setAttribute("aria-controls", collapseDivId);

                //warning button
                var warningbt = document.createElement("button");
                warningbt.className = "btn btn-danger";
                warningbt.innerText = "Notice!";

                var st = orderArray[i].Status
                if(st =="Delayed" || st == "Cancelled")
                orderH2.append(warningbt);

        //collapseButton.appendChild(editButton);
        orderH2.appendChild(collapseButton);





        var collapseDiv = document.createElement("div");

        collapseDiv.setAttribute("id", collapseDivId);
        collapseDiv.setAttribute("class", "accordion-collapse collapse");
        collapseDiv.setAttribute("aria-labelledby", htwoID);
        collapseDiv.setAttribute("data-bs-parent", "#accordionExample");

        var bodyDiv = document.createElement("div");
        bodyDiv.className = "accordion-body";
        var content = document.createElement("div");
        content.className = "container";
        var row = document.createElement("div");
        row.className = "row";

        //driver column

        var driverColumn = document.createElement("div");
        driverColumn.className = "col-6 col-sm-3";
        var driverID = "driver" + number;
        var driverLabel = document.createElement("label");
        driverLabel.className = "col-sm-2 col-form-label";
        driverLabel.setAttribute("for", driverID);
        driverLabel.innerText = "Assigned_Driver";
        var driverField = document.createElement("label");
        driverField.className = "form-control";
        driverField.id = driverID;
        driverField.innerText = orderArray[i].AssignedDriver;
        driverColumn.appendChild(driverLabel);
        driverColumn.appendChild(driverField);

        //column1
        var column1 = document.createElement("div");
        column1.className = "col-6 col-sm-3";
        var nameId = "namefield" + number;
        var nameLabel = document.createElement("label");
        nameLabel.className = "col-sm-2 col-form-label";
        nameLabel.setAttribute("for", nameId);
        nameLabel.innerText = "Recipient_Name";
        var namefield = document.createElement("label");
        namefield.className = "form-control";
        namefield.id = nameId;
        namefield.innerText = orderArray[i].RecipientFirstName + " " + orderArray[i].RecipientLastName;
        column1.appendChild(nameLabel);
        column1.appendChild(namefield);


        //column2
        var column2 = document.createElement("div");
        column2.className = "col-6 col-sm-3";
        var addressId = "addressfield" + number;
        var addressLabel = document.createElement("label");
        addressLabel.className = "col-sm-2 col-form-label";
        addressLabel.setAttribute("for", addressId);
        addressLabel.innerText = "Address";
        var addressfield = document.createElement("label");
        addressfield.className = "form-control";
        addressfield.id = addressId;
        addressfield.innerText = orderArray[i].RecipientAddress;
        column2.appendChild(addressLabel);
        column2.appendChild(addressfield);



                //Notes column
                var noteColumn = document.createElement("div");
                noteColumn.className = "mb-3";
                var noteId = "notefield" + number;
                var noteLabel = document.createElement("label");
                noteLabel.className = "col-sm-2 col-form-label";
                noteLabel.setAttribute("for", noteId);
                noteLabel.innerText = "Notes";
                var notefield = document.createElement("textarea");
                
                notefield.className = "form-control";
                notefield.id = noteId;
                notefield.innerText = orderArray[i].DeliveryNotes;
                notefield.disabled = true;
                noteColumn.appendChild(noteLabel);
                noteColumn.appendChild(notefield);



        //column3
        var column3 = document.createElement("div");
        column3.className = "col-6 col-sm-3 ms-auto";


        //breaker
        var columnBreaker = document.createElement("div");
        columnBreaker.className = "w-100";

        //column4
        var column4 = document.createElement("div");
        column4.className = "col-6 col-sm-3";
        var phoneId = "phonefield" + number;
        var phoneLabel = document.createElement("label");
        phoneLabel.className = "col-sm-2 col-form-label";
        phoneLabel.setAttribute("for", phoneId);
        phoneLabel.innerText = "Phone";
        var phonefield = document.createElement("label");
        phonefield.className = "form-control";
        phonefield.id = phoneId;
        phonefield.innerText = orderArray[i].RecipientPhone;
        column4.appendChild(phoneLabel);
        column4.appendChild(phonefield);


        //column5
        var column5 = document.createElement("div");
        column5.className = "col-6 col-sm-3";
        var statusId = "statusfield" + number;
        var statusLabel = document.createElement("label");
        statusLabel.className = "col-sm-2 col-form-label";
        statusLabel.setAttribute("for", statusId);
        statusLabel.innerText = "Status";
        var statusfield = document.createElement("label");
        statusfield.className = "form-control";
        statusfield.id = statusId;
        statusfield.innerText = orderArray[i].Status;
        if (statusfield.innerText == "Cancelled" || statusfield.innerText == "Delayed") {

            statusfield.classList.add("text-danger");
        }
        //statusfield.setAttribute("readonly","readonly");
        column5.appendChild(statusLabel);
        column5.appendChild(statusfield);




        


        //dropdown menu
        var dropdown = document.createElement("select");
        dropdown.className = "form-select";
        dropdown.id = "dropdown" + number;
        dropdown.setAttribute("aria-label", "Default select example");
        var option1 = document.createElement("option");
        option1.value = "Completed";
        option1.innerText = "Completed";
        var option2 = document.createElement("option");
        option2.value = "Work In Progress";
        option2.innerText = "Work In Progress";
        var option3 = document.createElement("option");
        option3.value = "Delayed";
        option3.innerText = "Delayed";
        var option4 = document.createElement("option");
        option4.value = "Cancelled";
        option4.innerText = "Cancelled";
        dropdown.appendChild(option1);
        dropdown.appendChild(option2);
        dropdown.appendChild(option3);
        dropdown.appendChild(option4);

        var saveButton = document.createElement("span");
        saveButton.className = "btn btn-outline-danger";
        var saveId = docIdArray[i];
        saveButton.id = saveId;
        saveButton.innerText = "Save";
        saveButton.setAttribute("data-id",number);
        
       //saveButton.innerText = saveButton.getAttribute("data-id");
        saveButton.addEventListener('click',function(){

            yucongRef.doc(this.id).update({

                "Status" : document.getElementById("dropdown"+this.getAttribute("data-id")).value,
                "DeliveryNotes" : document.getElementById("notefield"+this.getAttribute("data-id")).value,
                "DeliveryDate" : today



            });




        });
        saveButton.disabled = true;


        var editButton = document.createElement("span");
        editButton.className = "btn btn-outline-info";
        editButton.id = number;
        editButton.innerText = "Edit";

        editButton.addEventListener('click', function () { dropdown.id = "dropdown"+ this.id; document.getElementById("statusfield" + this.id).replaceWith(dropdown); document.getElementById("notefield" + this.id).disabled = false; });
        collapseButton.innerText = "Order #" + orderArray[i].OrderNumber;
        //orderArray[i].OrderNumber





        column3.appendChild(editButton);
        column3.appendChild(saveButton);

        row.appendChild(driverColumn);

        row.appendChild(column1);
        row.appendChild(column2);


        row.appendChild(column3);
        row.appendChild(columnBreaker);
        row.appendChild(column4);
        row.appendChild(column5);
        row.appendChild(noteColumn);
        content.appendChild(row);
        //bodyDiv.appendChild(editButton);
        bodyDiv.appendChild(content);
        collapseDiv.appendChild(bodyDiv);
        Upper.appendChild(orderH2);
        Upper.appendChild(collapseDiv);
        document.getElementById("accordionExample").appendChild(Upper);
    }
});

});