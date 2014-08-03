$(document).ready(function(){
	createSocket();
	
	var $button = $('#buddyShoppingButton');
	var $popup = $('#buddyShoppingPopup');
	var $mask = $('#buddyShoppingPopupMask');
	$button.click(function() {
		
		$popup.load('/buddy-shopping', function(){

			createSocket();

		});
		$popup.removeClass('fadeOutDown').addClass('animated fadeInUp').css('display', '');
		$mask.css('display', '');
	});
	
	$mask.click(function() {
		$popup.removeClass('fadeInUp').addClass('animated fadeOutDown');
		$popup.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$popup.css('display', 'none');
		});
		$mask.css('display', 'none');
	});
	

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
		buddyList.placeNewOrder(msg);
	});
	
	socket.on('chatMessage', function(msg) {
		console.log(msg);
		buddyList.handeChatMessage(msg);
	});
}
