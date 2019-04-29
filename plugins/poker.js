var fChatLibInstance;
var channel;
var characters = [];
var currentDeck = [];
var started = false;
var fase = 1;
var mesa = 0;

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.poker_join = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("You can't join in the middle of a game.", channel);
		} else {
			var indice = busca(characters, data.character);
			if (indice < 0) {
				var nuevo = {nombre : data.character}
				characters.push(nuevo);
				fChatLibInstance.sendMessage(data.character + " has joined.", channel);
			} else {
				fChatLibInstance.sendMessage(data.character + " has already joined.", channel);
			}
		}
	}
	
	cmdHandler.poker_leave = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("You can't leave in the middle of a game, end the game first.", channel);
		} else {
			var indice = busca(characters, data.character);
			if (indice > -1) {
				characters.splice(indice, 1);
				fChatLibInstance.sendMessage(data.character + " has left.", channel);
			} else {
				fChatLibInstance.sendMessage(data.character + " wasn't in.", channel);
			}
		}
	}
	
	cmdHandler.poker_remove = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("You can't remove a player in the middle of a game, end the game first.", channel);
		} else {
			var indice = busca(characters, args);
			if (indice > -1) {
				characters.splice(indice, 1);
				fChatLibInstance.sendMessage(args + " has been removed.", channel);
			} else {
				fChatLibInstance.sendMessage(args + " wasn't in or wasn't found.", channel);
			}
		}
	}
	
	cmdHandler.poker_players = function (args, data) {
		if (characters.length > 0) {
			var lista = [];
			for (var i = 0; i < characters.length; i++) {
				lista[i] = characters[i].nombre;
			}
			fChatLibInstance.sendMessage("Current players: "+ lista.toString(), channel);
		} else {
			fChatLibInstance.sendMessage("There are no players.", channel);
		}
	}
	
	cmdHandler.deal = function (args, data) {
		if (!started) {
			if (characters.length > 1) {
				started = true;
				fase = 1;
				var deck = crearDeck();
				mesa = characters.length * 2;
				deck = revolver(deck);
				currentDeck = deck;
				var message = "Game has started!\n";
				message += "Cards on the table:\n";
				message += currentDeck[mesa] +  currentDeck[mesa + 1] + currentDeck[mesa + 2];
				for (var i = 0; i < characters.length; i++) {
					fChatLibInstance.sendPrivMessage(characters[i].nombre, "Your cards are: " + currentDeck[i*2] + currentDeck[i*2+1]);
				}
				fChatLibInstance.sendMessage(message, channel);
			} else {
				fChatLibInstance.sendMessage("Not enough players.", channel);
			}
		} else {
			var message = "Cards on the table:\n";
			if (fase == 1) {
				message += currentDeck[mesa] +  currentDeck[mesa + 1] + currentDeck[mesa + 2] + currentDeck[mesa + 3];
				fase = 2;
			} else if (fase == 2) {
				message += currentDeck[mesa] +  currentDeck[mesa + 1] + currentDeck[mesa + 2] + currentDeck[mesa + 3] + currentDeck[mesa + 4];
				fase = 3;
			} else if (fase == 3) {
				message += currentDeck[mesa] +  currentDeck[mesa + 1] + currentDeck[mesa + 2] + currentDeck[mesa + 3] + currentDeck[mesa + 4] + "\n";
				message += "Cards on the player's hands:\n";
				for (var i = 0; i < characters.length; i++) {
					message += characters[i].nombre + " has " + currentDeck[i*2] + currentDeck[i*2+1] + "\n";
				}
				started = false;
				currentDeck = [];
				fase = 1;
				mesa = 0;
				message += "Game has ended, join the table again to keep playing.";
				characters = [];
			}
			fChatLibInstance.sendMessage(message, channel);
		}
	}
	
	cmdHandler.poker_stop = function (args, data) {
		if (started) {
			started = false;
			currentDeck = [];
			fase = 1;
			mesa = 0;
			characters = [];
			fChatLibInstance.sendMessage("Game has ended.", channel);
		} else
		{
			fChatLibInstance.sendMessage("There is no game goin on.", channel);
		}
	}
	
	cmdHandler.mycards = function (args, data) {
		if (started) {
			var indice = busca(characters, data.character);
			if (indice > -1) {
				fChatLibInstance.sendPrivMessage(data.character, "Your cards are: " + currentDeck[indice*2] + currentDeck[indice*2+1]);
			} else {
				fChatLibInstance.sendMessage("You are not in the game.", channel);
			}
		} else
		{
			fChatLibInstance.sendMessage("There is no game goin on.", channel);
		}
	}

    return cmdHandler;
};

function busca(lista, nombre) {
    var j = -1;
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].nombre == nombre) {
            j = i;
        }
    }
    return j;
}

function revolver(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// 1♠ ♥ ♣ ♦

function crearDeck() {
	var deck = [];
	var palo = ["♠", "♥", "♣", "♦"];
	var color = ["[color=gray]","[color=red]","[color=green]","[color=cyan]"];
	var indice = 0;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 13; j++) {
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