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

module.exports = router;
