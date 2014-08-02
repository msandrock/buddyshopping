var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    // Load data from db and pass it to the view
    data.getItems(function(err, items) {
      if(!err) {
        res.render('index', { title: 'Express', products: items});
      }
    });
});

router.get('/details', function(req, res) {
    
        var testProduct = {
            _id: 1,
            name : "Leichte Jacke",
            description : "Dies ist eine Leicht Jacke",
            price : 1,
            imageUrl : "/images/home/product2.jpg"
        };

    
  res.render('details', { title: 'Express', product: testProduct});
});

module.exports = router;
