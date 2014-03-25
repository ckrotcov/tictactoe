var express = require('express');

//Get the server situated
var app = express();

app.configure(function(){
	app.use(express.bodyParser());
	app.use('/', express.static(__dirname + '/public'));
	app.use('/img', express.static(__dirname + '/public/img'));
	
});

app.get('/', function (req, res) {
	res.sendfile('public/tictac.html');	
});



app.listen(8333);
console.log('Listening on port 8333');
