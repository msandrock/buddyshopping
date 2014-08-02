var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('test-geisse', {ipAddress: ipAddress});
});

module.exports = router;
