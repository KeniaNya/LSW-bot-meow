const http = require('http');

const requestListener = function (req, res) {
	
	console.log(req.url)
	res.writeHead(200);
	res.end('Hello, World!');
	console.log("meow?");
}

const server = http.createServer(requestListener);
server.listen(6369);





/*
var FChatLib = require('fchatlib');
var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1", {db: 1});
client.on("error", function (err) { });
var saveDB = setInterval(function () { client.save(); }, 60000);

var options = {
	username: "dash", password: "meow1234nyan",
	character: "Bot Announcer Beta", master: "Kenia Nya",
	room: "adh-5b5393f9514b3c25ab71", cname: "Kenia Bot Nyan", cversion: "One point meow",
	debug: "false", discord: "true", rooms : "normal"
};

//debug: "false", discord: "true", rooms : "normal"
//room: "adh-5b5393f9514b3c25ab71"
var myFchatBot = new FChatLib(options);
console.log("ok");
*/