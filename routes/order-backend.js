var express = require('express');
var config = require('../config.js');
var data = require('../data.js');
var ipAddress = require('../ipaddress.js').ipAddress;
var url = require('url');
var router = express.Router();

router.get('/', function(req, res, next) {
	var urlParts = url.parse(req.url, true);
	var orderId = (urlParts.query.orderId ? urlParts.query.orderId : null);
	data.getOrderProcessingDataForBackend(orderId, function(error, processingData) {
		if (error || !processingData) {
			next(error);
		} else {
			console.log(processingData);
			
			// merchant configuration: max. discount (20% percent)
			var R = 0.2;

			// merchant configuration: convergence speed
			var C = 1.0;
			
			// compute discount
			var orderTotal = processingData.order.total;
			var otherOrdersTotal = processingData.buddygroupTotal - orderTotal;
			var relativeOtherOrdersTotal = (otherOrdersTotal / orderTotal);
			var discountFactor = R * (1 - Math.exp(-C * relativeOtherOrdersTotal));
			var discountPercent = (discountFactor * 100).toFixed(2);
			var discount = (discountFactor * orderTotal).toFixed(2);
			var reducedOrderTotal = (orderTotal - discount).toFixed(2);

			// render the view
			res.render('order-backend', {
				orderId: orderId,
				orderTotal: orderTotal,
				discount: discount,
				discountPercent: discountPercent,
				reducedOrderTotal: reducedOrderTotal
			});
			
		}
	});
});

module.exports = router;
