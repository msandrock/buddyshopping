var config = require('./config.js');
var mongoose = require('mongoose');
var crypto = require('crypto');
var _ = require('underscore');
var websocketsHandler = require('./websockets-handler');
var randomNames = require('./random-names');

var db = mongoose.connection;

var itemSchema = mongoose.Schema({
	name : String,
	description : String,
	price : Number,
	imageUrl : String
});

var buddygroupSchema = mongoose.Schema({
	memberSessions : [
		mongoose.Schema({
			memberSessionId: String,
			name: String
		})
	],
	totalAmount : Number,
	discountEndTimestamp : Number
});

var orderSchema = mongoose.Schema({
	items : [mongoose.Schema({
    	name: String,
    	unitPrice: Number,
    	quantity: Number,
    	linePrice: Number
	})],
	total : Number,
	buddygroupId : { type: String, index: true },
	createdTimestamp : Number
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	// yay!
	console.log('Successfully connected to database');
});

// Set up the database connection
mongoose.connect(config.database.connectionString);

//
// Return a list with all categories
//
exports.getItems = function(callback) {

	// First get the model instance
	var Item = mongoose.model('Item', itemSchema);

	Item.find(callback);
};

//
// Return a single item by id
//
exports.getItemById = function(id, callback) {

	var Item = mongoose.model('Item', itemSchema);

	Item.find({ _id : id }, callback);
};

//
// Return all items in the id array
//
exports.getItemsById = function(ids, callback) {

    var Item = mongoose.model('Item', itemSchema);

    Item.find({ _id : { $in: ids }}, callback);
};

//
// Adds a new item to the collection
//
function createItem(name, description, price, imageUrl) {

	var item = new Item({
		name : name,
		description : description,
		price : price,
		imageUrl : imageUrl
	});

	item.save(function (err, item) {
		if (err) return console.error(err);

		// Possibly do something with item here, after it was saved
		console.log('Successfully saved item ' + item.name);
	});
}

/*
createItem('Lila kind', 'Lila kind net ganz so lang', 200000, '/images/home/product1.jpg');
createItem('Produkt 2', 'Jaaa, das ist auch ganzschön supii! Jap jap jap!', 999, '/images/home/product2.jpg');
createItem('Einstecktuch', 'Einstecktuch von Fabio Farini gestreift in blau weiss', 499, '/images/home/product3.jpg');
createItem('Landfleisch', 'Landfleisch Pur Rinderherzen&Nudeln', 89, '/images/home/product4.jpg');
createItem('Einfaches Produkt', 'Beschreibung für Produkt 5', 1785, '/images/home/product5.jpg');
createItem('Apple MacBook Pro', 'Gehäuse: Präzisions-Unibody-Aluminiumgehäuse', 167, '/images/home/product6.jpg');
*/

//
// Returns the ID of the user's buddy group
// The Username is only needed when user is not in a group
//
exports.getBuddygroupId = function(session,sessionId, username ,callback) {
	console.log("getBuddyGroupId", username);
	

	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Buddygroup.findOne({ "memberSessions.memberSessionId" : sessionId }, function(error, data) {
		if (error || data) {
			callback(error, data._id);
		} else {
			
			if(typeof username == "undefined") {
				username = getRandomName();
			}
			
			var currentMemberSession = {
				memberSessionId: sessionId,
				name: username
			};
			
			var buddygroupId = crypto.randomBytes(12).toString('hex');
			Buddygroup.create({_id: buddygroupId, memberSessions: [currentMemberSession], totalAmount: 0, discountEndTimestamp: 0}, function(error, data) {
				session.userName = username;
				callback(error, data ? data._id : null);
			});
		}
	});
};

//
// Returns the ID of the user's buddy group
//
exports.ifIsBodyGroupJoined = function(sessionId, callback) {
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Buddygroup.findOne({ "memberSessions.memberSessionId" : sessionId }, function(error, data) {
		if(data)
			callback(error, data._id, true);
		else
			callback(error, null, false);
	});
};

//
// Returns the ID of the user's buddy group
//
exports.changeUserName = function(session, sessionId, newUsername , callback) {
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	console.log(sessionId);
	
	Buddygroup.update({ 'memberSessions.memberSessionId' : sessionId }, {$set:{'memberSessions.$.name': newUsername}}, {}, function(error, numberAffected, rawResponse) {
		console.log(error);
		callback(error, null, false);
	});
};




