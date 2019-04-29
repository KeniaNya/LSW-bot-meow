var fChatLibInstance;
var channel;
var players = [];
var jsonfile = require('jsonfile');
var drinks = jsonfile.readFileSync("./plugins/etc/drinks.json");
var random_sentence = "";
var limbo = 0;
var g = "[color=green]"; var y = "[color=yellow]"; var r = "[color=red]"; var p = "[color=pink]"; var ec = "[/color]";
var drinksref = "https://vinepair.com/articles/50-most-popular-cocktails-world-2017/";

var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.18", {db: 15});

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.limbo = function (args, data) {
		let message = "[eicon]limbostart[/eicon]"+y+p+data.character+ec+" slowly leans back and walks under the limbo stick... "+ec;
		let recamara = Math.floor(Math.random() * (6 - limbo));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(message+"[eicon]limbofail[/eicon]"+r+" But they crash with the limbo stick and fall to the ground!"+ec, channel);
			limbo = 0;
		} else {
			limbo += 1;
			let altura = 6-limbo;
			fChatLibInstance.sendMessage(message+"[eicon]limbopass[/eicon]"+g+" And crosses safely! The stick gets lowered to "+altura+" feet."+ec, channel);
		}
	}
	
	cmdHandler.fireworks = function (args, data) {
		let size = Math.floor(Math.random() * 11);
		if (size == 10) {
			fChatLibInstance.sendMessage(r+p+data.character+ec+" lits up a MASSIVE firework and it instantly explodes on them! [eicon]explosion[/eicon] The show is pretty good, though~"+ec, channel);
			return 0;
		}
		if (size == 0) {
			fChatLibInstance.sendMessage(g+p+data.character+ec+" lits up a tiny firework and... it makes ~poof~"+ec, channel);
			return 0;
		}
		fChatLibInstance.sendMessage(y+p+data.character+ec+" lits up the fireworks! [eicon]beachfireworks[/eicon]"+ec, channel);
	}
	
	cmdHandler.punch = function (args, data) {
		let power = Math.ceil(Math.random() * 100);
		if (power == 100) { fChatLibInstance.sendMessage(y+p+data.character+ec+" punches the machine!"+ec+g+" They got a power of 100! They get a reward!"+ec, channel); return 0; }
		if (power == 1) { fChatLibInstance.sendMessage(y+p+data.character+ec+" punches the machine!"+ec+r+" They got a power of 1! That was pretty weak~"+ec, channel); return 0; }
		fChatLibInstance.sendMessage(y+p+data.character+ec+" punches the machine!"+ec+y+" They got a power of "+power+"! Nice~"+ec, channel);
	}
	
	cmdHandler.sandcastle = function (args, data) {
		let message = g+"[icon]Bot Announcer[/icon]Welcome to the sand castle challenge!"+ec+"\n";
		message += "In this event, you have to type a sentence as fast as possible, the first person who does it, will get the best sand castle and win the challenge! Are you ready?\n";
		fChatLibInstance.sendMessage(message, channel);
		
		let start = ["The lewd sexual wrestling ","The beach festival ","My sand castle "];
		let middle = ["is the most fun, ","is the best, ","is amazing, "];
		let finish = ["Meow!","Woof!","Nyan!","Bark!"];
		let sentence = start[Math.floor(Math.random()*3)]+middle[Math.floor(Math.random()*3)]+finish[Math.floor(Math.random()*3)];
		let sentence2 = "[b]"+sentence.split(" ").join("[/b]_[b]")+"[/b]";
		fChatLibInstance.sendMessage(y+"Type the following setence: "+ec+sentence2+g+" GO!"+ec, channel);
		random_sentence = sentence;
	}
	
	fChatLibInstance.addMessageListener(function(parent, data) {
		if (data.channel != channel) { return 0; }
		register("", data);
		if (random_sentence == "") { return 0; }
		if (data && data.message && data.message.length > 2) {
			if (data.message.toLowerCase() == random_sentence.toLowerCase()) {
				fChatLibInstance.sendMessage(g+p+data.character+ec+" has won! Congratulations!"+ec, channel);
				random_sentence = "";
				// DAR PREMIO
			}
		}
	});
	
	cmdHandler.drink = function (args, data) {
		let d = drinks[Math.floor(Math.random()*drinks.length)];
		fChatLibInstance.sendMessage("/me "+g+"takes a moment to prepare and serve "+data.character+" a '"+d+"'. [url="+drinksref+"]Drinks reference[/url]"+ec, channel);
	}
	
	cmdHandler.giveCollar = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage("You don't have any collars to give!", channel); return 0; }
			if (data1.earned_collars <= 0) { fChatLibInstance.sendMessage("You don't have any collars to give!", channel); return 0; }
			client.hgetall(args, function (err, data2) {
				if (data2 == null) { fChatLibInstance.sendMessage("That person wasn't found, tell them to speak in the room first~", channel); return 0; }
				data1.earned_collars = parseInt(data1.earned_collars) - 1;
				data2.received_collars = parseInt(data2.received_collars) + 1;
				client.hmset(data1.name, data1);
				client.hmset(data2.name, data2);
				fChatLibInstance.sendMessage(data1.name+" has given "+data2.name+" a collar! How nice~!", channel);
			});
		});
	}
	
	cmdHandler.inventory = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let hoja = "\n";
			hoja +="══════════════════════════════════════════════════\n";
			hoja +="                                 ⭐ ⭐ [color=yellow][b]Festival inventory![/b][/color] ⭐ ⭐\n";
			hoja +="══════════════════════════════════════════════════\n[color=yellow]"; //
			hoja +="                     [icon]" + data1.name + "[/icon] [b]Name:[/b] " + data1.name + "\n";
			hoja +="          [b]Earned collars:[/b] " + data1.earned_collars + "\n";
			hoja +="          [b]Received collars:[/b] " + data1.received_collars + "\n";
			hoja +="          [b]Inventory:[/b] " + data1.inventory +"\n[/color]";
			fChatLibInstance.sendMessage(hoja, channel);
		});
	}
	
	cmdHandler.awardCollar = function (args, data) {
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es mod
		client.hgetall(args, function (err, data2) {
			if (data2 == null) { fChatLibInstance.sendMessage("That person wasn't found, tell them to speak in the room first~", channel); return 0; }
			data2.earned_collars = parseInt(data2.earned_collars) + 1;
			client.hmset(data2.name, data2);
			fChatLibInstance.sendMessage(data.character+" has awarded "+data2.name+" a collar! Good job~!", channel);
		});
	}
	
	
	
	
	
	
	
	
	
	var register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			if (reply == 0) {
				let data1 = {name: data.character};
				data1.earned_collars = 0;
				data1.received_collars = 0;
				data1.welcome = 0;
				data1.inventory = "";
				client.hmset(data.character, data1);
				//fChatLibInstance.sendPrivMessage(data.character, '/me puts a flowers necklace around your neck "Welcome to the beach vacation festival! Please check my profile for more info!" you are now registered for the event, use !inventory to see your festival things');
			}
		});
	}
	
	return cmdHandler;
};