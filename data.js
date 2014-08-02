var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('Connected to database');
});

//
// Sets up the basic database connection
//
exports.connect = function(connectionString) {
    mongoose.connect(connectionString);
}
