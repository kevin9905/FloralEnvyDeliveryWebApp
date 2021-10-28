let objectArray = []

var database = app_firebase.firestore();
const myDb = database.collection('orders');
//Read date from firebase to the array
myDb.get().then((snapshot) => {
    snapshot.docs.forEach((doc) => {
        const id = doc.data().OrderNumber
        const driver = doc.data().AssignedDriver
        const clientName = doc.data().ClientFirstName
        const clientLName = doc.data().ClientLastName
        const phoneNum = doc.data().ClientPhone
        const item = doc.data().DeliveryItem
        const totalFee = doc.data().PayRate
        const date = doc.data().DeliveryDate
        const note = doc.data().DeliveryNotes
        const recipientFName=doc.data().RecipientFirstName
        const recipientLName=doc.data().RecipientLastName
        const deliveryAdress = doc.data().RecipientAddress
        const status = doc.data().Status
        objectArray.push(new addToArr(id, driver, clientName,clientLName, phoneNum, item, note, recipientFName,recipientLName,deliveryAdress,totalFee, date, status));
    });
});
console.log("Object Array:", objectArray);
let flag = 0;
let historyOpened = 0;
/******************************************DROP DOWN MENU *************************************************/
displayDrop = () => {
    console.log("displayDrop Cliked");
   
    let drivers = [...new Set(objectArray.map(a => a.name))];
    const ulist = document.getElementById("driverList");
    if (flag === 0) {
        for (let i = 0; i < drivers.length; i++) {
            ulist.innerHTML += '<li><a onclick="displaySpecifyTable()" class="dropdown-item" href="#">' + drivers[i] + '</a></li>';
            console.log("driver" + i + " " + drivers[i]);
        }
        flag = 1;

    } else {
        console.log("added already");
    }
    if (historyOpened === 0) {
        var BR1 = document.createElement("br");
        var BR2 = document.createElement("br");
        var BR3 = document.createElement("br");
        var BR4 = document.createElement("br");

        document.getElementById("startContent").appendChild(BR2);
        document.getElementById("startContent").innerHTML += 'Welcome to the Database. Please select a date to display all deliveries created for that specific day. You can also a choose specific driver by selecting a driver name in the dropdown Menu';
        document.getElementById("startContent").appendChild(BR1);
        document.getElementById("startContent").appendChild(BR3);
        document.getElementById("startContent").appendChild(BR4);
        
    } else {
        document.getElementById("startContent").innerHTML = "";
    }
    historyOpened = 1;
}

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

displaySpecifyTable = () => {
    console.log("displaySpecifyTable clicked");
    let dropLinkList = document.getElementById("driverList");
    var date = document.getElementById("historyDate").value;
    var tableDiv = document.getElementById("historyContent");
    dropLinkList.onclick = function (event) {
        var target = getEventTarget(event);
        var dropLink = target.innerHTML;
        console.log(dropLink);
        if (date === "") {
            alert("Please choose a date to print result");
        } else {
            tableDiv.style.display = "block";
            document.getElementById("historyContent").innerHTML = "";
            //question

            printHistory(dropLink, date);
        }
    };
}

/******************************************DROP DOWN MENU *************************************************/

displayTable = () => {
    document.getElementById("startContent").innerHTML = "";
    let drivenum = 0;
    var tableDiv = document.getElementById("historyContent");
    // var alert = document.getElementById("driverNum");
    var date = document.getElementById("historyDate").value;
    let buttonOfAlert = '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    console.log(date);

    if (date === "") {
        alert("Please choose a date to print result");
    }
    else {
        tableDiv.style.display = "block";
        // alert.style.display = "block";
        document.getElementById("historyContent").innerHTML = "";
        //question
        let unique = [...new Set(objectArray.map(a => a.name))];
        console.log(unique);
        for (const element of unique) {
            printHistory(element, date);
            drivenum++;
        }
        // document.getElementById("driverNum").innerHTML = buttonOfAlert + "      You now have " + drivenum + " drivers";

    }
}


printHistory = (name, date) => {

    let toPrint = '<table class="table table-hover">';
    toPrint += '<tr class="table-primary"><th>Driver Name</th><th colspan="10">' + name + '</th></tr>';
    toPrint +=
        '<tr><th>Order Number</th><th>Driver Name</th><th>Client Name</th><th>Client Phone</th><th>Item</th><th>Note</th><th>Recipient Name</th><th>Address</th><th>Pay rate</th><th>Date</th><th>Status</th></tr>';
    for (const element of objectArray) {
        if (element.name === name && date === element.date) {
            toPrint += '<tr><td>' + element.id + '</td><td>' + element.name + '</td><td>' + element.client_name +'&nbsp'+ element.client_lname +
                '</td><td>' + element.phone_num + '</td><td>' +
                element.item +  '</td><td>' + element.note + '</td><td>'+ element.recipientFName + '&nbsp'+ element.recipientLName+'</td><td>' + element.deliveryAdress + '</td>'+'</td><td>$' + element.totalFee + '</td><td>' + element.date
            if (element.status === "Delayed") {
                toPrint += '<td class="text-warning">' + element.status + '</td>' + '</tr>';
            } else if (element.status === "Completed") {
                toPrint += '<td class="text-success">' + element.status + '</td>' + '</tr>';
            } else if (element.status === "Work In Progress") {
                toPrint += '<td class="text-primary">' + element.status + '</td>' + '</tr>';
            } else if (element.status === "Cancelled") {
                toPrint += '<td class="text-danger">' + element.status + '</td>' + '</tr>';
            }
        }
    }

    toPrint += '</table></br></br>';
    document.getElementById('historyContent').innerHTML += toPrint;
}




function addToArr(id, name, client_name,client_lname, phone_number, item, note,recipientFName,recipientLName, deliveryAdress,total, date, status) {
        this.id = id,
        this.name = name,
        this.client_name = client_name,
        this.client_lname=client_lname,
        this.phone_num = phone_number,
        this.item = item,
        this.note = note,
        this.recipientFName=recipientFName,
        this.recipientLName=recipientLName,
        this.deliveryAdress = deliveryAdress,
        this.totalFee = total,
        this.date = date,
        this.status = status
}