var fChatLibInstance;
var channel;
var characters = [];
var currentDeck = [];
var discard = [];
var started = false;
var direction = 1;
var currentColor = "";
var currentValue = 0;
var wild = false;
var wildPlayer = "";
var wildColor = "";

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.uno_join = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("You can't join in the middle of a game.", channel);
		} else {
			let indice = busca(characters, data.character);
			if (indice < 0) {
				let nuevo = {nombre: data.character, cards: []};
				characters.push(nuevo);
				fChatLibInstance.sendMessage(data.character + " has joined.", channel);
			} else {
				fChatLibInstance.sendMessage(data.character + " has already joined.", channel);
			}
		}
	}
	
	cmdHandler.uno_leave = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("You can't leave in the middle of a game, end the game first.", channel);
		} else {
			let indice = busca(characters, data.character);
			if (indice > -1) {
				characters.splice(indice, 1);
				fChatLibInstance.sendMessage(data.character + " has left.", channel);
			} else {
				fChatLibInstance.sendMessage(data.character + " wasn't in.", channel);
			}
		}
	}
	
	cmdHandler.uno_remove = function (args, data) {
		if (started) {
			fChatLibInstance.sendMessage("You can't remove a player in the middle of a game, end the game first.", channel);
		} else {
			let indice = busca(characters, args);
			if (indice > -1) {
				characters.splice(indice, 1);
				fChatLibInstance.sendMessage(args + " has been removed.", channel);
			} else {
				fChatLibInstance.sendMessage(args + " wasn't in or wasn't found.", channel);
			}
		}
	}
	
	cmdHandler.uno_players = function (args, data) {
		if (characters.length > 0) {
			let lista = [];
			for (let i = 0; i < characters.length; i++) {
				lista[i] = characters[i].nombre+"("+characters[i].cards.length+")";
			}
			fChatLibInstance.sendMessage("Play order: "+ lista.join(direction == 1 ? " >> " : " << "), channel);
		} else {
			fChatLibInstance.sendMessage("There are no players.", channel);
		}
	}
	
	cmdHandler.deal = function (args, data) {
		if (!started) {
			if (characters.length > 1) {
				started = true;
				characters = revolver(characters);
				currentDeck = revolver(crearDeck());
				let message = "Game has started!";
				message += "\nCard on the table:";
				discard.push(currentDeck.pop());
				while (discard[discard.length-1].value == "wild" || discard[discard.length-1].value == "+4") {
					discard.push(currentDeck.pop());
				}
				message += cardToText(discard[discard.length-1]);
				
				currentColor = discard[discard.length-1].color;
				currentValue = discard[discard.length-1].value;
				
				message += "\nIt's "+characters[0].nombre+"'s turn!";
				
				let lista = [];
				for (let i = 0; i < characters.length; i++) {
					lista[i] = characters[i].nombre+"("+characters[i].cards.length+")";
				}
				
				message += "\nPlay order: "+ lista.join(direction == 1 ? " >> " : " << ");
				for (let i = 0; i < characters.length; i++) {
					dealCards(characters[i], 7);
					fChatLibInstance.sendPrivMessage(characters[i].nombre, "Your cards are: " + cardsToText(characters[i].cards) + "\nTo play a card, type '!play green 1' or '!play red +2' or '!play yellow reverse' or '!play wild' or '!play +4'");
				}
				fChatLibInstance.sendMessage(message, channel);
			} else {
				fChatLibInstance.sendMessage("Not enough players.", channel);
			}
		} else {
			fChatLibInstance.sendMessage("Game already started", channel);
		}
	}
	
	cmdHandler.uno_stop = function (args, data) {
		if (started) {
			started = false;
			currentDeck = [];
			characters = [];
			discard = [];
			direction = 1;
			currentColor = "";
			currentValue = 0;
			wild = false;
			wildPlayer = "";
			wildColor = "";
			fChatLibInstance.sendMessage("Game has ended.", channel);
		} else
		{
			fChatLibInstance.sendMessage("There is no game going on.", channel);
		}
	}
	
	cmdHandler.mycards = function (args, data) {
		if (started) {
			let indice = busca(characters, data.character);
			if (indice > -1) {
				fChatLibInstance.sendPrivMessage(data.character, "Your cards are: " + cardsToText(characters[indice].cards));
			} else {
				fChatLibInstance.sendMessage("You are not in the game.", channel);
			}
		} else
		{
			fChatLibInstance.sendMessage("There is no game going on.", channel);
		}
	}
	
	cmdHandler.play = function (args, data) {
		args = args.toLowerCase();
		if (!started) { return 0; }
		let i = busca(characters, data.character);
		if (i != 0) { fChatLibInstance.sendMessage("It's not your turn", channel); return 0; }
		
		if (wild == true) { fChatLibInstance.sendMessage("The current player has to choose a !color", channel); return 0; }
		
		if (args == "wild" || args === "+4") {
			let playedCard = searchCard(args, characters[i]);
			if (playedCard == -1) { fChatLibInstance.sendMessage("You don't have that card! Use !mycards to see which ones do you have", channel); return 0; }
			wild = true;
			wildPlayer = data.character;
			discard.push( characters[i].cards.splice( characters[i].cards.indexOf(playedCard), 1 ) ); //descartar
			nextPlayer();
			let extra = "";
			if (args == "+4") {
				dealCards(characters[0], 4);
				cmdHandler.mycards("", {character: characters[0].nombre} );
				extra += "\nThe next player draws four cards! Ouch!";
			}
			fChatLibInstance.sendMessage("Wildcard! Type !color red or any other color to choose"+extra, channel);
			return 0;
		}
		
		let temp = args.split(" ");
		if (temp.length != 2) { fChatLibInstance.sendMessage("Invalid card!\nTo play a card, type 'green 1' or 'red +2' or 'yellow reverse' or 'wild' or '+4'", channel); return 0; }
		
		let playedCard = searchCard(temp, characters[i]);
		if (playedCard == -1) { fChatLibInstance.sendMessage("You don't have that card! Use !mycards to see which ones do you have", channel); return 0; }
		
		if (!validateMove(playedCard)) { fChatLibInstance.sendMessage("Invalid play!", channel); return 0; }
		
		discard.push( characters[i].cards.splice( characters[i].cards.indexOf(playedCard), 1 )[0] ); //descartar
		
		if (characters[i].cards.length == 0) { fChatLibInstance.sendMessage("You win!", channel); cmdHandler.uno_stop(); return 0; }
		
		cmdHandler.mycards("", data);
		currentColor = playedCard.color;
		currentValue = playedCard.value;
		let extra = "";
		if (playedCard.value == "reverse") {
			extra += "\nPlay direction changed!";
			direction = (direction == 1 ? 2 : 1);
		}
		if (playedCard.value == "stop") {
			extra += "\nThe next player skips their turn!";
			nextPlayer();
		}
		nextPlayer();
		if (playedCard.value === "+2") {
			extra += "\nThe next player draws two cards!";
			dealCards(characters[0], 2);
			cmdHandler.mycards("", {character: characters[0].nombre} );
		}
		
		let lista = [];
		for (let i = 0; i < characters.length; i++) {
			lista[i] = characters[i].nombre+"("+characters[i].cards.length+")";
		}
		
		fChatLibInstance.sendMessage(data.character+" has played "+cardToText(playedCard)+extra+"\nIt's "+characters[0].nombre+"'s turn!\nPlay order: "+ lista.join(direction == 1 ? " >> " : " << "), channel);
	}
	
	cmdHandler.color = function (args, data) {
		if (!started) { return 0; }
		if (!wild) { return 0; }
		if (wildPlayer != data.character) { return 0; }
		let color = args.toLowerCase();
		let colors = ["red","green","yellow","blue"];
		if (colors.indexOf(color) == -1) { fChatLibInstance.sendMessage("Invalid color, type red, green, blue or yellow", channel); return 0; }
		currentColor = color;
		wildPlayer = "";
		wild = false;
		
		let lista = [];
		for (let i = 0; i < characters.length; i++) {
			lista[i] = characters[i].nombre+"("+characters[i].cards.length+")";
		}
		
		fChatLibInstance.sendMessage("The current color is "+color+"\nIt's "+characters[0].nombre+"'s turn!\nPlay order: "+ lista.join(direction == 1 ? " >> " : " << "), channel);
	}
	
	cmdHandler.draw = function (args, data) {
		if (started) {
			let indice = busca(characters, data.character);
			if (indice > -1) {
				dealCards(characters[indice], 1);
				fChatLibInstance.sendPrivMessage(data.character, "You got a "+cardToText(characters[indice].cards[characters[indice].cards.length-1])+"\nYour cards are: " + cardsToText(characters[indice].cards));
			} else {
				fChatLibInstance.sendMessage("You are not in the game.", channel);
			}
		} else
		{
			fChatLibInstance.sendMessage("There is no game going on.", channel);
		}
	}

    return cmdHandler;
};

