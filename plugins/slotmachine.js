var fChatLibInstance;
var channel;
var players = [];
var g = "[b][color=green]"; var y = "[b][color=yellow]"; var r = "[b][color=red]"; var p = "[b][color=pink]"; var ec = "[/color][/b]";

var icons = {
	cherry: "[eicon]cherrypac[/eicon]",
	seven: "[eicon]seven[/eicon]",
	bell: "[eicon]tacobell[/eicon]"
}

var rpsPlayers = [];
var cardsPlayed = 0;
var rounds = 0;

var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1", {db: 14});

var cilinder = ["cherry","cherry","cherry","cherry","cherry","bell","bell","bell","seven"];

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.slotmachine = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(r+"You're not on the database yet... speak on the room then try again. Sorry."+ec, channel); return 0; }
			
			data1.money = parseInt(data1.money) - 20;
			client.hmset(data1.name, data1);
	
			let c1 = cilinder[Math.floor(Math.random()*cilinder.length)];
			let c2 = cilinder[Math.floor(Math.random()*cilinder.length)];
			let c3 = cilinder[Math.floor(Math.random()*cilinder.length)];
			
			let win = 0;
			
			if (c1 == c2 && c2 == c3) {
				if (c1 == "cherry") { win = 100; }
				if (c1 == "bell") { win = 500; }
				if (c1 == "seven") { win = 15000; }
			}
			
			data1.money = parseInt(data1.money) + win;
			client.hmset(data1.name, data1);
			
			message = icons[c1]+icons[c2]+icons[c3];
			
			if (win > 0) { message += g+" You win ¥"+numberFormat(win)+"! Yay!"+ec; } else { message += r+"You don't win anything, sorry."+ec+" (cherrys: ¥100, bells: ¥500, sevens: ¥15,000)"; }
			
			let hoja = g+data1.name+" has ¥" + numberFormat(data1.money) + "."+ec;
			if (data1.money < 0) {
				hoja = r+data1.name+" has a debt of ¥" + numberFormat(0-data1.money) + "."+ec;
			}
			
			fChatLibInstance.sendMessage(message+" "+hoja, channel);
		});
	}
	
	cmdHandler.odd = function (args, data) { oddsoreven(args, data, "odd"); }
	cmdHandler.even = function (args, data) { oddsoreven(args, data, "even"); }
	
	function oddsoreven (args, data, type) {
		let cantidad = parseInt(args);
		if (isNaN(cantidad) || cantidad < 1) {
			let message = r+"Money amount should be a positive number (without the ¥ or the .00)"+ec;
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(r+"You're not on the database yet... speak on the room then try again. Sorry."+ec, channel); return 0; }
			if (data1.money > 0) {
				if (data1.money < cantidad) { fChatLibInstance.sendMessage(r+"You don't have enough money to bet! check your wallet first~"+ec, channel); return 0; }
			} else {
				if (cantidad > 100) { fChatLibInstance.sendMessage(r+"You can't bet over ¥100!"+ec, channel); return 0; }
			}
			fChatLibInstance.sendMessage(g+data.character+" thinks the 2d6 dice roll will be "+y+type+ec+"! Let's see if they are correct..."+ec, channel);
			let dice = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);
			let mod = dice % 2;
			
			let message = g+"The bot rolls and the result is: "+dice+"!"+ec+" ";
			if ((mod == 0 && type == "even") || (mod == 1 && type == "odd")) {
				message += g+data.character+" has guessed correctly!"+ec;
				data1.money = parseInt(data1.money) + cantidad;
				client.hmset(data1.name, data1);
			} else {
				message += r+data.character+" didn't guess the result! Better luck next time!"+ec;
				data1.money = parseInt(data1.money) - cantidad;
				client.hmset(data1.name, data1);
			}
			
			let hoja = g+data1.name+" has ¥" + numberFormat(data1.money) + "."+ec;
			if (data1.money < 0) {
				hoja = r+data1.name+" has a debt of ¥" + numberFormat(0-data1.money) + "."+ec;
			}
			
			fChatLibInstance.sendMessage(message+" "+hoja, channel);
		});
		
		
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