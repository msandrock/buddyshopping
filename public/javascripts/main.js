$(document).ready(function(){
	createSocket();

	var $button = $('#buddyShoppingButton');
	var $popup = $('#buddyShoppingPopup');
	var $mask = $('#buddyShoppingPopupMask');
	$button.click(function() {

		var popupUrl = '/buddy-shopping';

		// Check the username; Send it to the server as a get parameter
		if(typeof(localStorage) != 'undefined') {

			var userName = localStorage.getItem('userName');

			if(userName != null) {
				popupUrl += '?userName='+userName;
			}
		}

		$popup.load(popupUrl, function(){

			createSocket();

		});
		$popup.removeClass('fadeOutUp').addClass('animated fadeInDown').css('display', '');
		$mask.css('display', '');
	});

	$mask.click(function() {
		$popup.removeClass('fadeInDown').addClass('animated fadeOutUp');
		$popup.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$popup.css('display', 'none');
		});
		$mask.css('display', 'none');
	});


	$('#countdown').countdown({
		until: discountTimeLeft,
		format: 'yowdhMS',
		layout: '{hnn}{sep}{mnn}{sep}{snn}'
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

	socket.on("rename", function(msg) {
		buddyList.rename(msg);
	});

	socket.on('chatMessage', function(msg) {
		buddyList.handeChatMessage(msg);
	});
}

function fbshare(link){
	var sharer = "https://www.facebook.com/sharer/sharer.php?u=";
	window.open(sharer + link,'sharer', 'width=626,height=436');
}

