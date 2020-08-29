var fchat;
var channel;

var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.25", {db: 3});

//JSON.stringify
//JSON.parse

module.exports = function (parent, chanName){
	fchat = parent;
	channel = chanName;
	
	var cmd = {};
	client.on("error", function (err) { console.log("Redis error: " + err); });
	
	cmd.register = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				send("Alredy registered", data); return 0;
			}
			let nuevo = newPlayer(data.character);
			client.hmset(data.character, nuevo);
			send("Registered! Welcome!", data);
			//////////////////////////////////////////////////////////////////////
		});
	}
	
	//añadir listener y la cadena de creacion de personaje
	
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

// 5 5 5 3 3 3 - 5 5 4 4 3 3 - 4 4 4 4 4 4

function newPlayer(chara) {
	let nuevo = {}
	nuevo.name = chara;
	nuevo.stagename = chara;
	nuevo.statpoints = {
		attack: 6, defense: 6, extra: 0
//cuando bajas tus stats mas allá de 3, estos solo sirven para subir un stat menor a 3
	}
	nuevo.stats = {
		attack: {
			fingers: 3, lips: 3, tits: 3, sex: 3, ass: 3, feet: 3
		},
		defense: {
			fingers: 3, lips: 3, tits: 3, sex: 3, ass: 3, feet: 3
		},
		adictions: [], //"feet to face"
		resistances: [],
		speed: 0, HP: 100, critchance: 0
	};
	nuevo.equipment = {
		worn: { fingers: 400, lips: 0, tits: 100, sex: 200, ass: 250, feet: 300 },
		other: [],
		inventory: []
	};
	nuevo.customnames = []; //"400 #meow# Custom name #meow# custom flavor"
	nuevo.wins = 0;
	nuevo.loses = 0;
	nuevo.money = 0;
	nuevo.level = 1;
	nuevo.xp = 0;
	nuevo.skillpoints = 0;
	nuevo.skills = [];
	nuevo.weight = 803; //Middle
	nuevo.domsub = "switch";
	nuevo.color1 = "purple";
	nuevo.color2 = "pink";
	nuevo.faction = "LSW member";
	
	return { data : JSON.stringify(nuevo) };
}