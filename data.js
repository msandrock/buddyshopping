var mongoose = require('mongoose');
var db = mongoose.connection;
var connected = false;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('Successfully connected to database');
  connected = true;
});

//
// Sets up the basic database connection
//
exports.connect = function(connectionString) {

  if(!connected) {
    mongoose.connect(connectionString);
  } else {
    console.log('Already connected to database');
  }

}

//
// Closes the databaee connection
//
exports.close = function() {

  if(connected) {
    mongoose.close();
  } else {
    console.log('Connection is already closed');
  }
}


var itemSchema = mongoose.Schema({
    name: String,
    description : String,
    price : Number,
    imageUrl : String
});

// First get the model instance
var Item = mongoose.model('Item', itemSchema);

//
// Return a list with all categories
//
exports.getItems = function(callback) {

  if(connected) {
    Item.find(callback);
  } else {
    // Not connected to database
    err = "Not connected to database";
  }
}

/*

function (err, kittens) {
if (err) return console.error(err);
console.log(kittens)

*/

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
