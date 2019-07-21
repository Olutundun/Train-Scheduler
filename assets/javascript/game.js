// Initialize Firebase
var config = {
    apiKey: "AIzaSyAAEsqKPkcAR6y6uxNtEdsUzneCNe1v9BU",
    authDomain: "train-schedule-b3357.firebaseapp.com",
    databaseURL: "https://train-schedule-b3357.firebaseio.com",
    projectId: "train-schedule-b3357",
    storageBucket: "train-schedule-b3357.appspot.com",
    messagingSenderId: "557794756379"
};
firebase.initializeApp(config);

//create a variable to reference the database
var database = firebase.database();
var name = "";
var destination = "";
var firstTrain = "";
var frequency = 0;

//when user hits submit
$("#add-train").on("click", function () {
    event.preventDefault();
    // Grab values from text-boxes
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    //push values to database
    database.ref().push({
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })

    // Clears the text-boxes
    generateData();
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
})

function generateData() {
    $("tbody").empty()
    database.ref().on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable 
        var sv = snapshot.val();
        var name = sv.name;
        var destination = sv.destination;
        var frequency = sv.frequency;
        var firstTrain = sv.firstTrain;

        //create new row and add info from database
        newRow = $("<tr>");
        newRow.append("<td>" + sv.name + "</th>");
        newRow.append("<td>" + sv.destination + "</th>");
        newRow.append("<td>" + sv.firstTrain + "</th>");
        newRow.append("<td>" + sv.frequency + "</th>");

        // train time pushed back one year to ensure it comes before the current time
        var trainTime = moment(firstTrain, "hh:mm").subtract(1, "years");
        console.log(trainTime)
        var current = moment();

        var minuteDiff = moment().diff(moment(trainTime), "minutes");
        var remainder = minuteDiff % frequency;
        var arrivalMinutes = frequency - remainder;

        var nextTrain = moment().add(arrivalMinutes, "minutes");
        var arrivalTime = moment(nextTrain).format("hh:mm");

        $("#train-table > tbody").append(
            $("<tr>").append(
                $("<td>").text(name),
                $("<td>").text(destination),
                $("<td>").text(frequency),
                $("<td>").text(arrivalTime),
                $("<td>").text(arrivalMinutes),
            )
        );
    })
}
generateData();
setInterval(generateData, 20000);

//Users from many different machines must be able to view same train times.
//create modal to give user confirmation after train is added
