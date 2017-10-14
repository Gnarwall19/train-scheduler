// Initialize Firebase
var config = {
    apiKey: "AIzaSyArj1ibjP3VywYgKpUlYerVUK3JnCp1bTg",
    authDomain: "train-scheduler-291e7.firebaseapp.com",
    databaseURL: "https://train-scheduler-291e7.firebaseio.com",
    projectId: "train-scheduler-291e7",
    storageBucket: "train-scheduler-291e7.appspot.com",
    messagingSenderId: "202912466413"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train").on("click", function () {

    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var time = moment($("#time-input").val().trim(), "HH:mm").format();             //IS THIS NECESSARY??
    var frequency = parseInt($("#frequency-input").val().trim());

    var newTrain = {
        name: name,
        destination: destination,
        time: time,
        frequency: frequency
    };

    //Push new train data to Firebase
    database.ref().push(newTrain);

    //Console Log train data
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    alert("New Train Added!");

    //Clear input
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
})


//Firebase event for adding trains to the database
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;

    // Employee Info
    /*
    console.log(name);
    console.log(destination);
    console.log(time);
    console.log(frequency);
    */

    //Subtract 1 year from first train time to make sure it comes before the current time
    var timeConverted = moment(time, "HH:mm").subtract(1, "years");

    //Current Time (military)
    var currentTime = moment();
    console.log("THE TIME IS: " + moment(currentTime).format("HH:mm"));

    //Difference in time between current and next train
    var timeDiff = moment().diff(moment(timeConverted), "minutes");
    console.log("----------------------");
    console.log("DIFFERENCE IN TIME: " + timeDiff);

    //Time apart
    var timeApart = timeDiff % frequency;
    console.log("----------------------");
    console.log("MINUTES TO SUBTRACT FROM FREQUENCY: " + timeApart);

    //Minutes until train arrives
    var minsAway = frequency - timeApart;
    console.log("----------------------");
    console.log("MINUTES UNTIL TRAIN: " + minsAway);

    //Arrival time for next train
    var nextArrival = moment().add(minsAway, "minutes");
    console.log("----------------------");
    console.log("THE NEXT TRAIN ARRIVES AT: " + moment(nextArrival).format("HH:mm"));



    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + minsAway + "</td></tr>");
});