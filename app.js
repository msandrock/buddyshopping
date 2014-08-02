var _ = require('underscore');
var express = require('express');
var mongodb = require('mongodb');

var app = express();


app.get('/', function(req, res){
  res.send('Hello buddyshopping');
});

var server = app.listen(1337, function() {
    console.log('Listening on port %d', server.address().port);
});
