$(document).ready(function(){
	createSocket();

});

function createSocket(){
	
	if(typeof socket != "undefined") {
		socket.emit('setGroupId');
		return;
	}
	
	socket = io.connect("/");
	
	socket.on('visitItem', function(msg) {
		console.log(msg);
	});
	
	socket.on('joined', function(msg) {
		console.log(msg);
	});
	
	socket.on('reconnect', function(msg) {
		console.log("REconnect");
	});
}