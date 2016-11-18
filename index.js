var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var Typeform = require('typeform-node-api');

var typeform_api = new Typeform('3b6a02cd52c56c8a06df60d75979178c619d7f1e');

typeform_api.getCompletedFormResponses('mKCmta', function (data) {
  
});

