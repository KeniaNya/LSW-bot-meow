var fChatLibInstance;
var channel;
var characters = [];
var currentDeck = [];
var started = false;
var fase = 1;
var dealer = [];

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.bj_help = function(args, data) {
		let message = "[b][color=purple][Blackjack-bot help!][/color][/b]\n";
		message += "If you don't know how to play bj, you can [url=http://www.google.com]click here to learn how~[/url]\n";
		message += "These are the commands to play in this room:\n";
		message += "[b]!bj_join[/b] Sits you in the table\n"; 
		message += "[b]!bj_leave[/b] Removes you from the table\n";
		message += "[b]!bj_remove[/b] Removes a person from the table (you need to add their name, exaple: !bj_remove Nan Nan Yakamoto)\n";
		message += "[b]!bj_players[/b] Lists the people sitting at the table\n";
		message += "[b]!bj_stop[/b] Ends the game instantly and removes everyone from the table\n";
		message += "[b]!bj_deal[/b] Starts the game by dealing cards to the players and dealer\n";
		message += "[b]!bj_status[/b] Shows the dealer's and the players' cards\n";
		message += "[b]!bj_hit[/b] Deals another card to the player, if they pass 21, they lose\n";
		message += "[b]!bj_stay[/b] Stops dealing cards to the player, when every player has either stayed or exceeded 21, the dealer deals it's cards\n";
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.bj_join = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You can't join in the middle of a game.", channel);
		} else {
			let indice = busca(characters, data.character);
			if (indice < 0) {
				characters.push({nombre: data.character, alive: true, finished: false});
				fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + data.character + " has joined.", channel);
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] " + data.character + " has already joined.", channel);
			}
		}
	}
	
	cmdHandler.bj_leave = function (args, data) {
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
	
	cmdHandler.bj_remove = function (args, data) {
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
	
	cmdHandler.bj_players = function (args, data) {
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
	
	cmdHandler.bj_deal = function (args, data) {
		if (!started) {
			if (characters.length > 0) {
				started = true;
				fase = 1;
				currentDeck = crearDeck();
				let message = "[b][color=green][Game has started!][/color][/b]";
				message += "\nDealer's hand:\n";
				dealer = [currentDeck.pop(), currentDeck.pop()];
				message += "[color=red]▓▓[/color] " + dealer[1].text;
				message += "\nCards on the player's hands:\n";
				for (let i = 0; i < characters.length; i++) {
					characters[i].cards = [currentDeck.pop(), currentDeck.pop()];
					characters[i].suma = sumaCartas(characters[i].cards);
					let manotemp = "";
					for (let j = 0; j < characters[i].cards.length; j++) {
						manotemp += characters[i].cards[j].text + " ";
					}
					message += characters[i].nombre + " has " + manotemp + " (" + characters[i].suma + ")\n";
				}
				fChatLibInstance.sendMessage(message, channel);
			} else {
				fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] Not enough players, you need at least 1.", channel);
			}
		} else {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] Cards have already been dealt.", channel);
		}
	}
	
	cmdHandler.bj_status = function (args, data) {
		if (started) {
			let message = "\nDealer's hand:\n";
			message += "[color=red]▓▓[/color] " + dealer[1].text;
			message += "\nCards on the player's hands:\n";
			for (let i = 0; i < characters.length; i++) {
				let manotemp = "";
				for (let j = 0; j < characters[i].cards.length; j++) {
					manotemp += characters[i].cards[j].text + " ";
				}
				message += characters[i].nombre + " has " + manotemp + " (" + characters[i].suma + ")\n";
			}
			fChatLibInstance.sendMessage(message, channel);
		} else {
			fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] There's no game going on.", channel);
		}
	}
	
	cmdHandler.bj_hit = function(args, data) {
		if (!started) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] There is no game goin on.", channel); return 0; }
		let i = busca(characters, data.character);
		if (i == -1) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You are not playing.", channel); return 0; }
		if (characters[i].alive == false) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You went over 21 and lost, sorry.", channel); return 0; }
		if (characters[i].finished == true) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You stayed already, you can't ask for more cards.", channel); return 0; }
		
		characters[i].cards.push(currentDeck.pop());
		characters[i].suma = sumaCartas(characters[i].cards);
		let manotemp = "";
		for (let j = 0; j < characters[i].cards.length; j++) {
			manotemp += characters[i].cards[j].text + " ";
		}
		message = characters[i].nombre + " has " + manotemp + " (" + characters[i].suma + ")";
		
		if (characters[i].suma == "Over 21") {
			characters[i].alive = false; characters[i].finished = true;
			message += "\n[b][color=red][Hey!][/color][/b] You went over 21 and lost, sorry.";
		}
		fChatLibInstance.sendMessage(message, channel);
		//comprobar si todos los players ya terminaron
		cmdHandler.ending(args, data);
	}
	
	cmdHandler.bj_stay = function (args, data) {
		if (!started) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] There is no game goin on.", channel); return 0; }
		let i = busca(characters, data.character);
		if (i == -1) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You are not playing.", channel); return 0; }
		if (characters[i].alive == false) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You went over 21 and lost, sorry.", channel); return 0; }
		if (characters[i].finished == true) { fChatLibInstance.sendMessage("[b][color=red][Hey!][/color][/b] You stayed already.", channel); return 0; }
		
		characters[i].finished = true;
		fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] "+data.character+" has decided to stay.", channel);
		//comprobar si todos los players ya terminaron
		cmdHandler.ending(args, data);
	}
	
	cmdHandler.ending = function(args, data) {
		if (!started) { return 0; }
		let finished = true;
		let alive = false;
		for (let i = 0; i < characters.length; i++) {
			if (characters[i].finished == false) { finished = false; }
			if (characters[i].alive == true) { alive = true; }
		}
		if (finished == false) { return 0; }
		if (alive == false) {
			//todos estan muertos
			fChatLibInstance.sendMessage("[b][color=green][Game has ended!][/color][/b] Everyone lost, rejoin the table to play again.", channel);
			started = false;
			currentDeck = [];
			fase = 1;
			dealer = [];
			characters = [];
			return 0;
		}
		//comenzar a repartir cartas
		let mejorPlayerSuma = 0;
		let mejorPlayerName = "Nobody";
		let manotemp = "";
		for (let i = 0; i < characters.length; i++) {
			let sumatemp = sumaCartas(characters[i].cards);
			if (sumatemp != "Over 21" && sumatemp > mejorPlayerSuma) {
				mejorPlayerSuma = sumatemp;
				mejorPlayerName = characters[i].nombre;
				for (let j = 0; j < characters[i].cards.length; j++) {
					manotemp += characters[i].cards[j].text + " ";
				}
			}
		}
		fChatLibInstance.sendMessage("Best player: "+mejorPlayerName+" with "+ manotemp +" ("+mejorPlayerSuma+")", channel);
		
		let sumadealer = sumaCartas(dealer);
		if (sumadealer >= mejorPlayerSuma) {
			//mostrar las cartas del dealer y finalizar el juego
			manotemp = "";
			for (let j = 0; j < dealer.length; j++) {
				manotemp += dealer[j].text + " ";
			}
			let message = "The dealer has " + manotemp + " (" + sumadealer + ")\n";
			message += "[b][color=green][Game has ended!][/color][/b] Everyone lost, rejoin the table to play again.";
			fChatLibInstance.sendMessage(message, channel);
			started = false;
			currentDeck = [];
			fase = 1;
			dealer = [];
			characters = [];
			return 0;
		}
		while (sumadealer < mejorPlayerSuma && sumadealer != "Over 21" && sumadealer != 21) {
			dealer.push(currentDeck.pop());
			sumadealer = sumaCartas(dealer);
		}
		
		manotemp = "";
		for (let j = 0; j < dealer.length; j++) {
			manotemp += dealer[j].text + " ";
		}
		let message = "The dealer has " + manotemp + " (" + sumadealer + ")\n";
		message += "[b][color=green][Game has ended!][/color][/b] Rejoin the table to play again.";
		fChatLibInstance.sendMessage(message, channel);
		started = false;
		currentDeck = [];
		fase = 1;
		dealer = [];
		characters = [];
	}
	
	
	//message += "[b][color=green][Game has ended!][/color][/b] Rejoin the table to play again.";
	
	
	cmdHandler.bj_stop = function (args, data) {
		characters = [];
		if (started) {
			started = false;
			currentDeck = [];
			fase = 1;
			dealer = [];
			fChatLibInstance.sendMessage("[b][color=cyan][Info][/color][/b] " + "Game has ended.", channel);
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
			let carta = {};
			if (j < 10) {
				carta.text = color[i] + ((j + 1) == 1 ? "A" : (j+1)) + palo[i] + "[/color] ";
				carta.v1 = j + 1;
				if (j == 0) { carta.v2 = 11; } else { carta.v2 = j + 1; }
			} else {
				if (j == 10) { carta.text = color[i] + "J" + palo[i] + "[/color] "; }
				if (j == 11) { carta.text = color[i] + "Q" + palo[i] + "[/color] "; }
				if (j == 12) { carta.text = color[i] + "K" + palo[i] + "[/color] "; }
				carta.v1 = 10; carta.v2 = 10;
			}
			deck[indice] = carta;
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

function sumaCartas2(mano) {
	let suma1 = 0;
	let suma2 = 0;
	for (let i = 0; i < mano.length; i++) {
		suma1 += mano[i].v1;
		suma2 += mano[i].v2;
	}
	if (suma1 > 21) {
		if (suma2 > 21) { return "Over 21"; } else { return suma2; }
	} else {
		return suma1;
	}
}

function sumaCartas(mano) {
	iter = 0;
	while (iter < mano.length) {
		suma = 0;
		for (let i = 0; i < iter; i++) {
			suma += mano[i].v1;
		}
		for (let i = iter; i < mano.length; i++) {
			suma += mano[i].v2;
		}
		if (suma <= 21) { return suma; }
		iter++;
	}
	return "Over 21";
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