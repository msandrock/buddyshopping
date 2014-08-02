var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var router = express.Router();

router.get('/', function(req, res, next) {
	data.getBuddygroupId(req.sessionID, function(error, buddygroupId) {
		if (error) {
			var err = new Error(error);
			err.status = 500;
			next(err);
		} else {
			res.render('buddy-shopping', {
				buddygroupId: buddygroupId,
				qrCodeUrl: 'http://' + ipAddress + ':1337/buddy-join?buddygroupId=' + buddygroupId
			});
		}
	});
});

router.post('/', function(req, res, next) {
	function redirect() {
		res.redirect(req.referer || '/');
	}
	if (req.body.buddygroupId) {
		data.joinBuddygroup(req.sessionID, req.body.buddygroupId, redirect);
	} else {
		redirect();
	}
});

module.exports = router;
