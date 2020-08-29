var fChatLibInstance;
var channel;
var players = [];
var r = "[color=red]"; var y = "[color=yellow]"; var g = "[color=green]"; var b = "[color=cyan]";
var c = "[/color]";

// to-do
// añadir los combos, counter y skills
// https://www.f-list.net/c/Pound%20Town

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	var speak = function(message){
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.join = function (args, data) {
		if (players.length == 2) { speak(r+"Can't join. This game is for two players only"+c); return 0; }
		if (players.length == 1 && players[0].name == data.character) { speak(y+"You're already in"+c); return 0; }
		let arr = args.split(",");
		if (arr.length != 3) { speak("You have to type your STR,DEX,CON", channel); return 0; }
		let stats = [];
		let total = 0;
		for (a in arr) {
			if (isNaN(arr[a]) || arr[a] < 0) { speak(r+"stats should be a positive number~"+c, channel); return 0; }
			stats[a] = parseInt(arr[a]);
			total += stats[a];
		}
		if (total > 5) { speak(r+"You can only have a max total of 5 stat points"+c); return 0; }
		players.push({name: data.character, STR: stats[0], DEX: stats[1], CON: stats[2], HP: 20+stats[2]*2});
		speak(g+data.character+" has joined the game!"+c);
		//speak(JSON.stringify(players));
	}
	
	cmdHandler.end = function (args, data) {
		players = [];
		fChatLibInstance.sendMessage(y+"Game finished."+c, channel);
	}
	
	cmdHandler.attack_roll = function (args, data) {
		if (players.length < 2) { speak(y+"You need 2 players"+c); return 0; }
		let atacante; let defensor;
		if (players[0].name == data.character) { atacante = players[0]; defensor = players[1]; } else { atacante = players[1]; defensor = players[0]; }
		let dice1 = Math.ceil(Math.random() * 20); let total1 = dice1 + atacante.STR;
		let dice2 = Math.ceil(Math.random() * 20); let total2 = dice2 + defensor.DEX;
		let message = "\n"+b+atacante.name+" rolled a "+y+dice1+"+"+atacante.STR+c+", getting a total of "+total1+"!"+c;
		message += "\n"+b+defensor.name+" rolled a "+y+dice2+"+"+defensor.DEX+c+", getting a total of "+total2+"!"+c;
		let result = dice1 - dice2;
		let damage = 0;
		if (result <= 3) { message += r+"\nAttack blocked!"+c }
		if (result >= 4 && result <= 8) {
			damage = Math.ceil(Math.random() * 4);
			message += g+"\nThe punch deals "+damage+" HP!"+c;
		}
		if (result >= 9 && result <= 13) {
			damage = Math.ceil(Math.random() * 6);
			message += g+"\nThe punch deals "+damage+" HP!"+c;
		}
		if (result >= 14 && result <= 18) {
			damage = Math.ceil(Math.random() * 10);
			message += g+"\nThe punch deals "+damage+" HP!"+c;
		}
		defensor.HP -= damage;
		if (defensor.HP <= 0) {
			defensor.HP = 0;
			message += r+" They are out! Game finished!"+c;
			players = [];
		} else {
			message += y+"\n"+atacante.name+": "+atacante.HP+" health, "+defensor.name+": "+defensor.HP+" health."+c;
		}
		speak(message);
	}
	
	return cmdHandler;
};