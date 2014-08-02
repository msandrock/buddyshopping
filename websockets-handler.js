var cookieSignature = require('cookie-signature');
var cookie = require('cookie');
var data = require('./data.js');
generalWebsockets = {};
websocketsFromGroup = {};

exports.handleConnect = function (socket) {
	var sessionId = getcookie(socket.handshake.headers.cookie, config.session.name, config.session.secret);
	socket.sessionId = sessionId;
	console.log("New Websocket connect");
	
	data.ifIsBodyGroupJoined(sessionId, function(error, groupId, isJoined){

		socket.groupId = false;
		
		if(isJoined) {
			socket.groupId = groupId;
			
			if(typeof websocketsFromGroup[groupId] == "undefined")
				websocketsFromGroup[groupId] = {};
			
			websocketsFromGroup[groupId][sessionId] = socket;
			
		}

	});
	
	sessionStore.get(sessionId, function(err, session){
		
		generalWebsockets[sessionId] =  session;
		socket.session =  session;
		
		socket.on('setGroupId', function() {
			data.ifIsBodyGroupJoined(socket.sessionId, function(error, groupId, isJoined){
				if(isJoined) {
					if(typeof websocketsFromGroup[groupId] == "undefined")
						websocketsFromGroup[groupId] = {};
					websocketsFromGroup[groupId][sessionId] = socket;
				}

			});

		});
		
		
		
		
		
		
		
		
		
		
		socket.on('disconnect', function() {
			handleDisconnect(socket);
		});
		
		
		
	});
	
}

handleDisconnect = function(socket){
	console.log("disconnect");
	var sessionId = socket.sessionId;
	if(typeof generalWebsockets[sessionId] != "undefined") {
		delete generalWebsockets[sessionId];
	}
	
	if( socket.groupId) {
		delete websocketsFromGroup[socket.groupId][sessionId] ;
	}
		
}

function sendToGroup(groupId, type, content) {
	var group = websocketsFromGroup[groupId];
	console.log("send to other in Group" + groupId);

	for (var sessionId in group) {
		console.log("send to " + sessionId);
		group[sessionId].emit(type, content);
	}
}

function sendToGroupBySessionId(sessionID, type, content) {
	
	data.ifIsBodyGroupJoined(sessionID, function(error, groupId, isJoined){
		
		if(isJoined) {
			sendToGroup(groupId, type, content);
		}

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

exports.sendToGroup = sendToGroup;
exports.sendToGroupBySessionId = sendToGroupBySessionId;