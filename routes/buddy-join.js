var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var url = require('url');
var router = express.Router();

router.get('/', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	var buddygroupId = (url_parts.query.buddygroupId ? url_parts.query.buddygroupId : null);
	res.render('buddy-join', {buddygroupId: buddygroupId});
});

module.exports = router;
