var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var cart = require('../cart.js');
var _ = require('underscore');
var websocketsHandler = require('../websockets-handler');
var router = express.Router();

router.post('/', function(req, res, next) {
    var cartItems = cart.getCartItems(req.session);
    var ids = _.pluck(cartItems, 'itemId');
    data.getItemsById(ids, function(err, items) {
    	var orderItems = [];
    	var orderTotal = 0;
    	for (var i in items) {
    		var item = items[i];
            var cartItem = _.find(cartItems, function(i) { return i.itemId == item._id; });
            var linePrice = item.price * cartItem.quantity;
            orderItems.push({
            	name: item.name,
            	unitPrice: item.price,
            	quantity: cartItem.quantity,
            	linePrice: item.price * cartItem.quantity
            });
    		orderTotal += linePrice;
    	}
    	var orderData = {
    		items: orderItems,
    		total: orderTotal
    	};
    	data.getBuddygroupId(req.session,req.sessionID, function(error, buddygroupId) {
    		if (error) {
    			next(error);
    		} else {
    			orderData.buddygroupId = buddygroupId;
    			data.createOrder(orderData, function(error, orderDocument) {
    				if (error) {
    					next(error);
    				} else {
    					websocketsHandler.sendToGroupBySessionId(req.sessionID, "placeNewOrder", orderDocument);
    					cart.clearCart(req.session);
    					res.redirect('/checkout-success?orderId=' + orderDocument._id);
    				}
    			});
    		}
    	});
    });
});

module.exports = router;
