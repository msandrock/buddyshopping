var express = require('express');
var _ = require('underscore');
var data = require('../data.js');
var cart = require('../cart.js');
var url = require('url');
var router = express.Router();
var websocketsHandler = require('../websockets-handler');

//
// GET the home page
//
router.get('/', function(req, res) {

	var cartCount = cart.getItemCount(req.session);

	// Load data from db and pass it to the view
	data.getItems(function(err, items) {
		if(!err) {
			res.render('index', { title: 'Express', products: items, cartCount : cartCount});
		} else {
			console.log(err);
		}
	});
});

//
// GET the item details page
//
router.get('/details/*', function(req, res) {
	// Extract the item id from the url
	var id = req.params[0];

	var cartCount = cart.getItemCount(req.session);

	data.getItemById(id, function(err, item) {
		if(!err) {
			res.render('details', { title: 'Express', item: item[0], cartCount : cartCount});
			console.log(req.session);
			websocketsHandler.sendToGroupBySessionId(req.sessionID, "visitItem", {item:item[0], username: req.session.userName}, function(){});
		} else {
			console.log(err);
		}
	});
});

//
// GET the cart view
//
router.get('/cart', function(req, res) {

	// Get all cart items and return them to the view
	var cartItems = cart.getCartItems(req.session);
	// Get all corresponding items from the database
	var ids = _.pluck(cartItems, 'itemId');

	var cartCount = cart.getItemCount(req.session);

	data.getItemsById(ids, function(err, items) {
		// Add quantity from cart items
		cartItems = _.map(items, function(item) {
			// Find the cart items quantity
			var cartItem = _.find(cartItems, function(i) { return i.itemId == item._id; })
			// Construct a new object
			return {
				_id : item._id,
				name : item.name,
				description : item.description,
				price : item.price,
				imageUrl : item.imageUrl,
				quantity : cartItem.quantity,
				subTotal : item.price * cartItem.quantity
			};
		});

		res.render('cart', { title: 'Cart', cartItems: cartItems, cartCount: cartCount});
	});
});

//
// GET the checkout view
//
router.get('/checkout', function(req, res) {

	// Get all cart items and return them to the view
	var cartItems = cart.getCartItems(req.session);
	// Get all corresponding items from the database
	var ids = _.pluck(cartItems, 'itemId');

	var cartCount = cart.getItemCount(req.session);

	data.getItemsById(ids, function(err, items) {
		// Add quantity from cart items
		cartItems = _.map(items, function(item) {
			// Find the cart items quantity
			var cartItem = _.find(cartItems, function(i) { return i.itemId == item._id; })
			// Construct a new object
			return {
				_id : item._id,
				name : item.name,
				description : item.description,
				price : item.price,
				imageUrl : item.imageUrl,
				quantity : cartItem.quantity,
				subTotal : item.price * cartItem.quantity
			};
		});

		res.render('checkout', { title: 'Cart', cartItems: cartItems, cartCount: cartCount});
	});

   	websocketsHandler.sendToGroupBySessionId(req.sessionID, "goToCheckout", {text : "Ein Benutzer geht zur Kasse"});

});

//
// Adds an item to the users cart; Expects the item id as a parameter ("id")
//
router.post('/ajax_add_item_to_cart', function(req, res) {

	// Store the item in the users session - try to load the cart from session
	var id = req.body.id;

	cart.addItemToCart(req.session, id);

	var cartCount = cart.getItemCount(req.session);

	res.send({success: true, cartCount : cartCount});

	data.getItemById(id, function(err, item) {
		if(!err) {
			websocketsHandler.sendToGroupBySessionId(req.sessionID, "addToCart", item[0]);
		}
	});
});

//
// Updates the users username in the session and the buddy group
//
router.post('/ajax_set_username', function(req, res) {

	// Store the username in session; Update it in the buddygroup
	var userName = req.body.userName;
	var oldName = req.session.userName;

	req.session.userName = userName;

	
	data.changeUserName(req.session, req.sessionID, userName, function(error){
		if(!error) {
			// TODO: Do something when username is changed
			websocketsHandler.sendToGroupBySessionId(req.sessionID, "rename", {text: oldName + " heißt jetzt " + userName});
		}
	});
	
	res.send({success: true});
});

//
// shown after successful checkout
//
router.get('/checkout-success', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var orderId = (url_parts.query.orderId ? url_parts.query.orderId : '');
	data.getOrder(orderId, function(error, order) {
		if (error) {
			next(error);
		} else {
			res.render('checkout-success', {
				order: order
			});
		}
	});
});

module.exports = router;
