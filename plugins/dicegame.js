var fChatLibInstance;
var channel;
var players = [];
var r = "[color=red]"; var y = "[color=yellow]"; var g = "[color=green]"; var b = "[color=cyan]";
var c = "[/color]";

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.join = function (args, data) {
		if (players.length == 2) { fChatLibInstance.sendMessage(r+"Can't join. This game is for two players only"+c, channel); return 0; }
		if (players.length == 1 && players[0].name == data.character) { fChatLibInstance.sendMessage(y+"You're already in"+c, channel); return 0; }
		let arr = args.split(",");
		arr[0] = parseInt(arr[0]);
		arr[1] = parseInt(arr[1]);
		arr[2] = parseInt(arr[2]);
		arr[3] = parseInt(arr[3]);
		if (isNaN(arr[0]) || arr[0] < 1) { fChatLibInstance.sendMessage(r+"attack should be a positive number~"+c, channel); return 0; }
		if (isNaN(arr[1]) || arr[1] < 1) { fChatLibInstance.sendMessage(r+"defense should be a positive number~"+c, channel); return 0; }
		if (isNaN(arr[2]) || arr[2] < 1) { fChatLibInstance.sendMessage(r+"will should be a positive number~"+c, channel); return 0; }
		if (isNaN(arr[3]) || arr[3] < 1) { fChatLibInstance.sendMessage(r+"HP should be a positive number~"+c, channel); return 0; }
		players.push({name: data.character, attack: arr[0], defense: arr[1], will: arr[2], hp: arr[3]});
		fChatLibInstance.sendMessage(g+data.character+" has joined the dice game!"+c, channel);
	}
	
	cmdHandler.end = function (args, data) {
		players = [];
		fChatLibInstance.sendMessage(y+"Game finished."+c, channel);
	}
	
	cmdHandler.attack_roll = function (args, data) {
		if (players.length < 2) { fChatLibInstance.sendMessage(y+"You need 2 players"+c, channel); return 0; }
		let atacante; let defensor;
		if (players[0].name == data.character) { atacante = players[0]; defensor = players[1]; } else { atacante = players[1]; defensor = players[0]; }
		let dice1 = Math.ceil(Math.random() * 10); let total1 = dice1 + atacante.attack;
		let dice2 = Math.ceil(Math.random() * 10); let total2 = dice2 + defensor.defense;
		let message = "\n"+b+atacante.name+" rolled a "+y+dice1+"+"+atacante.attack+c+", getting a total of "+total1+"!"+c;
		message += "\n"+b+defensor.name+" rolled a "+y+dice2+"+"+defensor.defense+c+", getting a total of "+total2+"!"+c;
		if (total1 > total2) {
			let dice3 = Math.ceil(Math.random() * 6);
			message += "\n"+b+"They deal "+y+dice3+c+" damage to "+defensor.name+"! "+y+"(1d6)"+c+c;
			defensor.hp -= dice3;
			if (defensor.hp <= 0) {
				defensor.hp = 0;
				message += r+" They are out! Game finished!"+c;
				players = [];
			}
		} else {
			message += "\n"+r+"They miss!"+c;
		}
		message += y+"\n"+atacante.name+": "+atacante.hp+" health, "+defensor.name+": "+defensor.hp+" health."+c;
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.will_roll = function (args, data) {
		if (players.length < 2) { fChatLibInstance.sendMessage(y+"You need 2 players"+c, channel); return 0; }
		let atacante; let defensor;
		if (players[0].name == data.character) { atacante = players[0]; defensor = players[1]; } else { atacante = players[1]; defensor = players[0]; }
		let dice1 = Math.ceil(Math.random() * 10); let total1 = dice1 + atacante.will;
		let dice2 = Math.ceil(Math.random() * 10); let total2 = dice2 + defensor.will;
		let message = "\n"+b+atacante.name+" rolled a "+y+dice1+"+"+atacante.will+c+", getting a total of "+total1+"!"+c;
		message += "\n"+b+defensor.name+" rolled a "+y+dice2+"+"+defensor.will+c+", getting a total of "+total2+"!"+c;
		if (total1 > total2) {
			let dice3 = Math.ceil(Math.random() * 4);
			message += "\n"+b+"They deal "+y+dice3+c+" will damage to "+defensor.name+"! "+y+"(1d4)"+c+c;
			defensor.will -= dice3;
			if (defensor.will <= 0) {
				defensor.wlll = 0;
				message += r+" They are mesmerized! Game finished!"+c;
				players = [];
			}
		} else {
			message += "\n"+r+"They miss!"+c;
		}
		message += y+"\n"+atacante.name+": "+atacante.will+" will, "+defensor.name+": "+defensor.will+" will."+c;
		fChatLibInstance.sendMessage(message, channel);
	}
	
	return cmdHandler;
};