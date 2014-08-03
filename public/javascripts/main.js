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
		buddyList.visitItem(msg);
	});

	socket.on('addToCart', function(msg) {
		buddyList.addToCart(msg);
	});

	socket.on('goToCheckout', function(msg) {
		buddyList.goToCheckout(msg);
	});

	socket.on('joined', function(msg) {
		buddyList.joined(msg);
	});

	socket.on('reconnect', function(msg) {

	});
	
	socket.on("placeNewOrder", function(msg) {
		//TODO 
	});
	
	socket.on('chatMessage', function(msg) {
		console.log(msg);
		buddyList.handeChatMessage(msg);
	});
}
