// Require dependent libraries
var Typeform = require('typeform-node-api');

// Require express
var express = require('express');
//Express initializes app to be a function handler that you can supply to an HTTP server.
var app = express();
//Create an HTTP server.
var http = require('http').Server(app);
//Create instance of socket
var io = require('socket.io')(http);

// Define the port
var port = 3000;
//var port = process.env.PORT || 3000;

// Send initial console message
http.listen(3000, function () {
    console.log('Server listening at port %d', port);
});

// Define the public routing directory
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Render the default index file at the main url
app.get('/', function (request, response) {
    response.render('pages/index');
});

//// Write listen message
//app.listen(app.get('port'), function () {
//    console.log('Node app is running on port', app.get('port'));
//});

// Create new typeform api object with our api key
var typeform_api = new Typeform('3b6a02cd52c56c8a06df60d75979178c619d7f1e');

// Define the current year for age calculation
current_year = new Date().getFullYear();


/*
*****************
For testing locally, set localtest to True
When False, will skip the internal function
*****************
*/
var local_test = false;

// Testing Socket
//io.sockets.on('connection', function (socket) {
//    console.log('socket connected');
//});

//On socket connection, pull from typeform
io.on('connection', function (socket) {
    console.log("connection");

    // Request the typeform results with form id
    typeform_api.getCompletedFormResponses('mKCmta', function (data) {
        console.log("typeform");
        // Drill to second level to the responses
        var responses = data.responses;
        // Create the initial obj format for scatter plot (graph 0)
        var scatterData = {
                type: 'scatter plot',
                id: 0,
                data: []
            }
            // Loop through the responses
        for (var i = 0; i < responses.length; i++) {
            // Create empty obj for this response data point
            var dataPoint = {};
            // Drill down to answer level
            var answer = responses[i].answers;
            // Add properties for age, number of accounts, and gender
            dataPoint.age = current_year - parseInt(answer.number_26064010);
            dataPoint.numaccts = parseInt(answer.number_26116670);
            dataPoint.gender = answer.listimage_26064008_choice;
            dataPoint.acctfreq = answer.list_26116922_choice;
            dataPoint.appsUsed = answer.textfield_26320940;
            // Add this data point to the scatter data object
            scatterData.data.push(dataPoint);
        }
        if (local_test == true) {
            // Log the result
            console.log(scatterData);
        } else {
            console.log('io socket connection goes here');
            //emit the message to all sockets, including the sender
            io.emit('graph_data_0', scatterData);
        }
    });
});