//
// Joins a buddy group
//
exports.joinBuddygroup = function(session, sessionId, buddygroupId, username ,callback) {
	
	if(typeof username == "undefined" || username == null) {
		username = getRandomName();
	}
	
	var currentMemberSession = {
		memberSessionId: sessionId,
		name: username
	};
	
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Buddygroup.update({ 'memberSessions.memberSessionId' : sessionId }, {$pull: {'memberSessions' : {"memberSessionId": sessionId}}}, {}, function(error, numberAffected, rawResponse) {
		if (error) {
			callback(error);
		} else {
			Buddygroup.findOne({ _id: buddygroupId }, function(error, data) {
				if (error) {
					callback(error);
				} else if (!data) {
					Buddygroup.create({_id: buddygroupId, memberSessions: [currentMemberSession], totalAmount: 0, discountEndTimestamp: 0}, function(error, data) {
						callback(error);
						session.userName = username;
					});
				} else if (_.indexOf(data.currentMemberSession, sessionId) == -1) {
					Buddygroup.update({_id: buddygroupId}, {$push: {memberSessions: currentMemberSession}}, {}, function(error, numberAffected, rawResponse) {
						session.userName = username;
						callback(error);
						
						if(!error) {
							websocketsHandler.sendToGroup(buddygroupId, "joined", {text: username + " ist beigetreten"});
						}
					});
				} else {
					session.userName = username;
					callback(null);
				}
			});
		}
	});
};

function getRandomName(){
	return randomNames[Math.floor(Math.random()*randomNames.length)];
}

//
// Fetches information about an active buddygroup discount, if any
//
exports.getActiveBuddygroupDiscount = function(sessionId, callback) {
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Buddygroup.findOne({ "memberSessions.memberSessionId" : sessionId }, function(error, data) {
		var now = Math.floor(new Date().getTime() / 1000);
		if (error || !data || data.discountEndTimestamp < now) {
			callback(error, null);
		} else {
			callback(null, {endTimestamp: data.discountEndTimestamp});
		}
	});
}


//
// creates a new order
//
exports.createOrder = function(inputOrderData, callback) {
	var Order = mongoose.model('Order', orderSchema);
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Order.create(inputOrderData, function(error, order) {
		if (error) {
			callback(error);
		} else {
			Buddygroup.findOne({ _id : inputOrderData.buddygroupId }, function(error, buddygroup) {
				if (error || !buddygroup) {
					callback(null, order);
				} else {
					var now = Math.floor(new Date().getTime() / 1000);
					if (buddygroup.discountEndTimestamp < now) {
						buddygroup.totalAmount = 0;
					}
					buddygroup.totalAmount += order.total;
					buddygroup.discountEndTimestamp = (now + 3600);
					Buddygroup.update(
						{ _id: inputOrderData.buddygroupId },
						{ totalAmount: buddygroup.totalAmount, discountEndTimestamp: buddygroup.discountEndTimestamp},
						{},
						function(error, _dummy) {
							callback(null, order);
						}
					);
				}
			});
		}
	});
};

//
// fetches an order
//
exports.getOrder = function(orderId, callback) {
	var Order = mongoose.model('Order', orderSchema);
	Order.findOne({ _id : orderId }, callback);
};

//
// Fetches an order as well as orders that are related via a buddygroup.
// This function does not use the buddygroups table from the database since that
// table might have started a new set of related orders in the meantime, which
// might not be related to the order we are processing. Instead, it simply
// fetches orders with the same buddygroup ID that are at most one
// hour apart.
//
exports.getOrderProcessingDataForBackend = function(orderId, callback) {
	var Order = mongoose.model('Order', orderSchema);
	Order.findOne({ _id : orderId }, function(error, order) {
		if (error || !order) {
			callback(error, order);
		} else {
			Order.find({buddygroupId: order.buddygroupId}, function(error, buddygroupOrders) {
				console.log(order);
				if (error) {
					callback(error);
				} else {
					// TODO timestamp
					var buddygroupTotal = 0;
					for (var i in buddygroupOrders) {
						var otherOrder = buddygroupOrders[i];
						var timestampDelta = Math.abs(order.createdTimestamp - otherOrder.createdTimestamp);
						if (timestampDelta < 3600) {
							buddygroupTotal += otherOrder.total;
						}
					}
					callback(null, {
						order: order,
						buddygroupTotal: buddygroupTotal
					});
				}
			});
		}
	});
};
