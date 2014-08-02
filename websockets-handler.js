var cookieSignature = require('cookie-signature');
exports.setHandler = function (socket, session) {
	
	sessionId = getcookie(socket.handshake.headers.cookie, config.session.name, config.session.secret);
	sessionStore.get(sessionId, function(err, socket){
		
		
		
		socket.on('view_item', function(data) {

		});
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	});
	
}

function getcookie(header, name, secret) {
//  var header = req.headers.cookie;
  var raw;
  var val;

  // read from cookie header
  if (header) {
    var cookies = cookie.parse(header);

    raw = cookies[name];

    if (raw) {
      if (raw.substr(0, 2) === 's:') {
        val = cookieSignature.unsign(raw.slice(2), secret);

        if (val === false) {
          debug('cookie signature invalid');
          val = undefined;
        }
      } else {
        debug('cookie unsigned')
      }
    }
  }

  // back-compat read from cookieParser() signedCookies data
  if (!val && req.signedCookies) {
    val = req.signedCookies[name];

    if (val) {
      deprecate('cookie should be available in req.headers.cookie');
    }
  }

  // back-compat read from cookieParser() cookies data
  if (!val && req.cookies) {
    raw = req.cookies[name];

    if (raw) {
      if (raw.substr(0, 2) === 's:') {
        val = cookieSignature.unsign(raw.slice(2), secret);

        if (val) {
          deprecate('cookie should be available in req.headers.cookie');
        }

        if (val === false) {
          debug('cookie signature invalid');
          val = undefined;
        }
      } else {
        debug('cookie unsigned')
      }
    }
  }

  return val;
}
