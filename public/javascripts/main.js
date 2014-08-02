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
		buddyList.addContent(msg.text);
	});

	socket.on('joined', function(msg) {
		buddyList.addContent(msg.text);
	});

	socket.on('reconnect', function(msg) {
		buddyList.addContent(msg.text);
	});
}
