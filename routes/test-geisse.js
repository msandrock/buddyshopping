var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	data.getBuddygroupId('foobar', function(buddygroupId) {
		res.render('test-geisse', {buddygroupId: buddygroupId});
	});
});

module.exports = router;
