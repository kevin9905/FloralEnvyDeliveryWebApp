let array=[];
var db = app_firebase.firestore();
const myRef = db.collection('orders');
//Read date from firebase to the array
myRef.get().then((snapshot) => {
        snapshot.docs.forEach((doc) =>{
                const id=doc.data().OrderNumber
                const driver=doc.data().AssignedDriver
                const client_fname=doc.data().ClientFirstName
                const client_lname=doc.data().ClientLastName
                const phoneNum=doc.data().ClientPhone
                const item=doc.data().DeliveryItem
                const notes=doc.data().DeliveryNotes
                const recipientFName=doc.data().RecipientFirstName
                const recipientLName=doc.data().RecipientLastName
                const address=doc.data().RecipientAddress
                const fee=doc.data().PayRate
                const date=doc.data().DeliveryDate
                const status=doc.data().Status
                array.push(new addToArray(id, driver,client_fname,client_lname,phoneNum,item,notes,recipientFName,recipientLName,address,fee,date,status));

            });
});
//for testing
console.log(array);
//Initialize the array, add the object to the array
function addToArray(id, name,client_fname,client_lname,phone_number,item,notes,recipientFName,recipientLName,address,total,date,status){
  this.id=id,
  this.name=name,
  this.client_fname=client_fname,
  this.client_lname=client_lname,
  this.phone_num=phone_number,
  this.item=item,
  this.notes=notes,
  this.recipientFName=recipientFName,
  this.recipientLName=recipientLName,
  this.address=address,
  this.fee=total,
  this.date=date,
  this.status=status
}
//sort by date
const sortByDate = array => {
  const sorter = (a, b) => {
     return new Date(a.date) - new Date(b.date);
  }
  array.sort(sorter);
};
//Print the report in table format 
function printReportTableWithName(name,date1,date2) {
  let total=0;
  let toPrint='<table class="table table-hover">';
  toPrint += '<tr class="bg-dark text-white"><th>Driver Name</th><th colspan="9">'+name+'</th></tr>';
  toPrint += '<tr><th>Order Number</th><th>Driver Name</th><th>Client Name</th><th>Phone</th><th>Item</th><th>Notes</th><th>Recipient Name</th><th>Address</th><th>Pay rate</th><th>Date</th></tr>';
  for (const element of array) {
    var dateFromFireBase= new Date(element.date);
      if (element.name === name && (dateFromFireBase >= date1 && dateFromFireBase <=date2) && element.status === "Completed") {
          toPrint += '<tr><td>' + element.id + '</td><td>' + element.name + '</td><td>'+ element.client_fname +'&nbsp'+ 
          element.client_lname +'</td><td>'+ element.phone_num +'</td><td>'+ element.item +'</td><td>'
          +element.notes +'</td><td>'+element.recipientFName +'&nbsp'+ element.recipientLName +'</td><td>'+element.address 
          +'</td><td>$' + element.fee + '</td><td>' + element.date + '</td></tr>';
          total+=parseInt(element.fee);
      }
  }
  toPrint += '<tr class="table-info" ><th>Total Pay Rate</th><th colspan="9">$'+total+'</th></tr>';
  toPrint +='</table><br><br>';
  document.getElementById('content').innerHTML += toPrint;
}
//event listener when click the button
function myFunction() {
  var viewContent = document.getElementById("content");
  var date1 = document.getElementById("date1").value;
  var date2 = document.getElementById("date2").value;
  var getDate1 = new Date(date1);
  var getDate2 = new Date(date2);
  var string = "<h3 class='text-danger text-center'>Weekly Report from <mark>" + date1 + "</mark> to <mark>" + date2 + "</mark></h3><br><br>";
  console.log(string);
  sortByDate(array);
  array.sort(function(a,b){
    return a.name.localeCompare(b.name);
  });

  if (date1 === "" || date2 === ""){
      alert("Please select the date range you want to report");
  }else if (getDate1 > getDate2){
     alert("Cannot report from" + date1+ "to"+ date2+", please select the correct day");
  }  
  else{
            viewContent.style.display = "block";
            document.getElementById("content").innerHTML = string; 
            unique = [...new Set(array.map(a => a.name))];
            console.log(unique);
            for(const element of unique){
            printReportTableWithName(element,getDate1,getDate2);
    }
  }
}
//Save and print pdf format
function printData(divName){
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();
    window.location.reload(true);
    document.body.innerHTML = originalContents;
} 








    

