var express = require('express');
var app = express();

// app.set('port', (process.env.PORT || 5000));

app.use( express.static( __dirname + '/public' ) );

var server_port = process.env.PORT || 8000;
var server_ip_address = process.env.IP || '127.0.0.1';

app.get( '/', function ( request, response ) {
	// response.send('Hello World!');
	response.sendFile( __dirname + '/views/index.html' );
} );

var server = app.listen( server_port, server_ip_address, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log( 'Listening at http://%s:%s', host, port );
} );

