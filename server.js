// JavaScript source code
var http = require('http');
//var express = require('express');
//var app = express();
//app.use(express.static('public'));

app.get('/', function (req, res) {
    //res.redirect('TntWkDiRn.html');
    res.send("<h1>HELLO HEROKU</h1>");
})


http.createServer(app).listen(process.env.PORT || 8080, function () {
   console.log('Server running at http://sugarcanesoft.iptime.org');
});