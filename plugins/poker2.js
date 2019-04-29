var fChatLibInstance;
var channel;
var characters = [];
var currentDeck = [];
var started = false;
var fase = 1;
var mesa = [];

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.poker_help = function(args, data) {
		let message = "[b][color=purple][Texas Hold'em poker-bot help!][/color][/b]\n";
		message += "If you don't know how to play poker, you can [url=https://www.pokerstars.com/poker/]click here to learn how~[/url]\n";
		message += "These are the commands to play in this room:\n";
		message += "[b]!poker_join[/b] Sits you in the table\n"; 
		message += "[b]!poker_leave[/b] Removes you from the table\n";
		message += "[b]!poker_remove[/b] Removes a person from the table (you need to add their name, exaple: !poker_remove Nan Nan Yakamoto)\n";
		message += "[b]!poker_players[/b] Lists the people sitting at the table\n";
		message += "[b]!poker_stop[/b] Ends the game instantly and removes everyone from the table\n";
		message += "[b]!poker_deal[/b] Starts the game by dealing to the players and deals the first three cards, then you can use it again to deal the next card on the table, and if all 5 cards have been dealt, shows people's hands and ends the game\n";
		message += "[b]!mycards[/b] Shows you your cards via private message\n";
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.poker_join = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You can't join in the middle of a game.", channel);
		} else {
			let indice = busca(characters, data.character);
			if (indice < 0) {
				characters.push({nombre : data.character});
				fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + data.character + " has joined.", channel);
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] " + data.character + " has already joined.", channel);
			}
		}
	}
	
	cmdHandler.poker_leave = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You can't leave in the middle of a game, end the game first.", channel);
		} else {
			let indice = busca(characters, data.character);
			if (indice > -1) {
				characters.splice(indice, 1);
				fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + data.character + " has left.", channel);
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] " + data.character + " wasn't in.", channel);
			}
		}
	}
	
	cmdHandler.poker_remove = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You can't remove a player in the middle of a game, end the game first.", channel);
		} else {
			let indice = busca(characters, args);
			if (indice > -1) {
				characters.splice(indice, 1);
				fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + args + " has been removed.", channel);
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] " + args + " wasn't in or wasn't found.", channel);
			}
		}
	}
	
	cmdHandler.poker_players = function (args, data) {
		if (characters.length > 0) {
			let lista = [];
			for (let i = 0; i < characters.length; i++) {
				lista[i] = characters[i].nombre;
			}
			fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + "Current players: "+ lista.join(", "), channel);
		} else {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] " + "There are no players.", channel);
		}
	}
	
	cmdHandler.poker_deal = function (args, data) {
		if (!started) {
			if (characters.length > 1) {
				started = true;
				fase = 1;
				currentDeck = crearDeck();
				let message = "[b][color=green][Game has started!][/color][/b]";
				message += "\nCards on the table:\n";
				mesa = [currentDeck.pop(), currentDeck.pop(), currentDeck.pop()];
				message += mesa.join(" ");
				for (let i = 0; i < characters.length; i++) {
					characters[i].cards = [currentDeck.pop(), currentDeck.pop()];
					fChatLibInstance.sendPrivMessage(characters[i].nombre, "[b][color=cyan][Info][/color][/b] " + "Your cards are: " + characters[i].cards.join(" "));
				}
				fChatLibInstance.sendMessage(message, channel);
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] Not enough players, you need at least 2.", channel);
			}
		} else {
			let message = "\nCards on the table:\n";
			if (fase == 1) {
				mesa.push(currentDeck.pop());
				message += mesa.join(" ");
				fase = 2;
			} else if (fase == 2) {
				mesa.push(currentDeck.pop());
				message += mesa.join(" ");
				fase = 3;
			} else if (fase == 3) {
				message += mesa.join(" ") + "\n";
				message += "Cards on the player's hands:\n";
				for (let i = 0; i < characters.length; i++) {
					message += characters[i].nombre + " has " + characters[i].cards.join(" ") + "\n";
				}
				started = false;
				currentDeck = [];
				fase = 1;
				mesa = [];
				message += "[b][color=green][Game has ended!][/color][/b] Rejoin the table to play again.";
				characters = [];
			}
			fChatLibInstance.sendMessage(message, channel);
		}
	}
	
	cmdHandler.poker_stop = function (args, data) {
		characters = [];
		if (started) {
			started = false;
			currentDeck = [];
			fase = 1;
			mesa = [];
			fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + "Game has ended.", channel);
		} else
		{
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] There is no game goin on.", channel);
		}
	}
	
	cmdHandler.mycards = function (args, data) {
		if (started) {
			let indice = busca(characters, data.character);
			if (indice > -1) {
				fChatLibInstance.sendPrivMessage(data.character, "[b][color=cyan][Info][/color][/b] " + "Your cards are: " + characters[i].cards.join(" "));
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You are not in the game.", channel);
			}
		} else
		{
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] There is no game goin on.", channel);
		}
	}

    return cmdHandler;
};

function busca(lista, nombre) {
    let j = -1;
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].nombre == nombre) {
            j = i;
        }
    }
    return j;
}


// 1♠ ♥ ♣ ♦

function crearDeck() {
	let deck = [];
	let palo = ["♠", "♥", "♣", "♦"];
	let color = ["[color=gray]","[color=red]","[color=green]","[color=cyan]"];
	let indice = 0;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 13; j++) {
			indice = j + 13 * i;
			if (j < 10) {
				deck[indice] = color[i] + (j + 1) + palo[i] + "[/color] ";
			} else {
				if (j == 10) { deck[indice] = color[i] + "J" + palo[i] + "[/color] "; }
				if (j == 11) { deck[indice] = color[i] + "Q" + palo[i] + "[/color] "; }
				if (j == 12) { deck[indice] = color[i] + "K" + palo[i] + "[/color] "; }
			}
		}
	}
	for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}

/* function crearDeck() {
	var deck = [];
	var indice = 0;
	var palo = "";
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 13; j++) {
			indice = j + 13 * i;
			if (i == 0) {palo = "t"; }
			if (i == 1) {palo = "d"; }
			if (i == 2) {palo = "c"; }
			if (i == 3) {palo = "s"; }
			deck[indice] = "[eicon]card" + (j + 1) + palo + "[/eicon]";
		}
	}
	return deck;
} */