var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    
        var testProduct = {
            _id: 1,
            name : "Leichte Jacke",
            description : "Dies ist eine Leicht Jacke",
            price : 1,
            imageUrl : "/images/home/product2.jpg"
        };
        var products = [];
        products.push(testProduct);

    
  res.render('index', { title: 'Express', products: products});
});

module.exports = router;
