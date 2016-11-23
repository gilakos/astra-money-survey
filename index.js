// Require dependent libraries
var Typeform = require('typeform-node-api');

// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// Define the port
var port = process.env.PORT || 3000;

// Send initial console message
server.listen(port, function () {
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

// Write listen message
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

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


// Request the typeform results with form id
typeform_api.getCompletedFormResponses('mKCmta', function (data) {
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
        // Add this data point to the scatter data object
        scatterData.data.push(dataPoint);
    }
    if (local_test == true) {
        // Log the result
        console.log(scatterData);
    } else {
        console.log('io socket connection goes here');
        
        io.on('connection', function (socket) {
            socket.on('graph_data_0', function (scatterData) {
                io.emit('graph_data_0', scatterData);
            });
        });
        
    }
});

