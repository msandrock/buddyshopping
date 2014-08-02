var express = require('express');
var _ = require('underscore');
var data = require('../data.js');
var cart = require('../cart.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    // Load data from db and pass it to the view
    data.getItems(function(err, items) {
        if(!err) {
            res.render('index', { title: 'Express', products: items});
        } else {
            console.log(err);
        }
    });

});

router.get('/details/*', function(req, res) {
    // Extract the item id from the url
    var id = req.params[0];

    data.getItemById(id, function(err, item) {
        if(!err) {
            res.render('details', { title: 'Express', item: item[0]});
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

    data.getItemsById(ids, function(err, items) {

        var viewItems = [];

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
        }

        // Add quantity from cart items
        cartItems = _.map(items, function(item) {
            // Find the cart items quantity
            var cartItem = _.find(cartItems, function(i) { return i.itemId = item._id; })
            // Construct a new object
            return {
                _id : item._id,
                name : item.name,
                description : item.description,
                price : item.price,
                imageUrl : item.imageUrl,
                quantity : cartItem.quantity
            };
        });

        console.log(cartItems);

        res.render('cart', { title: 'Cart', cartItems: cartItems});

    });
});

//
// Adds an item to the users cart; Expects the item id as a parameter ("id")
//
router.post('/ajax_add_item_to_cart', function(req, res) {

    // Store the item in the users session - try to load the cart from session
    var id = req.body.id;

    cart.addItemToCart(req.session, id);

    res.send({success: true});

});

module.exports = router;
