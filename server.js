var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use( express.static( __dirname + '/public' ) );

// global variables
var sessionList = new Array();
var currentSession = 0;



// redirect user to a dedicated session
app.get( '/', function ( request, response ) {
	// generate an UNIQUE session id 	
	while (sessionList[currentSession] >= 1){
		currentSession++;
	}
	
	response.redirect( '/' + currentSession );
	
} );

// serve the static HTML page to the client
app.get( '/:session([0-9]+)', function ( request, response ) {
	// not necessary unique ID, can be manual or re-direct from root
	// get the session ID "request.params.session"
	session = request.params.session;
	console.log('session: ' + session);
	sessionList[session] = 1;
	
	response.sendFile( __dirname + '/views/index.html' );
} );

var server = app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

// socket.io
var io = require('socket.io')(server);
io.on( 'connection', function( socket ) {
	
	// 'register' event
	socket.join(session);
	console.log( 'New user connected, room: ' + session );
	
	// 'disconnect' event
	socket.on( 'disconnect', function() {
		console.log( 'User disconnected' );
	} );
	
	
});

