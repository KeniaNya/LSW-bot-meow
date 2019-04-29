var fChatLibInstance;
var channel;
var hey = "[b][color=red][Hey!][/color][/b] ";
var info = "[b][color=cyan][Info][/color][/b] ";
var started;
var day;
var town;
var mafia;
var characters;
var mafiaR = "[b][color=red]Mafia![/color][/b]";
var townR = "[b][color=green]Town[/color][/b]";
var witnessR = "[b][color=cyan]Witness[/color][/b]";
var mafiaLeaderR = "[b][color=red]Mafia leader![/color][/b]";

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	started = false;
	day = false;
	town = 0;
	mafia = 0;
	characters = [];
	mafias = [];
	
	cmdHandler.mafia_help = function(args, data) {
		let message = "[b][color=purple][Mafia-bot help!][/color][/b]\n";
		message += "These are the commands to play in this room:\n";
		message += "[b]!mafia_join[/b] Sits you in the table\n"; 
		message += "[b]!mafia_leave[/b] Removes you from the table\n";
		message += "[b]!mafia_remove[/b] Removes a person from the table (you need to add their name, exaple: !mafia_remove Nan Nan Yakamoto)\n";
		message += "[b]!mafia_players[/b] Lists the people sitting at the table\n";
		message += "[b]!mafia_stop[/b] Ends the game instantly and removes everyone from the table\n";
		message += "[b]!mafia_role[/b] Sends you your designated role and info associated with it\n";
		message += "[b]!mafia_start[/b] Starts the game by telling each player their secret role (this takes a while so be patient), then the night phase begins.\n";
		message += "[b]!mafia_kill[/b] Kills a person (you need to add their name, exaple: !mafia_kill Nan Nan Yakamoto) This commands work via PM when you're the mafia leader\n";
		message += "[b]!mafia_pass[/b] If the town doesn't agree on killing someone, the director can use this command to skip the town's killing phase\n";
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.mafia_join = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't join in the middle of a game.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice > -1) { fChatLibInstance.sendMessage(hey+data.character+" has already joined.", channel); return 0; }
		characters.push({name: data.character, role: "[color=yellow]None yet[/color]"});
		fChatLibInstance.sendMessage(info+data.character+" has joined.", channel);
	}
	
	cmdHandler.mafia_leave = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't leave in the middle of a game, end the game first.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice == -1) { fChatLibInstance.sendMessage(hey+data.character+" wasn't in.", channel); return 0; }
		characters.splice(indice, 1);
		fChatLibInstance.sendMessage(info + data.character + " has left.", channel);
	}
	
	cmdHandler.mafia_remove = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't remove a player in the middle of a game, end the game first.", channel); return 0; }
		let indice = busca(characters, args);
		if (indice == -1) { fChatLibInstance.sendMessage(hey + args + " wasn't in or wasn't found.", channel); return 0; }
		characters.splice(indice, 1);
		fChatLibInstance.sendMessage(info + args + " has been removed.", channel);
	}
	
	cmdHandler.mafia_players = function (args, data) {
		if (characters.length == 0) { fChatLibInstance.sendMessage(hey + "There are no players.", channel); return 0; }
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name; }
		fChatLibInstance.sendMessage(info+"Current players ("+characters.length+"): "+lista.join(", ")+". There are "+town+" town and "+mafia+" mafia!", channel);
	}
	
	cmdHandler.mafia_start = function (args, data) {
		if (started == true) { fChatLibInstance.sendMessage(hey+"There's a game going on, end that game first.", channel); return 0; }
		if (characters.length < 5) { fChatLibInstance.sendMessage(hey+"You need at least 5 players.", channel); return 0; }
		town = Math.ceil((characters.length * 7) / 10); //////////////////////////////////////////////////////////////////////////////////////////////
		mafia = characters.length - town;
		let deck = crearDeck(town, mafia);
		mafias = [];
		for (let i = 0; i < characters.length; i++) {
			characters[i].role = deck[i];
			if (characters[i].role == mafiaR) { mafias.push(characters[i].name); }
			if (characters[i].role == mafiaLeaderR) { mafias.push(characters[i].name); }
		}
		for (let i = 0; i < characters.length; i++) {
			let message = info+"You're "+characters[i].role+".";
			if (characters[i].role == witnessR || characters[i].role == mafiaR || characters[i].role == mafiaLeaderR) {
				message += " The mafia players are: "+mafias.join(", ")+".";
			}
			fChatLibInstance.sendPrivMessage(characters[i].name, message);
		}
		started = true;
		day = false;
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name; }
		let message = "[b][color=green][Game has started!][/color][/b] Current players ("+characters.length+"): "+lista.join(", ")+". There are "+town+" town and "+mafia+" mafia!";
		message += "\n[b][color=brown]It's night time![/color][/b] The mafia leader is going to kill someone."
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.mafia_kill = function (args, data) {
		if (started == false) { return 0; }
		let indice = busca(characters, args);
		//si es de dia y el mensaje es privado
		if (day == true && data.publico == false) { fChatLibInstance.sendPrivMessage(data.character, hey+"You can't kill a person during the day."); return 0; }
		//si es de noche y el mensaje es publico
		if (day == false && data.publico == true) { fChatLibInstance.sendPrivMessage(data.character, hey+"You can't kill a person during the night."); return 0; }
		//si es de noche y el mensaje es privado pero no eres el lider
		if (day == false && data.publico == false && characters[busca(characters, data.character)].role != mafiaLeaderR) {
			fChatLibInstance.sendPrivMessage(data.character, hey+"Only the mafia leader can kill people at night."); return 0;
		}
		if (indice == -1) { console.log("Mafia test? the person wasn't found"); return 0; }
		let message = "";
		//fChatLibInstance.sendMessage(hey+args+" has been killed! Their role was "+characters[indice].role, channel);
		message += hey+args+" has been killed! Their role was "+characters[indice].role;
		
		if (characters[indice].role == mafiaR) { mafia--; }
		if (characters[indice].role == mafiaLeaderR) { mafia--;
			for (let i = 0; i < characters.length; i++) {
				if (characters[i].role == mafiaR) {
					characters[i].role = mafiaLeaderR;
					fChatLibInstance.sendPrivMessage(characters[i].name, "You're now [color=red]Mafia leader![/color]");
					break;
				}
			}
		}
		if (characters[indice].role == townR) { town--; }
		if (characters[indice].role == witnessR) { town = -1; }
		characters.splice(indice, 1);
		
		if (town == -1) {
			fChatLibInstance.sendMessage(message+"\n[b][color=red]The mafia has won![/color][/b] They killed the witness!", channel);
			cmdHandler.mafia_stop(args, data); return 0;
		}
		if (mafia == 0) {
			fChatLibInstance.sendMessage(message+"\n[b][color=green]The town has won![/color][/b] All the mafia is dead!", channel);
			cmdHandler.mafia_stop(args, data); return 0;
		}
		if (town < mafia) {
			fChatLibInstance.sendMessage(message+"\n[b][color=red]The mafia has won![/color][/b] They have overrun the town!", channel);
			cmdHandler.mafia_stop(args, data); return 0;
		}
		
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name; }
		//fChatLibInstance.sendMessage(info + "Players still alive: "+ lista.join(", ")+". There are "+town+" town and "+mafia+" mafia!", channel);
		message += "\n"+info+"Players still alive ("+characters.length+"): "+lista.join(", ")+". There are "+town+" town and "+mafia+" mafia!";
		day = !day;
		if (day) { fChatLibInstance.sendMessage(message+"\n[b][color=yellow]It's day time![/color][/b] The town have to choose who to kill.", channel);
		} else { fChatLibInstance.sendMessage(message+"\n[b][color=brown]It's night time![/color][/b] The mafia leader is going to kill someone.", channel); }
	}
	
	cmdHandler.mafia_pass = function (args, data) {
		if (!started) { return 0; }
		if (!day) { fChatLibInstance.sendMessage(hey+"The town can only pass during the day.", channel); return 0; }
		day = false;
		let message = info+"The town didn't agree on who to kill this day. [b][color=yellow]They miss the opportunity to kill someone.[/color][/b]";
		message += "\n[b][color=brown]It's night time![/color][/b] The mafia leader is going to kill someone.";
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.mafia_stop = function (args, data) {
		//if (!started) { fChatLibInstance.sendMessage(hey+"There is no game goin on.", channel); return 0; }
		started = false;
		day = false;
		characters = [];
		mafia = 0;
		town = 0;
		fChatLibInstance.sendMessage(info + "The game has ended.", channel);
	}
	
	cmdHandler.mafia_role = function (args, data) {
		if (!started) { fChatLibInstance.sendMessage(hey+"There is no game going on.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice == -1) { fChatLibInstance.sendPrivMessage(data.character, hey+"You are not in the game."); return 0; }
		let message = info+"You're "+characters[i].role+".";
		if (characters[i].role == witnessR || characters[i].role == mafiaR || characters[i].role == mafiaLeaderR) {
			message += " The mafia players are: "+mafias.join(", ")+".";
		}
		fChatLibInstance.sendPrivMessage(data.character, message);
	}

    fChatLibInstance.addPrivateMessageListener(function(parent, data) {
		if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
			var opts = {
				command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
				argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
			};
			if (opts.command == "mafia_kill") {
				cmdHandler.mafia_kill(opts.argument, data);
			}
		}
	});
	
	return cmdHandler;
};

function busca(lista, name) {
    for (let i = 0; i < lista.length; i++) { if (lista[i].name == name) { return i; } }
    return -1;
}

function crearDeck(town, mafia) {
	let deck = [];
	for (let i = 1; i < mafia; i++) { deck.push(mafiaR); }
	for (let i = 1; i < town; i++) { deck.push(townR); }
	deck.push(witnessR);
	deck.push(mafiaLeaderR);
	
	for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}