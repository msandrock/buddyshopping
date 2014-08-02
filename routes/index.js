var express = require('express');
var _ = require('underscore');
var data = require('../data.js');
var cart = require('../cart.js');
var router = express.Router();
var websocketsHandler = require('../websockets-handler');

/* GET home page. */
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

router.get('/details/*', function(req, res) {
    // Extract the item id from the url
    var id = req.params[0];

	var cartCount = cart.getItemCount(req.session);

    data.getItemById(id, function(err, item) {
        if(!err) {
            res.render('details', { title: 'Express', item: item[0], cartCount : cartCount});
			websocketsHandler.sendToGroupBySessionId(req.sessionID, "visitItem", item[0]);
        } else {
            console.log(err);
        }
    });

	
});

router.get('/cart', function(req, res) {
    // Get all cart items and return them to the view
    var cartItems = cart.getCartItems(req.session);
    // Get all corresponding items from the database
    var ids = _.pluck(cartItems, 'itemId');

    var cartCount = cart.getItemCount(req.session);

    data.getItemsById(ids, function(err, items) {

        /*var viewItems = [];

        for(var i = 0 ; i < items.length ; i++) {
            // Construct a new object
            var viewItem = {
                _id : items[i]._id,
                name : items[i].name,
                description : items[i].description,
                imageUrl : items[i].imageUrl,
                quantity : 5
            };

            viewItems.push(viewItem);
        }*/

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
				total : item.price * cartItem.quantity
            };
        });

        res.render('cart', { title: 'Cart', cartItems: cartItems, cartCount: cartCount});
    });
});

router.get('/checkout', function(req, res) {
    // Get all cart items and return them to the view

    cartItems = cart.getCartItems(req.session);

    // TODO: Get all cart items from the database

    console.log(cartItems);



    cartItems = [];
    res.render('checkout', { title: 'Cart', cartItems: cartItems});
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
// shown after successful checkout
//
router.get('/checkout-success', function(req, res) {
    res.render('checkout-success', {});

});

module.exports = router;
