var fChatLibInstance;
var channel;
var characters = [];
var currentDeck = [];
var discard = [];
var started = false;
var direction = 1;
var wild = false;
var wildPlayer = "";
var wildColor = "";
var g = "[b][color=green]"; var y = "[b][color=yellow]"; var r = "[b][color=red]"; var p = "[b][color=pink]"; var ec = "[/color][/b]";

var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1", {db: 14});

var rps_betting = {
	entry_fee_set: false,
	entry_fee: 0,
	current_pot: 0,
};

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.uno_join = function (args, data) {
		
		if (started) { fChatLibInstance.sendMessage(r+"Can't join, the game has already started."+ec, channel); return 0; }
		
		let indice = busca(characters, data.character);
		if (indice >= 0) { fChatLibInstance.sendMessage(r+"You already joined the game, can't join twice, sorry."+ec, channel); return 0; }
		
		
		/*	set es para mostrar el mensaje o no de si se estableció una apuesta (primer jugador que entra basicamente)
			entry_fee_set es mas o menos lo mismo pero en global (para que el segundo jugador no pueda poner una apuesta inicial)
		*/
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(r+"You're not on the database yet... speak on the room then try again. Sorry."+ec, channel); return 0; }
			
			
			let set = false;
		
			if (rps_betting.entry_fee_set == false) {
				rps_betting.entry_fee_set = true;
				set = true;
				
				rps_betting.entry_fee = parseInt(args);
			
				if (isNaN(rps_betting.entry_fee) || rps_betting.entry_fee < 1) {
					rps_betting.entry_fee = 0;
					set = false;
				}
			}
			
			
			data1.money = parseInt(data1.money) - rps_betting.entry_fee;
			rps_betting.current_pot += rps_betting.entry_fee;
			client.hmset(data1.name, data1);
			
			if (set) {
				if (rps_betting.entry_fee != 0) {
					fChatLibInstance.sendMessage(g+data1.name+" has paid an entry fee of ¥"+numberFormat(rps_betting.entry_fee)+" to play UNO! Everyone else has to pay this amount if they wanna play too. (just type !uno_join, the amount will be collected automatically)"+ec, channel);
				} else {
					fChatLibInstance.sendMessage(g+data1.name+" has joined the UNO game without any kind of betting involved!"+ec, channel);
				}
			} else {
				let message = "";
				if (rps_betting.entry_fee != 0) { message = " They have paid the entry fee of ¥"+numberFormat(rps_betting.entry_fee)+" to play!"; }
				fChatLibInstance.sendMessage(g+data1.name+" has joined the UNO game!"+message+ec, channel);
			}
			
			let nuevo = {nombre: data.character, cards: []};
			characters.push(nuevo);
		});
		
		
	}
	
	/*
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
	*/
	
	cmdHandler.uno_players = function (args, data) {
		if (characters.length > 0) {
			let lista = [];
			for (let i = 0; i < characters.length; i++) {
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
				characters = revolver(characters);
				currentDeck = revolver(crearDeck());
				let message = "Game has started!";
				message += "\nCard on the table:";
				discard.push(currentDeck.pop());
				while (discard[discard.length-1] == "wild" || discard[discard.length-1] == "+4") {
					discard.push(currentDeck.pop());
				}
				message += discard[0];
				message += "\nIt's "+characters[0].nombre+"'s turn!";
				for (let i = 0; i < characters.length; i++) {
					dealCards(characters[i], 7);
					fChatLibInstance.sendPrivMessage(characters[i].nombre, "Your cards are: " + characters[i].cards.join(" ") + "\nTo play a card, type '!play green 1' or '!play red +2' or '!play yellow reverse' or '!play wild' or '!play +4'");
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
			
			if (args != "meow we have a winner") {
				let fee = rps_betting.entry_fee;
				for (let i = 0; i < characters.length; i++) {
					cmdHandler.pay(fee+" to "+characters[i].nombre, {character: "Bot Announcer", publico: true});
				}
			}
			
			started = false;
			currentDeck = [];
			characters = [];
			discard = [];
			direction = 1;
			wild = false;
			wildPlayer = "";
			wildColor = "";
			
			rps_betting.entry_fee_set = false;
			rps_betting.entry_fee = 0;
			rps_betting.current_pot = 0;
			
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
				if (characters[indice].cards.length == 0) {
					//you win!
					fChatLibInstance.sendMessage(g+characters[indice].nombre+" has won the game! Yay!"+ec, channel);
					cmdHandler.pay(rps_betting.current_pot+" to "+characters[indice].nombre, {character: "Bot Announcer", publico: true});
					cmdHandler.uno_stop("meow we have a winner", {});
					return 0;
				}
				fChatLibInstance.sendPrivMessage(data.character, "Your cards are: " + characters[indice].cards.join(" "));
			} else {
				fChatLibInstance.sendMessage("You are not in the game.", channel);
			}
		} else
		{
			fChatLibInstance.sendMessage("There is no game going on.", channel);
		}
	}
	
	cmdHandler.pay = function (args, data) {		// !pay 123 to Kenia Nya
		if (data.character != "Yuzu Sama" && data.character != "Bot Announcer") { return 0; }
		
		let arr = args.split(' to ');
		let cantidad = parseInt(arr[0]);
		let destiny = removeBBcode(arr[1]);
		if (isNaN(cantidad)) {
			let message = r+"Money amount should be a number (without the ¥ or the .00)"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == undefined) {
			let message = r+"You must specify a recipient. Example: !pay 3 to Kenia Nya"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		
		client.hgetall(destiny, function (err, data2) {
			if (data2 == null) { fChatLibInstance.sendMessage(r+"That person wasn't found, tell them to speak in the room first~"+ec, channel); return 0; }
			data2.money = parseInt(data2.money) + cantidad;
			client.hmset(data2.name, data2);
			fChatLibInstance.sendMessage(g+data.character+" has paid "+data2.name+" the amount of ¥"+numberFormat(cantidad)+"!"+ec, channel);
		});
	}
	
	cmdHandler.play = function (args, data) {
		if (started) {
			let i = busca(characters, data.character);
			if (i == 0) {
				
				if (wild == true) { fChatLibInstance.sendMessage("The current player has to choose a !color", channel); return 0; }
				let playedCard = textToCard(args);
				if (playedCard == "") { fChatLibInstance.sendMessage("Invalid card!\nTo play a card, type 'green 1' or 'red +2' or 'yellow reverse' or 'wild' or '+4'", channel); return 0; }
				if (characters[i].cards.indexOf(playedCard) == -1) { fChatLibInstance.sendMessage("You don't have that card! Use !mycards to see which ones do you have", channel); return 0; }
				
				if (playedCard == "wild" || playedCard == "+4") {
					wild = true;
					wildPlayer = data.character;
					discard.push( characters[i].cards.splice( characters[i].cards.indexOf(playedCard), 1 )[0] ); //descartar
					nextPlayer();
					let extra = "";
					if (playedCard == "+4") { dealCards(characters[0], 4); cmdHandler.mycards("", {character: characters[0].nombre} ); extra += "\nThe next player draws four cards! Ouch!"; }
					fChatLibInstance.sendMessage("Wildcard! Type !color red or any other color to choose"+extra, channel);
					cmdHandler.mycards("", data);
					return 0;
				}
				
				if (validateMove(playedCard, discard[discard.length-1])) {
					discard.push( characters[i].cards.splice( characters[i].cards.indexOf(playedCard), 1 )[0] ); //descartar
					cmdHandler.mycards("", data);
					
					nextPlayer();
					
					let extra = "";
					let type = playedCard.split("]")[1].split("[")[0];
					
					if (type == "reverse") {
						extra += "\nPlay direction changed!";
						direction = (direction == 1 ? 2 : 1);
					}
					if (type == "stop") {
						extra += "\nThe next player skips their turn!";
						nextPlayer();
					}
					if (type == "+2") {
						extra += "\nThe next player draws two cards!";
						dealCards(characters[0], 2);
						cmdHandler.mycards("", {character: characters[0].nombre} );
					}
					
					let lista = [];
					if (characters.length == 0) { fChatLibInstance.sendMessage(data.character+" has played their last card "+playedCard+" and won!", channel); return 0; }
					for (let i = 0; i < characters.length; i++) {
						lista[i] = characters[i].nombre;
					}
					
					fChatLibInstance.sendMessage(data.character+" has played "+playedCard+extra+"\nIt's "+characters[0].nombre+"'s turn!\nPlay order: "+ lista.join(direction == 1 ? " >> " : " << "), channel);
					return 0;
				}
				
				fChatLibInstance.sendMessage("Invalid play!", channel); return 0;
			} else {
				fChatLibInstance.sendMessage("You are not in the game or it's not your turn.", channel);
			}
		} else
		{
			fChatLibInstance.sendMessage("There is no game going on.", channel);
		}
	}
	
	cmdHandler.color = function (args, data) {
		if (!started) { return 0; }
		if (!wild) { return 0; }
		if (wildPlayer != data.character) { return 0; }
		let color = args.toLowerCase();
		let colors = ["red","green","yellow","blue"];
		if (colors.indexOf(color) == -1) { fChatLibInstance.sendMessage("Invalid color, type red, green, blue or yellow", channel); return 0; }
		wildColor = color;
		wildPlayer = "";
		wild = false;
		
		let lista = [];
		for (let i = 0; i < characters.length; i++) {
			lista[i] = characters[i].nombre;
		}
		
		fChatLibInstance.sendMessage("The current color is "+color+"\nIt's "+characters[0].nombre+"'s turn!\nPlay order: "+ lista.join(direction == 1 ? " >> " : " << "), channel);
	}
	
	cmdHandler.draw = function (args, data) {
		if (started) {
			let indice = busca(characters, data.character);
			if (indice > -1) {
				dealCards(characters[indice], 1);
				fChatLibInstance.sendPrivMessage(data.character, "You got a "+characters[indice].cards[characters[indice].cards.length-1]+"\nYour cards are: " + characters[indice].cards.join(" "));
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

function removeBBcode (args) {
	if (args == "" || args === undefined) { return args; }
	let pasa = true; let nuevo = "";
	for (let i = 0; i < args.length; i++) {
		if (args[i] == "[") { pasa = false; continue; }
		if (args[i] == "]") { pasa = true; continue; }
		if (pasa) { nuevo += args[i]; }
	}
	let names = Object.keys(users);
	for (let i = 0; i < names.length; i++) {
		if (names[i].toLowerCase() == nuevo.toLowerCase()) { return names[i]; }
	} return args;
}

function numberFormat (number) {
	if (number < 1000) { return number; }
	let original = number.toString();
    let len = original.length;
    let resultado = "";
    for (let i = len-1; i > -1; i--) {
		if ((len-i-1) % 3 == 0 && i != len-1) {
        	resultado = "," + resultado;
        }
        resultado = original[i] + resultado;
		
	}
	
	return resultado;
	
	
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

function validateMove(card1, card2) {
	console.log(card1);
	console.log(card2);
	let cardColor1 = card1.split("]")[0].split("=")[1];
	let cardValue1 = card1.split("]")[1].split("[")[0];
	
	if (cardColor1 == wildColor && wildColor != "") { wildColor = ""; return true; }
	
	let cardColor2 = card2.split("]")[0].split("=")[1];
	let cardValue2 = card2.split("]")[1].split("[")[0];
	
	if (cardColor1 == cardColor2 || cardValue1 == cardValue2) { return true; }
	return false;
}

function textToCard (text) {
	text = text.toLowerCase();
	if (text == "wild" || text == "+4") { return text; }
	
	let colors = ["red","green","yellow","blue"];
	let values = ["1","2","3","4","5","6","7","8","9","reverse","stop","+2"];
	
	let temp = text.split(" ");
	if (temp.length != 2) { return ""; }
	
	let textColor = temp[0];
	if (colors.indexOf(textColor) == -1) { return ""; }
	
	let textValue = temp[1];
	if (values.indexOf(textValue) == -1) { return ""; }
	
	return "[color="+textColor+"]"+textValue+"[/color]";
}

function crearDeck() {
	let deck = [];
	let color = ["[color=red]","[color=green]","[color=yellow]","[color=blue]"];
	let special = ["reverse","stop","+2"];
	let extra = ["wild","+4"];
	let e = "[/color]";
	for (let i = 0; i < 4; i++) {
		for (let j = 1; j <= 9; j++) {
			deck.push(color[i] + j + e);
			deck.push(color[i] + j + e);
		}
		for (let j = 0; j < 3; j++) {
			deck.push(color[i] + special[j] + e);
			deck.push(color[i] + special[j] + e);
		}
	}
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 4; j++) {
			deck.push(extra[i]);
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

function numberFormat (number) {
	if (number < 1000) { return number; }
	let original = number.toString();
    let len = original.length;
    let resultado = "";
    for (let i = len-1; i > -1; i--) {
		if ((len-i-1) % 3 == 0 && i != len-1) {
        	resultado = "," + resultado;
        }
        resultado = original[i] + resultado;
		
	}
	
	return resultado;
	
	
}