var FChatLib = require('fchatlib');

var options = {
	username: "dash", password: "meow1234nyan",
	character: "Bot Announcer Beta", master: "Kenia Nya",
	room: "frontpage", cname: "kenia bot beta", cversion: "one point meow",
	debug: "true", discord: "false", rooms: "debug"
};

var myFchatBot = new FChatLib(options);
console.log("ok");