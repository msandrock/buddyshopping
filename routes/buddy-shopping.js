var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var url = require('url');
var router = express.Router();

function handleBuddygroupIdChange(req, res, newBuddygroupId, redirectUrl) {
	function redirect() {
		res.redirect(redirectUrl);
	}
	if (newBuddygroupId) {
		data.joinBuddygroup(req.sessionID, newBuddygroupId, redirect);
	} else {
		redirect();
	}
}

router.get('/', function(req, res, next) {
	var url_parts = url.parse(req.url, true);
	if (url_parts.query.buddygroupId) {
		handleBuddygroupIdChange(req, res, url_parts.query.buddygroupId, '/');
	} else {
		data.getBuddygroupId(req.sessionID, function(error, buddygroupId) {
			if (error) {
				var err = new Error(error);
				err.status = 500;
				next(err);
			} else {
				res.render('buddy-shopping', {
					buddygroupId: buddygroupId,
					qrCodeUrl: 'http://' + ipAddress + ':1337/buddy-shopping?buddygroupId=' + buddygroupId
				});
			}
		});
	}
});

router.post('/', function(req, res, next) {
	handleBuddygroupIdChange(req, res, req.body.buddygroupId, req.referer || '/');
});

module.exports = router;
