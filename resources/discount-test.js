
// max. discount (20% percent)
var R = 0.2;

// convergence speed
var C = 1.0;

// order data
var orderTotal = 1000;
var otherOrdersMax = 5000;
var otherOrdersStep = 100;

// show example calculation
console.log('max. discount factor (R): ' + R);
console.log('convergence speed (C) ' + C);
console.log('order total: ' + orderTotal);
console.log('');
for (var otherOrdersTotal = 0; otherOrdersTotal <= otherOrdersMax; otherOrdersTotal += otherOrdersStep) {
	var relativeOtherOrdersTotal = (otherOrdersTotal / orderTotal);
	var discountFactor = R * (1 - Math.exp(-C * relativeOtherOrdersTotal));
	var discountPercent = (discountFactor * 100).toFixed(2);
	var discount = (discountFactor * orderTotal).toFixed(2);
	var reducedOrderTotal = (orderTotal - discount).toFixed(2);
	console.log('other orders total ' + otherOrdersTotal + ' --> ' + discountPercent + '% discount (' + discount + ') --> ' + reducedOrderTotal);
}
