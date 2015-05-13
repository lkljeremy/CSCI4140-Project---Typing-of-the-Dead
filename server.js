var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use( express.static( __dirname + '/public' ) );

app.get( '/', function ( request, response ) {
	// response.send('Hello World!');
	response.sendFile( __dirname + '/views/index.html' );
} );

var server = app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

// socket.io
var io = require('socket.io')(server);
io.on( 'connection', function( socket ) {
	
});

