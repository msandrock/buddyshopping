config = require('./config.js');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var data = require('./data.js');
sessionStore = new session.MemoryStore();

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var websocketsHandler = require('./websockets-handler');
var routes = require('./routes/index');
var users = require('./routes/users');
var test_geisse = require('./routes/test-geisse');
var test_sandrock = require('./routes/test-sandrock');
var test_vomhoff = require('./routes/test-vomhoff');
var buddy_shopping = require('./routes/buddy-shopping');
var buddy_join = require('./routes/buddy-join');
var place_new_order = require('./routes/place-new-order');
var order_backend = require('./routes/order-backend');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	store : sessionStore,
    secret: config.session.secret,
    name: config.session.name,
    resave: true,
    saveUninitialized: true
    }));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	data.getActiveBuddygroupDiscount(req.sessionID, function(error, activeDiscount) {
		var now = Math.floor(new Date().getTime() / 1000);
		if (activeDiscount && activeDiscount.endTimestamp > now) {
			res.locals.discountTimeLeft = (activeDiscount.endTimestamp - now);
		} else {
			res.locals.discountTimeLeft = -1;
		}
		
		next();
	});
});

//socket io
io.on('connection', websocketsHandler.handleConnect);

app.use('/', routes);
app.use('/users', users);
app.use('/test-geisse', test_geisse);
app.use('/test-sandrock', test_sandrock);
app.use('/test-vomhoff', test_vomhoff);
app.use('/buddy-shopping', buddy_shopping);
app.use('/buddy-join', buddy_join);
app.use('/place-new-order', place_new_order);
app.use('/order-backend', order_backend);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
http.listen(config.global.port);
console.log('Listening on port '+config.global.port);
