var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	data.getBuddygroupId('foobar', function(error, buddygroupId) {
		if (error) {
			var err = new Error(error);
			err.status = 500;
			next(err);
		} else {
			res.render('test-geisse', {buddygroupId: buddygroupId});
		}
	});
});

module.exports = router;
