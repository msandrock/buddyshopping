var os = require('os');
var networkInterfaces = os.networkInterfaces();
for (var index in networkInterfaces) {
	var results = networkInterfaces[index].filter(function(details) {
		return details.family === 'IPv4' && details.internal === false;
	});
	if (results.length > 0) {
		exports.ipAddress = results[0].address;
	}
}