function cardsToText(cards) {
	let message = "";
	for (card in cards) {
		message += cardToText(cards[card]) + " ";
	}
	return message;
}

function nextPlayer() {
	if (direction == 1) {
		let temp = characters.shift();
		characters.push(temp);
	}
	if (direction == 2) {
		let temp = characters.pop();
		characters.unshift(temp);
	}
}

function busca(lista, nombre) {
    let j = -1;
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].nombre == nombre) {
            j = i;
        }
    }
    return j;
}

function revolver(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function validateMove(card) {
	console.log("current color: "+currentColor);
	console.log("current value: "+currentValue);
	console.log(JSON.stringify(card));
	if (wild || card.color == currentColor || card.value == currentValue) { wild = false; return true; }
	return false;
}

function searchCard(text, player) {
	let color = "";
	let value = "";
	
	if (text == "wild" || text === "+4") {
		value = text;
		color = "white";
	} else {
		color = text[0];
		value = text[1];
	}
	for (card in player.cards) {
		if (player.cards[card].color == color && player.cards[card].value == value) {
			return player.cards[card];
		}
	}
	return -1;
}

function cardToText(card) {
	return "[color="+card.color+"]"+card.value+"[/color]";
}

function crearDeck() {
	let deck = [];
	let color = ["red","green","yellow","blue"];
	let special = ["reverse","stop","+2"];
	let extra = ["wild","+4"];
	
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j <= 9; j++) {
			deck.push({color: color[i], value: j});
			deck.push({color: color[i], value: j});
			deck.push({color: color[i], value: j});
			deck.push({color: color[i], value: j});
		}
		for (let j = 0; j < 3; j++) {
			deck.push({color: color[i], value: special[j]});
			deck.push({color: color[i], value: special[j]});
			deck.push({color: color[i], value: special[j]});
		}
	}
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 4; j++) {
			deck.push({color: "white", value: extra[i]});
			deck.push({color: "white", value: extra[i]});
		}
	}
	return deck;
}

function dealCards(player, number) {
	for (let i = 0; i < number; i++) {
		if (currentDeck.length == 0) { currentDeck = recolver(discard); }
		player.cards.push(currentDeck.pop());
	}
}