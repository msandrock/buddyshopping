var config = require('./config.js');
var mongoose = require('mongoose');
var crypto = require('crypto');
var _ = require('underscore');
var websocketsHandler = require('./websockets-handler');

var db = mongoose.connection;

var itemSchema = mongoose.Schema({
	name : String,
	description : String,
	price : Number,
	imageUrl : String
});

var buddygroupSchema = mongoose.Schema({
	memberSessionIds : { type: [String], index: true }
});

var orderSchema = mongoose.Schema({
	items : [mongoose.Schema({
    	name: String,
    	unitPrice: Number,
    	quantity: Number,
    	linePrice: Number
	})],
	total : Number,
	buddygroupId : String,
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
//
exports.getBuddygroupId = function(sessionId, callback) {
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Buddygroup.findOne({ memberSessionIds : sessionId }, function(error, data) {
		if (error || data) {
			callback(error, data._id);
		} else {
			var buddygroupId = crypto.randomBytes(12).toString('hex');
			Buddygroup.create({_id: buddygroupId, memberSessionIds: [sessionId]}, function(error, data) {
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
	Buddygroup.findOne({ memberSessionIds : sessionId }, function(error, data) {
		if(data)
			callback(error, data._id, true);
		else
			callback(error, null, false);
	});
};

//
// Joins a buddy group
//
exports.joinBuddygroup = function(sessionId, buddygroupId, callback) {
	var Buddygroup = mongoose.model('Buddygroup', buddygroupSchema);
	Buddygroup.update({ memberSessionIds : sessionId }, {$pull: {memberSessionIds : sessionId}}, {}, function(error, numberAffected, rawResponse) {
		if (error) {
			callback(error);
		} else {
			Buddygroup.findOne({ _id: buddygroupId }, function(error, data) {
				if (error) {
					callback(error);
				} else if (!data) {
					Buddygroup.create({_id: buddygroupId, memberSessionIds: [sessionId]}, function(error, data) {
						callback(error);
					});
				} else if (_.indexOf(data.memberSessionIds, sessionId) == -1) {
					Buddygroup.update({_id: buddygroupId}, {$push: {memberSessionIds: sessionId}}, {}, function(error, numberAffected, rawResponse) {
						callback(error);
						if(!error) {
							websocketsHandler.sendToGroup(buddygroupId, "joined", {text: "Ein Benutzer ist beigetreten"});
						}
					});
				} else {
					callback(null);
				}
			});
		}
	});
};

//
// creates a new order
//
exports.createOrder = function(data, callback) {
	var Order = mongoose.model('Order', orderSchema);
	Order.create(data, callback);
};

//
// fetches an order
//
exports.getOrder = function(orderId, callback) {
	var Order = mongoose.model('Order', orderSchema);
	Order.findOne({ _id : orderId }, callback);
};
