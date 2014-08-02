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

		var wrapper = document.createElement('span');
		var image = document.createElement('img');
		image.width = 40;
		image.height = 40;
		image.src = msg.imageUrl;
		var title = document.createTextNode(msg.name);

		wrapper.appendChild(image);
		wrapper.appendChild(title);

		buddyList.addContent(wrapper);
	});

	socket.on('joined', function(msg) {
		buddyList.addContent(msg.text);
	});

	socket.on('reconnect', function(msg) {
		buddyList.addContent(msg.text);
	});
}
