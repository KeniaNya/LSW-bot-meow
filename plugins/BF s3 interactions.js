var fchat;
var channel;

var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.25", {db: 3});

module.exports = function (parent, chanName){
	fchat = parent;
	channel = chanName;
	
	var cmd = {};
	client.on("error", function (err) { console.log("Redis error " + err); });
	
	//añadir sendmoney
	
	return cmd;
}

function send(message, data) {
	if (data.publico) {
		fchat.sendMessage(message, channel);
	}
	else {
		fchat.sendPrivMessage(data.character, message);
	}
}