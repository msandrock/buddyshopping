var express = require('express');
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

    cartItems = cart.getCartItems(req.session);

    // TODO: Get all cart items from the database

    console.log(cartItems);



    cartItems = [];
    res.render('cart', { title: 'Cart', cartItems: cartItems});

});

//
// Adds an item to the users cart; Expects the item id as a parameter ("id")
//
router.post('/ajax_add_item_to_cart', function(req, res) {

    // Store the item in the users session - try to load the cart from session
    var id = req.query.id;

    cart.addItemToCart(req.session, id);

    res.send({success: true});

});

module.exports = router;
