var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require("./config.js");
var routes = require('./routes/notfilxRouter');
var Movie = require('./routes/movies/movie');
var User = require('./routes/users/user');

mongoose.connect(config.database);

var films = require('./routes/movies/MoviesSetup.js');
var gebruikers = require('./routes/users/UserSetup.js');

Movie.count(function (err, count) {
   if(!err && count === 0) {
       films();
   }
});
User.count(function (err, count) {
    if(!err && count === 0) {
        gebruikers();
    }
});
// films();
// gebruikers();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use('/api', routes);


app.listen(8080, function () {
    console.log("Example app listening at port 8080")
});

function getimage(title) {
    //build request
    var token = "ed2dac5e-fceb-4cdc-900f-f971cbd3261e";
    var perf = "&token=";
    var starurl = "http://api.myapifilms.com/imdb/idIMDB?title=";
    var requestString = starurl + title + perf + token;
    //send request
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
        }
    };
    xhttp.open("GET", requestString, true);
    xhttp.send();
}

module.exports = app;