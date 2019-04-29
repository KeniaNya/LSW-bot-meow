var fChatLibInstance;
var channel;
var hey = "[b][color=red][Hey!][/color][/b] ";
var info = "[b][color=cyan][Info][/color][/b] ";
var started;
var characters;
var totals = [];

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	started = false;
	characters = [];
	totals = [0,0,0,0,0,0];
	
	cmdHandler.ld_help = function(args, data) {
		//
	}
	
	cmdHandler.ld_join = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't join in the middle of a game.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice > -1) { fChatLibInstance.sendMessage(hey+data.character+" has already joined.", channel); return 0; }
		characters.push({name: data.character, dice: "[color=yellow]None yet[/color]"});
		fChatLibInstance.sendMessage(info+data.character+" has joined.", channel);
	}
	
	cmdHandler.ld_leave = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't leave in the middle of a game, end the game first.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice == -1) { fChatLibInstance.sendMessage(hey+data.character+" wasn't in.", channel); return 0; }
		characters.splice(indice, 1);
		fChatLibInstance.sendMessage(info + data.character + " has left.", channel);
	}
	
	cmdHandler.ld_remove = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't remove a player in the middle of a game, end the game first.", channel); return 0; }
		let indice = busca(characters, args);
		if (indice == -1) { fChatLibInstance.sendMessage(hey + args + " wasn't in or wasn't found.", channel); return 0; }
		characters.splice(indice, 1);
		fChatLibInstance.sendMessage(info + args + " has been removed.", channel);
	}
	
	cmdHandler.ld_players = function (args, data) {
		if (characters.length == 0) { fChatLibInstance.sendMessage(hey + "There are no players.", channel); return 0; }
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name; }
		fChatLibInstance.sendMessage(info+"Current players ("+characters.length+"): "+lista.join(", ")+".", channel);
	}
	
	cmdHandler.ld_start = function (args, data) {
		if (started == true) { fChatLibInstance.sendMessage(hey+"There's a game going on, end that game first.", channel); return 0; }
		if (characters.length < 2) { fChatLibInstance.sendMessage(hey+"You need at least 2 players.", channel); return 0; }
		
		for (let i = characters.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = characters[i];
			characters[i] = characters[j];
			characters[j] = temp;
		}
		
		for (let i = 0; i < characters.length; i++) {
			characters[i].dice = rollDice();
			let message = info+"Your dice are: "+characters[i].dice+".";
			fChatLibInstance.sendPrivMessage(characters[i].name, message);
		}
		started = true;
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name+"("+(i+1)+")"; }
		let message = "[b][color=green][Game has started!][/color][/b] Current players ("+characters.length+"): "+lista.join(", ")+".";
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.ld_reveal = function (args, data) {
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = "\n"+characters[i].name+" has "+characters[i].dice; }
		let message = "[b][color=green][The dice have been revealed!][/color][/b]";
		message += lista.join("");
		message += "\nDice count: [b]"+totals[0]+"x1, "+totals[1]+"x2, "+totals[2]+"x3, "+totals[3]+"x4, "+totals[4]+"x5, "+totals[5]+"x6[/b]";
		fChatLibInstance.sendMessage(message, channel);
		cmdHandler.ld_stop();
	}
	
	cmdHandler.ld_stop = function (args, data) {
		started = false;
		characters = [];
		totals = [0,0,0,0,0,0];
		fChatLibInstance.sendMessage(info + "The game has ended.", channel);
	}
	
	cmdHandler.ld_dice = function (args, data) {
		if (!started) { fChatLibInstance.sendMessage(hey+"There is no game going on.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice == -1) { fChatLibInstance.sendPrivMessage(data.character, hey+"You are not in the game."); return 0; }
		let message = info+"Your dice are: "+characters[indice].dice+".";
		fChatLibInstance.sendPrivMessage(data.character, message);
	}

    /* fChatLibInstance.addPrivateMessageListener(function(parent, data) {
		if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
			var opts = {
				command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
				argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
			};
			if (opts.command == "ld_kill") {
				cmdHandler.ld_kill(opts.argument, data);
			}
		}
	}); */
	
	return cmdHandler;
};

function busca(lista, name) {
    for (let i = 0; i < lista.length; i++) { if (lista[i].name == name) { return i; } }
    return -1;
}

function rollDice() {
	let dice = [];
	for (let i = 0; i < 5; i++) { dice[i] = Math.ceil(Math.random()*6); totals[dice[i]-1]++; }
	return "[b]"+dice.join(", ")+"[/b]";
}