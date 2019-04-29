var fChat;
var channel;
var players = [];
var jsonfile = require('jsonfile');
var g = "[color=green][b]"; var y = "[color=yellow][b]"; var r = "[color=red][r]"; var ec = "[/b][/color]";
function green(text) { return g+text+ec; }
function yellow(text) { return y+text+ec; }
function red(text) { return r+text+ec; }
var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.18", {db: 3});
var races = require('./etc/races.js');
var Personaje = require('./etc/personaje1a.js');

module.exports = function (parent, chanName) {
    fChat = parent;
	
    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.meow = function (args, data) { fChat.sendPrivMessage(data.character, "meow"); }
	
	fChat.addMessageListener( function (parent, data) {
		if (data.character != "Bot Announcer" || data.message.split(" has ")[1] != "joined!") { return 0; }
		let player = data.message.split(" has ")[0];
		console.log(player);
		//bienvenida y pedir que seleccione la raza
	});
	
	fChat.addPrivateMessageListener(function(parent, data) { if (!data || !data.message || !(data.message.length > 2)) { return 0; }
		let args = data.message.trim();
		client.hgetall(data.character, function (err, chara) { if (chara == null) { return 0; } var pj = new Personaje(chara); console.log("ding"+pj.creacion);
			if (pj.creacion == "done") { return 0; }
			switch (pj.creacion) {
			case "race":
				let race = busca(races, args);
				if (race == -1) { priv(data.character, "wrong"); return 0; }
				priv(data.character, "Found!");
				//do stuff
				//set
			break;
			}
		});
		
	});
	
	
	
	return cmdHandler;
};

function busca(lista, nombre) {
	for (let i = 0; i < lista.length; i++) { if (lista[i].name.toLowerCase() == nombre.toLowerCase()) { return lista[i]; } }
    return -1;
}



//bienvenida, explicacion,