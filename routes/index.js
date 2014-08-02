var express = require('express');
var data = require('../data.js');
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
    // Extrat the item id from the url
    var id = req.params[0];

    data.getItemById(id, function(err, item) {
        if(!err) {
            res.render('details', { title: 'Express', item: item[0]});
        } else {
            console.log(err);
        }
    });

});

//
// Adds an item to the users cart; Expects the item id as a parameter ("id")
//
router.get('/ajax_add_item_to_cart', function(req, res) {

    // Store the item in the users session

    console.log(req.query);

    res.send({"foo":"bar"});

});

module.exports = router;
