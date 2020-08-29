var fChatLibInstance;
var channel;
var players = [];
var g = "[b][color=green]"; var y = "[b][color=yellow]"; var r = "[b][color=red]"; var p = "[b][color=pink]"; var ec = "[/color][/b]";

var rpsPlayers = [];
var cardsPlayed = 0;
var rounds = 0;

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
	
	fChatLibInstance.addPrivateMessageListener(function(parent, data) {
		if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
			var opts = {
				command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
				argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
			};
			
			if (opts.command == "rock" || opts.command == "paper" || opts.command == "scissors") {
			
				if (typeof cmdHandler[opts.command] === 'function') {
					cmdHandler[opts.command](opts.argument, data);
				} else {
					//meow
				}
				
			}
		}
	});
	
	
	
	cmdHandler.rps_join = function (args, data) {
		
		if (rpsPlayers.length > 1) { fChatLibInstance.sendMessage(r+"Can't join"+ec, channel); return 0; }
		if (rpsPlayers.length == 1) {
			if (rpsPlayers[0].name == data.character) { fChatLibInstance.sendMessage(r+"You already joined the game, can't join twice, sorry."+ec, channel); return 0; }
		}
		
		
		/*	set es para mostrar el mensaje o no de si se estableció una apuesta (primer jugador que entra basicamente)
			entry_fee_set es mas o menos lo mismo pero en global (para que el segundo jugador no pueda poner una apuesta inicial)
		*/
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) {
				fChatLibInstance.sendMessage(r+"You're not on the database yet... speak on the room then try again. Sorry."+ec, channel);
				return 0;
			}
			
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
					fChatLibInstance.sendMessage(g+data1.name+" has paid an entry fee of ¥"+numberFormat(rps_betting.entry_fee)+" to play rps! Everyone else has to pay this amount if they wanna play too. (just type !rps_join, the amount will be collected automatically)"+ec, channel);
				} else {
					fChatLibInstance.sendMessage(g+data1.name+" has joined the rps game without any kind of betting involved!"+ec, channel);
				}
			} else {
				let message = "";
				if (rps_betting.entry_fee != 0) { message = " They have paid the entry fee of ¥"+numberFormat(rps_betting.entry_fee)+" to play!"; }
				fChatLibInstance.sendMessage(g+data1.name+" has joined the rps game!"+message+ec, channel);
			}
			
			let nuevo = {name: data.character, rock: 3, paper: 3, scissors: 3, wins: 0, placedCard: "none"};
			rpsPlayers.push(nuevo);
			//fChatLibInstance.sendMessage("Joined!", channel);
			if (rpsPlayers.length == 2) {
				fChatLibInstance.sendMessage("Game start! Send via private message your selection: !rock, !paper or !scissors", channel);
				cmdHandler.myCards("", {character: rpsPlayers[0].name});
				cmdHandler.myCards("", {character: rpsPlayers[1].name});
			}
			
			
		});
		
	}
	
	function gameStarted(data) {
		if (rpsPlayers.length == 2) {
			let number = -1;
			if (rpsPlayers[0].name == data.character) { number = 0; }
			if (rpsPlayers[1].name == data.character) { number = 1; }
			return number;
		}
		return -1;
	}
	
	cmdHandler.myCards = function (args, data) {
		let number = gameStarted(data); if (number == -1) { return 0; }
		fChatLibInstance.sendPrivMessage(data.character, "You have "+rpsPlayers[number].rock+" rock(s), "+rpsPlayers[number].paper+" paper(s) and "+rpsPlayers[number].scissors+" scissors.");
	}
	
	cmdHandler.rock = function (args, data) { placeCard("rock", data); console.log("rock"); }
	cmdHandler.paper = function (args, data) { placeCard("paper", data); console.log("paper"); }
	cmdHandler.scissors = function (args, data) { placeCard("scissors", data); console.log("scissors"); }
		
	
	function placeCard(type, data) {
		let number = gameStarted(data); if (number == -1) { return 0; }
		if (rpsPlayers[number][type] == 0) { fChatLibInstance.sendPrivMessage(data.character, "You don't have that type of card anymore"); return 0; }
		if (rpsPlayers[number].placedCard != "none") { fChatLibInstance.sendPrivMessage(data.character, "You have played a card already"); return 0; }
		rpsPlayers[number][type] -= 1;
		rpsPlayers[number].placedCard = type;
		cardsPlayed += 1;
		if (cardsPlayed < 2) { fChatLibInstance.sendMessage(data.character + " has selected their card already...", channel); return 0; }
		rounds += 1;
		let winner = checkWinner();
		if (winner == -1) {
			fChatLibInstance.sendMessage("Both players have selected "+type+"! We have a tie! Score: "+rpsPlayers[0].name+": "+rpsPlayers[0].wins+" points, "+rpsPlayers[1].name+": "+rpsPlayers[1].wins+" points.", channel);
			cardsPlayed = 0;
			rpsPlayers[0].placedCard = "none";
			rpsPlayers[1].placedCard = "none";
			if (rounds == 9) {
				fChatLibInstance.sendMessage("The game ended in a tie from both parts!", channel);
				cmdHandler.pay(rps_betting.entry_fee+" to "+rpsPlayers[0].name, {character: "Bot Announcer", publico: true});
				cmdHandler.pay(rps_betting.entry_fee+" to "+rpsPlayers[1].name, {character: "Bot Announcer", publico: true});
				cmdHandler.rps_end("", {});
				return 0;
			}
			cmdHandler.myCards("", {character: rpsPlayers[0].name});
			cmdHandler.myCards("", {character: rpsPlayers[1].name});
			return 0;
		}
		let loser = -1;
		if (winner == 1) { loser = 0; } else { loser = 1; }
		
		rpsPlayers[winner].wins += 1;
		
		fChatLibInstance.sendMessage(rpsPlayers[winner].name+" has played a "+rpsPlayers[winner].placedCard+", beating "+rpsPlayers[loser].name+", who played a "+rpsPlayers[loser].placedCard+". Score: "+rpsPlayers[0].name+": "+rpsPlayers[0].wins+" points, "+rpsPlayers[1].name+": "+rpsPlayers[1].wins+" points.", channel);
		
		cardsPlayed = 0;
		rpsPlayers[0].placedCard = "none";
		rpsPlayers[1].placedCard = "none";
		
		if (rpsPlayers[0].wins == 5) {
			fChatLibInstance.sendMessage(rpsPlayers[0].name+" has won the game!", channel);
			cmdHandler.pay(rps_betting.current_pot+" to "+rpsPlayers[0].name, {character: "Bot Announcer", publico: true});
			cmdHandler.rps_end();
			return 0;
		}
		if (rpsPlayers[1].wins == 5) {
			fChatLibInstance.sendMessage(rpsPlayers[1].name+" has won the game!", channel);
			cmdHandler.pay(rps_betting.current_pot+" to "+rpsPlayers[1].name, {character: "Bot Announcer", publico: true});
			cmdHandler.rps_end();
			return 0;
		}
		
		cmdHandler.myCards("", {character: rpsPlayers[0].name});
		cmdHandler.myCards("", {character: rpsPlayers[1].name});
	}
	
	
	
	function checkWinner() {
		if (rpsPlayers[0].placedCard == "rock") {
			if (rpsPlayers[1].placedCard == "rock") { return -1; }
			if (rpsPlayers[1].placedCard == "paper") { return 1; }
			if (rpsPlayers[1].placedCard == "scissors") { return 0; }
		}
		if (rpsPlayers[0].placedCard == "paper") {
			if (rpsPlayers[1].placedCard == "rock") { return 0; }
			if (rpsPlayers[1].placedCard == "paper") { return -1; }
			if (rpsPlayers[1].placedCard == "scissors") { return 1; }
		}
		if (rpsPlayers[0].placedCard == "scissors") {
			if (rpsPlayers[1].placedCard == "rock") { return 1; }
			if (rpsPlayers[1].placedCard == "paper") { return 0; }
			if (rpsPlayers[1].placedCard == "scissors") { return -1; }
		}
	}
	
	cmdHandler.rps_end = function (args, data) {
		cardsPlayed = 0;
		rpsPlayers = [];
		rounds = 0;
		rps_betting.entry_fee_set = false;
		rps_betting.entry_fee = 0;
		rps_betting.current_pot = 0;
	}		
	
	cmdHandler.sendmoney = function (args, data) {
		//if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es mod
		
		let arr = args.split(' to ');
		let cantidad = parseInt(arr[0]);
		let destiny = removeBBcode(arr[1]);
		if (isNaN(cantidad) || cantidad < 1) {
			let message = r+"Money amount should be a positive number (without the ¥ or the .00)"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == undefined) {
			let message = r+"You must specify a recipient. Example: !awardmoney 3 to Kenia Nya"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == data.character) {
			let message = r+"You can't send money to yourself!"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(r+"You don't have any money to give!"+ec, channel); return 0; }
			if (data1.money < cantidad) { fChatLibInstance.sendMessage(r+"You don't have enough money to give!"+ec, channel); return 0; }
			client.hgetall(destiny, function (err, data2) {
				if (data2 == null) { fChatLibInstance.sendMessage(r+"That person wasn't found, tell them to speak in the room first~"+ec, channel); return 0; }
				data1.money = parseInt(data1.money) - cantidad;
				data2.money = parseInt(data2.money) + cantidad;
				client.hmset(data1.name, data1);
				client.hmset(data2.name, data2);
				fChatLibInstance.sendMessage(g+data1.name+" has given "+data2.name+" the amount of ¥"+numberFormat(cantidad)+"."+ec, channel);
			});
		});
	}
	
	cmdHandler.wallet = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let hoja = g+data1.name+" has ¥" + numberFormat(data1.money) + "."+ec;
			if (data1.money < 0) {
				hoja = r+data1.name+" has a debt of ¥" + numberFormat(0-data1.money) + "."+ec;
			}
			fChatLibInstance.sendMessage(hoja, channel);
		});
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
	
	cmdHandler.cleardebt = function (args, data) {
		//if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es mod
		if (data.character != "Yuzu Sama") { return 0; }
		
		let arr = args.split('to ');
		let destiny = removeBBcode(arr[1]);
		if (destiny == undefined) {
			let message = r+"You must specify a recipient. Example: !cleardebt to Kenia Nya"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		
		client.hgetall(destiny, function (err, data2) {
			if (data2 == null) { fChatLibInstance.sendMessage(r+"That person wasn't found, tell them to speak in the room first~"+ec, channel); return 0; }
			data2.money = 0;
			client.hmset(data2.name, data2);
			fChatLibInstance.sendMessage(g+data.character+" has cleared "+data2.name+"'s debt!"+ec, channel);
		});
	}
	
	cmdHandler.debt = function (args, data) {
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es mod
		//if (data.character != "Yuzu Sama") { return 0; }
		
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
		if (destiny == "Yuzu Sama") { fChatLibInstance.sendMessage(r+"You can't give Yuzy Sama a debt! That's not how it works!"+ec, channel); return 0; }
		
		client.hgetall(destiny, function (err, data2) {
			if (data2 == null) { fChatLibInstance.sendMessage(r+"That person wasn't found, tell them to speak in the room first~"+ec, channel); return 0; }
			data2.money = parseInt(data2.money) - cantidad;
			client.hmset(data2.name, data2);
			fChatLibInstance.sendMessage(y+data.character+" has given "+data2.name+" a debt of ¥"+numberFormat(cantidad)+".! The money has gone to Yuzu's personal account~"+ec, channel);
			
			client.hgetall("Yuzu Sama", function (rr, data3) {
				data3.money = parseInt(data3.money) + cantidad;
				client.hmset(data3.name, data3);
			});
			
		});
	}
	
	
	
	
	var register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			if (reply == 0) {
				let data1 = {name: data.character};
				data1.money = 250;
				client.hmset(data.character, data1);
			}
		});
	}
	
	fChatLibInstance.addMessageListener(function(parent, data) {
		if (data.channel != channel) { return 0; }
		register("", data);
	});
	
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