var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var router = express.Router();

router.get('/', function(req, res, next) {

	// Update the user name in session
	if(req.query.userName) {
		console.log(req.query.userName);
		req.session.userName = req.query.userName;
	}

	data.getBuddygroupId(req.sessionID, function(error, buddygroupId) {
		if (error) {
			var err = new Error(error);
			err.status = 500;
			next(err);
		} else {
			res.render('buddy-shopping', {
				buddygroupId: buddygroupId,
				qrCodeUrl: 'http://' + ipAddress + ':'+config.global.port+'/buddy-join?buddygroupId=' + buddygroupId
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
