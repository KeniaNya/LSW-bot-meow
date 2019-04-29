var fChatLibInstance;
var channel;
var players = [];
var table = [
	["this is an error, lol",1,1],
	["send a quick slap",1,4],
	["do a hard squeeze",1,6],
	["send a fast punch",1,8],
	["send a fast kick",1,10],
	["step on their opponent's crotch",2,10],
	["send a hard knee strike",3,4],
	["use a tool",3,6],
	["heal",1,6],
	["roll again with maximum damage",0,0],
	["roll twice",0,0]
];
var maxdamage = false;
var twice = false;
var r = "[color=red]"; var y = "[color=yellow]"; var g = "[color=green]"; var b = "[color=cyan]";
var c = "[/color]";

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.bb_join = function (args, data) {
		if (players.length == 2) { fChatLibInstance.sendMessage(r+"Can't join. This game is for two players only"+c, channel); return 0; }
		if (players.length == 1 && players[0].name == data.character) { fChatLibInstance.sendMessage(y+"You're already in"+c, channel); return 0; }
		let cantidad = parseInt(args);
		if (isNaN(cantidad) || cantidad < 1) { fChatLibInstance.sendMessage(r+"health should be a positive number~ (example: bb_join 25)"+c, channel); return 0; }
		players.push({name: data.character, health: cantidad});
		fChatLibInstance.sendMessage(g+data.character+" has joined the ballbusting dice game!"+c, channel);
	}
	
	cmdHandler.bb_end = function (args, data) {
		players = [];
		fChatLibInstance.sendMessage(y+"Game finished."+c, channel);
	}
	
	cmdHandler.bb_roll = function (args, data) {
		if (players.length < 2) { fChatLibInstance.sendMessage(y+"You need 2 players"+c, channel); return 0; }
		let atacante; let defensor;
		if (players[0].name == data.character) { atacante = players[0]; defensor = players[1]; } else { atacante = players[1]; defensor = players[0]; }
		let dice = Math.ceil(Math.random() * 10); // 10
		let message = b+atacante.name+" rolled a "+y+dice+c+", they "+table[dice][0]+"!"+c;
		if (dice >= 8) {
			if (dice == 8) {
				let dice2 = 0;
				for (let i = 0; i < table[dice][1]; i++) { dice2 += Math.ceil(Math.random() * table[dice][2]); }
				message += b+" They recover "+y+dice2+c+" health! "+y+"("+table[dice][1]+"d"+table[dice][2]+")"+c+c;
				atacante.health += dice2;
			}
			if (dice == 9) { maxdamage = true; }
			if (dice == 10) { twice = true; }
		} else {
			let dice2 = 0;
			for (let i = 0; i < table[dice][1]; i++) { dice2 += Math.ceil(Math.random() * table[dice][2]); }
			if (maxdamage) {
				dice2 = table[dice][1] * table[dice][2];
				if (!twice) { maxdamage = false; }
				else { twice = false; }
			}
			message += b+" They deal "+y+dice2+c+" damage to "+defensor.name+"! "+y+"("+table[dice][1]+"d"+table[dice][2]+")"+c+c;
			defensor.health -= dice2;
			if (defensor.health <= 0) {
				defensor.health = 0;
				message += r+" They are out! Game finished!"+c;
				players = [];
			}
			message += y+"\n"+atacante.name+": "+atacante.health+" health, "+defensor.name+": "+defensor.health+" health."+c;
		}
		fChatLibInstance.sendMessage(message, channel);
	}
	
	return cmdHandler;
};