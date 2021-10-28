

        (function () {
            var firebase = app_firebase;
            var userUid = 0;

            //Check if user is logged in
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {

                  //  console.log(user.email);
                    // connect with firestore 
                    var db = app_firebase.firestore();
                    // specifing the collection
                    const alpeshcongRef = db.collection('accountManagement');
                    // array to store the records
                    var accManageArray = new Array();

                    alpeshcongRef.where('Email', '==', user.email).get().then(snapshots => {

                        if (snapshots.size > 0) {
                            snapshots.forEach(u => {
                                console.log();
                                if (u.data().isAdmin == 1) {
                                    // iterating over the list of collection to make the array populated
                                    alpeshcongRef.get().then((snapshot) => {
                                        // finding the no. of record in document for iteration
                                        //var registeredAM = snapshot.docs.length;
                                        snapshot.docs.forEach((doc) => {
                                            const data = doc.data()
                                            accManageArray.push(data);
                                        });
                                        //table var
                                        var table;
                                        //datatable configuration
                                        var dtOptions = {
                                            //adding column 5 action buttons
                                            columnDefs: [{
                                                targets: 4,
                                                //targets: 5,
                                                render: function (data, type, full, meta) {
                                                    if (type === 'display') {
                                                        data = '<div class="links">' +
                                                            '<i class="fas fa-user-edit" style="padding-right:4px; color:#473bf0; cursor: pointer;"> Edit</i> ' +
                                                            '<i  class="fas fa-trash"  style="padding-right:4px; color:#ff005c; cursor: pointer;"> Delete</i>' +
                                                            '</div>';
                                                    }
                                                    return data;
                                                }
                                            }],
                                            // setting table data 
                                            data: accManageArray,
                                            //hiding show numbers of record per page
                                            bLengthChange: false,
                                            //setting page length to 10
                                            pageLength: 10,
                                            //column names and their keys in data array
                                            columns: [
                                                {
                                                    title: "First Name",
                                                    data: "FirstName",
                                                },
                                                {
                                                    title: "Last Name",
                                                    data: "LastName",
                                                },
                                                {
                                                    title: "Email",
                                                    data: "Email",
                                                },
                                                {
                                                    title: "Phone Number",
                                                    data: "PhoneNumber",
                                                },
                                                // {
                                                //     title: "Password",
                                                //     data: "Uid",

                                                // },
                                                {
                                                    title: "Action",
                                                    orderable: false,
                                                    data: null
                                                }
                                            ]
                                        }


                                        // Call the dataTables jQuery plugin
                                        $(document).ready(function () {
                                            table = $('#example').DataTable(dtOptions);

                                            $("#example").on("click", ".fas.fa-ban", function (e) {
                                                $(this).text(' Delete');
                                                var found = $(this).prev();
                                                $(found).removeClass().addClass("fas fa-user-edit");
                                                $(found).text(' Edit');
                                                $.each($(this).closest("tr").off("mousedown").find("td"), function (i, el) {
                                                    var txt = $(this).find("input").val()
                                                    $(this).html(txt);
                                                });
                                                e.stopPropagation();
                                                $(this).removeClass().addClass("fas fa-trash");
                                            })


                                            // delete record from the firestore and then remove from the table
                                            $("#example").on("click", "td .fas.fa-trash", function (e) {
                                                debugger
                                                var r = confirm("Are you sure you want to delete it?");
                                                if (r == true) {// finding email to delete record as email is unique per record
                                                    var email = $(this).closest("tr").find("td").filter(":eq(2)")[0].innerHTML;
                                                    //query firestore collection to find the record based on email
                                                    alpeshcongRef.where('Email', '==', email).get().then(snapshots => {
                                                        //if record found then size will be greater then 0 then delete record
                                                        if (snapshots.size > 0) {
                                                            snapshots.forEach(driver => {
                                                                // removing the record with specified email
                                                                alpeshcongRef.doc(driver.id).delete();
                                                            })
                                                        }
                                                        //alert for end user as record deleted
                                                        alert("Driver Record Deleted")
                                                    }) // catch in case any error found
                                                        .catch(err => { console.log(err); alert("Issue Deleting the Driver! Contact Developer") });
                                                    //removing from the table
                                                    table.row($(this).closest("tr")).remove().draw();
                                                }

                                            });

                                            //on mouse click then making row editable
                                            $("#example").on('mousedown', "input", function (e) {
                                                e.stopPropagation();
                                            });
                                            // edit button click action
                                            $("#example").on('mousedown.edit', ".fas.fa-user-edit", function (e) {
                                                //changing buttons
                                                debugger
                                                $(this).removeClass().addClass("fas fa-save");
                                                $(this).text(' Save');
                                                var found = $(this).next();
                                                $(found).removeClass().addClass("fas fa-ban");
                                                $(found).text(' Cancel');
                                                // allowing all values; not action and email field
                                                var $row = $(this).closest("tr").off("mousedown");
                                                var $tds = $row.find("td").not(":eq(2)").not(':last');
                                                $.each($tds, function (i, el) {
                                                    var txt = $(this).text();
                                                    $(this).html("").append("<input type='text' value=\"" + txt + "\">");
                                                });
                                            });
                                            //saving record to firestore
                                            $("#example").on('mousedown.save', ".fas.fa-save", function (e) {
                                                //changing action buttons
                                                $(this).removeClass().addClass("fas fa-user-edit");
                                                $(this).text(' Edit');
                                                var found = $(this).next();
                                                $(found).removeClass().addClass("fas fa-trash");
                                                $(found).text(' Delete');
                                                var $row = $(this).closest("tr");
                                                var $tds = $row.find("td").not(":eq(2)").not(':last');
                                                //finding the email to update record to firestore
                                                var email = $row.find("td").filter(":eq(2)")[0].innerHTML;
                                                // array to store new values
                                                var recordArray = [];
                                                // reading each value from the row and adding them in array
                                                $.each($tds, function (i, el) {
                                                    var txt = $(this).find("input").val()
                                                    $(this).html(txt);
                                                    recordArray[i] = txt;
                                                });
                                                //query firestore collection to find the record based on email
                                                alpeshcongRef.where('Email', '==', email).get().then(snapshots => {
                                                    if (snapshots.size > 0) {
                                                        snapshots.forEach(driver => {
                                                            //updating record
                                                           // alpeshcongRef.doc(driver.id).update({ LastName: recordArray[1], FirstName: recordArray[0], PhoneNumber: recordArray[2], Password: recordArray[3] })
                                                            alpeshcongRef.doc(driver.id).update({ LastName: recordArray[1], FirstName: recordArray[0], PhoneNumber: recordArray[2] })
                                                        })
                                                    }
                                                    //note for end user
                                                    alert("Driver Record Updated")
                                                })
                                                    //updaing the end user if there is error occur during the update
                                                    .catch(err => { console.log(err); alert("Issue Updating the Driver! Contact Developer") });
                                            });
                                        });
                                    });
                                }
                                else {
                                    location.replace("index.html");
                                }
                            })
                        }
                    });
                } else {
                    // No user is signed in, send back to login screen
                    window.location.replace(window.location.host + "index.html");
                }
            });
        })();
    