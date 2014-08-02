var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('test-vomhoff', {});
});

module.exports = router;
