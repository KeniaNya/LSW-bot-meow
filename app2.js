var redis = require("redis");

var client = redis.createClient(6379, "127.0.0.1", {db: 1});
client.on("error", function (err) { console.log("Redis error " + err); });

var tempo = setInterval(function () {
	client.save();
	//console.log("ding");
}, 60000);

