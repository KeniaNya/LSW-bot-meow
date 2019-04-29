var fChatLibInstance;
var channel;
var o = "[color=orange][b]"; var r = "[color=red][b]"; var y = "[color=yellow][b]"; var g = "[color=green][b]"; var c = "[color=cyan][b]"; var ec = "[/b][/color]";
function green(text) { return g+text+ec; }
function yellow(text) { return y+text+ec; }
function red(text) { return r+text+ec; }
function cyan(text) { return c+text+ec; }
function orange(text) { return o+text+ec; }
var fs = require('fs');
var requireNew = require('require-new');
var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.18", {db: 5});
client.on("error", function (err) { console.log("Redis error " + err); });

var pjBase = require('./etc/ryuutama_base_pj.js');
var Personaje = require('./etc/ryuutama_personaje.js');
var classes = require('./etc/ryuutama_classes.js');
var arquetipos = require('./etc/ryuutama_arquetipos.js');
var creationMessage = require('./etc/msgCreacion.js');
var shop = require('./etc/ryuutama_shop.js');

// magic tutorial in the character creation, conditions on items during buying....
//Falta: Tienda (no equipamiento), Noshy's ideas
//Falta: transferir items(player)
//Base de datos de mounstros, climas, terrenos, pueblos... veremos... auto combat? (+1 si el post previo al ataque es complejo)

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	//Admin
	
	cmdHandler.giveOtherItem = function (args, data) { // !giveitem apple to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' to '); // 1 apple, Kenia Nya
		if (corte1.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" You have to specify the person (using 'to') Example: !giveotheritem crazy stuff [b]to[/b] Kenia Nya", channel); return 0; }
		let player = corte1[1];
		let object = corte1[0];
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.giveOther(object, 1)) {
				fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has given "+yellow(object)+" to "+cyan(player)+"!", channel);
				client.hmset(player, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found", channel);
			}
		});
	}
	
	cmdHandler.removeOtherItem = function (args, data) { // !giveitem apple to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' from '); // 1 apple, Kenia Nya
		if (corte1.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" You have to specify the person (using 'to') Example: !giveotheritem crazy stuff [b]to[/b] Kenia Nya", channel); return 0; }
		let player = corte1[1];
		let object = corte1[0];
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.removeOther(object)) {
				fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has taken "+yellow(object)+" from "+cyan(player)+"!", channel);
				client.hmset(player, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found", channel);
			}
		});
	}
	
	cmdHandler.setStat = function (args, data) { // !giveitem 1 apple to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' to '); // 1 apple, Kenia Nya
		if (corte1.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" You have to specify the person (using 'to') Example: !setstat 5 XP [b]to[/b] Kenia Nya", channel); return 0; }
		let corte2 = corte1[0].split(' '); // 1, apple
		if (corte2.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" You have to use give or set, then how much, then what stat. Example: !setstat 5 XP to Kenia Nya", channel); return 0; }
		let player = corte1[1];
		let number = parseInt(corte2[0]);
		if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type a number. Example: !setstat [b]5[/b] XP to Kenia Nya", channel); return 0; }
		let object = corte2[1];
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.set(object, number)) {
				fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has set "+yellow(number+" "+object)+" to "+cyan(player)+"!", channel);
				client.hmset(player, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Stat or item not found", channel);
			}
		});
	}
	
	cmdHandler.give = function (args, data) { // !give 1 apple to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' to '); // 1 apple, Kenia Nya
		if (corte1.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" You have to specify the person (using 'to') Example: !give 5 XP [b]to[/b] Kenia Nya", channel); return 0; }
		let corte2 = corte1[0].split(' '); // 1, apple, juice
		let player = corte1[1];
		let number = parseInt(corte2.splice(0,1)[0]);
		if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type a number. Example: !give [b]5[/b] XP to Kenia Nya", channel); return 0; }
		let object = corte2.join(' ');
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.give(object, number)) {
				fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has given "+yellow(number+" "+object)+" to "+cyan(player)+"!", channel);
				client.hmset(player, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found", channel);
			}
		});
	}
	
	cmdHandler.removeItem = function (args, data) { // !removeItem 1 walking stick from Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' from '); // 1 apple, Kenia Nya
		if (corte1.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" You have to specify the person (using 'to') Example: !removeItem 5 XP [b]from[/b] Kenia Nya", channel); return 0; }
		let corte2 = corte1[0].split(' '); // 1, apple, juice
		let player = corte1[1];
		let number = parseInt(corte2.splice(0,1)[0]);
		if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type a number. Example: !removeItem [b]5[/b] XP from Kenia Nya", channel); return 0; }
		let object = corte2.join(' ');
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			let result = pj.removeItem(object, number);
			if (result == number) {
				fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has taken the "+yellow(number+" "+object)+" from "+cyan(player)+"!", channel);
				client.hmset(player, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found (Or not enough), Quantity removed: "+yellow(result+" "+object)+".", channel);
			}
		});
	}
	
	cmdHandler.restoreStat = function (args, data) { // !restoreStat STR to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' to ');
		let player = corte1[1];
		let object = corte1[0];
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.restoreStat(object)) {
				fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has restored the "+yellow(object)+" to "+cyan(player)+"!", channel);
				client.hmset(player, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Stat not found", channel);
			}
		});
	}
	
	cmdHandler.restoreAll = function (args, data) { // !restoreAll Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let player = args;
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			pj.restoreAll();
			fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has restored all stats to "+cyan(player)+"!", channel);
			client.hmset(player, pj.saveFile());
		});
	}
	
	cmdHandler.addstatus = function (args, data) { // !addstatus injury,4 to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' to ');
		let player = corte1[1];
		let object = corte1[0];
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			pj.Conditions.push(object);
			fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has given the status of "+yellow(object)+" to "+cyan(player)+"!", channel);
			client.hmset(player, pj.saveFile());
		});
	}
	
	cmdHandler.removestatus = function (args, data) { // !removestatus injury,4 to Kenia Nya
		args = args.trim();
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let corte1 = args.split(' to ');
		let player = corte1[1];
		let object = corte1[0];
		client.hgetall(player, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			let index = pj.Conditions.indexOf(object); if (index == -1) { fChatLibInstance.sendMessage(red("Error!")+" Status not found", channel); return 0; }
			pj.Conditions.splice(index,1);
			fChatLibInstance.sendMessage(green("Info")+" The Ryuujin has removed the status of "+yellow(object)+" to "+cyan(player)+"!", channel);
			client.hmset(player, pj.saveFile());
		});
	}
	
	cmdHandler.roll2 = function (args, data) { console.log("meow");
		let numbers = args.split("d");
		if (numbers.length != 2) { return 0; }
		let howmany = parseInt(numbers[0]); if (isNaN(howmany) || howmany < 1 || howmany > 5) { return 0; }
		let sizes = [4,6,8,10,12];
		let size = parseInt(numbers[1]); if (sizes.indexOf(size) == -1) { return 0; }
		let result = ""; let o = "[eicon]"; let c = "[/eicon]";
		for (let i = 0; i < howmany; i++) {
			let roll = Math.ceil(Math.random()*size);
			result += o+roll+"_d"+size+c;
		}
		fChatLibInstance.sendMessage(result, channel);
	}
	
	//Character
	
	cmdHandler.myCharacters = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let message = " Character list: "; let characters = []; let selected = data1.selected; delete data1.selected;
			let elements = Object.keys(data1);
			for (let i in elements) { let character = elements[i];
				if (character == selected) { characters.push(green(character)); } else { characters.push(character); }
			}
			fChatLibInstance.sendMessage(green("Info")+message+characters.toString()+" (Green = selected)", channel);
		});
	}
	
	cmdHandler.selectCharacter = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let selected = data1.selected; delete data1.selected;
			if (args == selected) { fChatLibInstance.sendMessage(red("Error!")+" Character already selected.", channel); return 0; }
			let elements = Object.keys(data1);
			if (elements.indexOf(args) == -1) { fChatLibInstance.sendMessage(red("Error!")+" Character not found.", channel); cmdHandler.myCharacters("", data); return 0; }
			data1.selected = args;
			client.hmset(data.character, data1);
			fChatLibInstance.sendMessage(green("Info")+" "+args+" was selected!", channel);
		});
	}
	
	cmdHandler.deleteCharacter = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let selected = data1.selected; delete data1.selected; let deleted = data1[args];
			let elements = Object.keys(data1);
			if (elements.indexOf(args) == -1) { fChatLibInstance.sendMessage(red("Error!")+" Character not found.", channel); return 0; }
			if (elements.length == 1) {
				client.del(data.character);
				fChatLibInstance.sendMessage(green("Info")+" Character deleted.", channel);
				client.hlen("Deleted Characters Meow", function (err, reply) {
					let next = [parseInt(reply)+1].toString();
					client.hset("Deleted Characters Meow", next+" "+args, deleted);
				});
			} else {
				
				elements.splice(elements.indexOf(args),1);
				data1.selected = elements[0];
				client.hmset(data.character, data1);
				fChatLibInstance.sendMessage(green("Info")+" Character deleted.", channel);
				client.hlen("Deleted Characters Meow", function (err, reply) {
					let next = [parseInt(reply)+1].toString();
					client.hset("Deleted Characters Meow", next+" "+args, deleted);
				});
				client.hdel(data.character, args);
			}
		});
	}
	
	cmdHandler.buy = function (args, data) {
		args = args.trim();
		// !buy item, !buy 5 of item
		let corte1 = args.split(' of '); // item, 5 item
		let item = ""; let number = 1;
		if (corte1.length == 1) { item = corte1[0]; }
		if (corte1.length == 2) { item = corte1[1]; number = parseInt(corte1[0]); }
		if (isNaN(number) || number < 1) { fChatLibInstance.sendMessage(red("Error!")+" Example: !buy Rain Boots, or !buy 2 Walking stick", channel); return 0; }
		if (item == "") { fChatLibInstance.sendMessage(red("Error!")+" Example: !buy Rain Boots, or !buy 2 Walking stick", channel); return 0; }
		
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.buy(item, number)) {
				fChatLibInstance.sendMessage(green("Info")+" The player has bougth "+yellow(number+" "+item)+"! They have "+pj.GOLD+" Gold remaining.", channel);
				client.hmset(data.character, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found or not enough money", channel);
			}
		});
	}
	
	cmdHandler.equip = function (args, data) {
		args = args.trim();
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.equip(args)) {
				fChatLibInstance.sendMessage(green("Info")+" The player has equipped "+yellow(args)+"!", channel);
				client.hmset(data.character, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found or not equippable.", channel);
			}
		});
	}
	
	cmdHandler.unequip = function (args, data) {
		args = args.trim();
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.unequip(args)) {
				fChatLibInstance.sendMessage(green("Info")+" The player has unequipped "+yellow(args)+"!", channel);
				client.hmset(data.character, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Item not found or not equippable.", channel);
			}
		});
	}
	
	cmdHandler.register = function (args, data) {
		args = args.trim();
		if (args == "") { args = data.character; }				//si no le pones nada, usará el nombre del player
		client.exists(data.character, function (err, reply1) {	//Buscamos al dueño en la base de datos...
			if (reply1 == 1) {									//si tenemos cosas en la base...
				client.hgetall(data.character, function (err, data1) { 
					//data es algo asi... {cosa1: valor, cosa2: valor..., selected: cosa1}
					if (data1[args] === undefined) {				//si no tienes un personaje con ese nombre...
						data1[args] = pjBase;
						data1[args].Name = args;
						data1[args].Owner = data.character;
						data1[args] = JSON.stringify(data1[args]);
						data1.selected = args;
						client.hmset(data.character, data1);
						fChatLibInstance.sendMessage(green("Info")+" The character "+cyan(args)+" was created by "+cyan(data.character)+"!", channel);
						cmdHandler.characterCreation("Registered!", data);
						return 0;
					} else { fChatLibInstance.sendMessage(red("Error!")+" You already have a character with that name, choose another", channel); return 0; }
				});
			} else {											//Si no hay nada en la base de datos...
				let data1 = {selected: args};
				data1[args] = pjBase;
				data1[args].Name = args;
				data1[args].Owner = data.character;
				data1[args] = JSON.stringify(data1[args]);
				client.hmset(data.character, data1);
				fChatLibInstance.sendMessage(green("Info")+" The character "+cyan(args)+" was created by "+cyan(data.character)+"!", channel);
				cmdHandler.characterCreation("Registered!", data);
				return 0;
			}
		});
	}
	
	cmdHandler.edit = function (args, data) {
		args = args.trim();
		// !edit Name to Sophie
		let corte1 = args.split(' to '); // Name, Sophie
		if (corte1.length != 2) { fChatLibInstance.sendMessage(red("Error!")+" Example: !edit Name to Sophie", channel); return 0; }
		
		let item = corte1[0];
		let value = corte1[1];
		
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.edit(item, value)) {
				fChatLibInstance.sendMessage(green("Info")+" Information changed!", channel);
				client.hmset(data.character, pj.saveFile());
			} else {
				fChatLibInstance.sendMessage(red("Error!")+" Information not found", channel);
			}
		});
	}
	
	cmdHandler.addspell = function (args, data) {
		args = args.trim();
		// !addspell Nombre del hechizo
		let item = args;
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.spellBook.length == pj.knownSpells) { fChatLibInstance.sendMessage(red("Error!")+" You can't learn more spells yet.", channel); return 0; }
			pj.spellBook.push(item);
			client.hmset(data.character, pj.saveFile());
			fChatLibInstance.sendMessage(green("Info")+" Spell added!", channel);
		});
	}
	
	cmdHandler.chooseseason = function (args, data) {
		args = args.trim();
		let item = args;
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			if (pj.seasonMagic == "") { fChatLibInstance.sendMessage(red("Error!")+" You can't use season magic.", channel); return 0; }
			if (item.toLowerCase() == "spring") { item = green(item); }
			if (item.toLowerCase() == "summer") { item = yellow(item); }
			if (item.toLowerCase() == "fall") { item = orange(item); }
			if (item.toLowerCase() == "winter") { item = cyan(item); }
			pj.seasonMagic = item;
			client.hmset(data.character, pj.saveFile());
			fChatLibInstance.sendMessage(green("Info")+" Season selected!", channel);
		});
	}
	
	cmdHandler.sheet1 = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			fChatLibInstance.sendMessage(generarHoja1(pj), channel);
		});
	}
	
	cmdHandler.sheet2 = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			fChatLibInstance.sendMessage("\n"+generarHoja2(pj)+"\n"+generarInventario(pj), channel);
		});
	}
	
	cmdHandler.sheet3 = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			fChatLibInstance.sendMessage("\n"+generarHoja3(pj), channel);
		});
	}
	
	cmdHandler.inventory = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			fChatLibInstance.sendMessage("\n"+generarInventario(pj), channel);
		});
	}
	
	cmdHandler.sheet = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fChatLibInstance.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			fChatLibInstance.sendMessage(generarHoja1(pj)+generarHoja2(pj)+"\n"+generarInventario(pj), channel);
		});
	}
	
	cmdHandler.roll = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let pj = new Personaje(data1);
			let roll = pj.roll(args);
			if (roll == -999) { fChatLibInstance.sendMessage(red("Error!")+" One of the elements is neither a stat or a number!", channel); return 0; }
			fChatLibInstance.sendMessage(green("Info")+roll, channel);
		});
	}
	
	cmdHandler.condition = function (args, data) { //str+spi "+others"
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let pj = new Personaje(data1); let number = 0;
			if (args[0] == "+" || args[0] == "-") { number = parseInt(args); if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type the sign and a valid number! Example: !condition +1", channel); return 0; } }
			let roll = pj.roll("STR+SPI"+args);
			let result = parseInt(roll.split("Total: [b]")[1].split("[/b]")[0]);
			if (result >= 10) { roll += green(" You rolled 10 or more! ")+"You can increase one of your characteristics for this day."; }
			if (result == 2+parseInt(args)) { roll += red(" You fumbled! ")+"You suffer one of this conditions: [Injury: 4], [Poison: 4], [Exhaustion: 4], [Muddled: 4] (You can choose which one)"; }
			fChatLibInstance.sendMessage(green("Info")+" Your condition roll is: "+roll, channel);
			pj.set("Condition",result);
			client.hmset(data.character, pj.saveFile());
		});
	}
	
	cmdHandler.initiative = function (args, data) { //dex+int "+others"   //bonusINI
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let pj = new Personaje(data1); let number = 0;
			if (args[0] == "+" || args[0] == "-") { number = parseInt(args); if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type the sign and a valid number! Example: !condition +1", channel); return 0; } }
			let bonus = "+"+pj.bonusINI.toString();
			if (pj.bonusINI < 0) { bonus = pj.bonusINI.toString(); }
			let roll = pj.roll("DEX+INT"+bonus+args);
			fChatLibInstance.sendMessage(green("Info")+" Your initiative roll is: "+roll, channel);
			let result = parseInt(roll.split("Total: [b]")[1].split("[/b]")[0]);
			pj.set("INI",result);
			client.hmset(data.character, pj.saveFile());
		});
	}
	
	cmdHandler.movement = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let pj = new Personaje(data1); let number = 0;
			if (args[0] == "+" || args[0] == "-") { number = parseInt(args); if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type the sign and a valid number! Example: !condition +1", channel); return 0; } }
			let roll = pj.roll("STR+DEX"+args);
			fChatLibInstance.sendMessage(green("Info")+" Your movement roll is: "+roll, channel);
		});
	}
	
	cmdHandler.direction = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let pj = new Personaje(data1); let number = 0;
			if (args[0] == "+" || args[0] == "-") { number = parseInt(args); if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type the sign and a valid number! Example: !condition +1", channel); return 0; } }
			let roll = pj.roll("INT+INT"+args);
			fChatLibInstance.sendMessage(green("Info")+" Your direction roll is: "+roll, channel);
		});
	}
	
	cmdHandler.camp = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { return 0; }
			let pj = new Personaje(data1); let number = 0;
			if (args[0] == "+" || args[0] == "-") { number = parseInt(args); if (isNaN(number)) { fChatLibInstance.sendMessage(red("Error!")+" You have to type the sign and a valid number! Example: !condition +1", channel); return 0; } }
			let roll = pj.roll("DEX+INT"+args);
			fChatLibInstance.sendMessage(green("Info")+" Your camp roll is: "+roll, channel);
		});
	}

	//Shop
	
	cmdHandler.weapons = function (args, data) { fChatLibInstance.sendPrivMessage(data.character, generar_tienda(shop, 0, 5, "Weapons", "⚔️")); }
	cmdHandler.armor = function (args, data) { fChatLibInstance.sendPrivMessage(data.character, generar_tienda(shop, 6, 11, "Armor and other protective items", "🛡️")); }
	cmdHandler.outfits = function (args, data) { fChatLibInstance.sendPrivMessage(data.character, generar_tienda(shop, 12, 32, "Traveling outfits and accessories", "👘")); }
	cmdHandler.animals = function (args, data) { fChatLibInstance.sendPrivMessage(data.character, generar_tienda(shop, 41, 45, "Animals", "🐴")); }
	cmdHandler.generalitems = function (args, data) { fChatLibInstance.sendPrivMessage(data.character, generar_tienda(shop, 46, 70, "General items", "👜")); }
	
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CREACION DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
	
	if (channel == "adh-e6b3926912c9ad9105f8") {
	fChatLibInstance.addPrivateMessageListener(function(parent, data) { if (!data || !data.message || !(data.message.length > 0) || data.message[0] == "!") { return 0; }
		let args = data.message.trim();
		cmdHandler.characterCreation(args, data);
	});
	}
	
	cmdHandler.characterCreation = function (args, data) {			//Estados: Class, Type, Charas, Weapon, Favorite, Name, Age, Sex, Color, Look, Home, Reason, Personality
		client.hgetall(data.character, function (err, data1) { if (data1 == null) { return 0; }
			var pj = new Personaje(data1); if (pj.creationStage == "Done") { return 0; }
			if (args == "Registered!") { fChatLibInstance.sendPrivMessage(data.character, creationMessage["Class"]); return 0; }
			if (pj.creationStage == "Class") {
				let clase = busca(classes, args); if (clase == -1) { fChatLibInstance.sendPrivMessage(data.character, "Wrong class... Just type the name, case sensitive, without '!'"); return 0; }
				pj.addClass(clase);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Type"]);
				pj.creationStage = "Type";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Type") {
				let arque = busca(arquetipos, args); if (arque == -1) { fChatLibInstance.sendPrivMessage(data.character, "Wrong archetype... Just type the name, case sensitive"); return 0; }
				pj.addArchetype(arque);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Charas"]);
				pj.creationStage = "Charas";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Charas") {
				let arr = args.split(","); let charas = []; let suma = 0;
				if (arr.length != 4) { fChatLibInstance.sendPrivMessage(data.character, "Wrong characteristics... Example: 4,6,6,8"); return 0; }
				for (let i in arr) {
					charas[i] = parseInt(arr[i]);
					if (isNaN(charas[i])) { fChatLibInstance.sendPrivMessage(data.character, "Wrong characteristics... Example: 4,6,6,8"); return 0; }
					if (charas[i] != 4 && charas[i] != 6 && charas[i] != 8) { fChatLibInstance.sendPrivMessage(data.character, "Wrong characteristics... Example: 4,6,6,8"); return 0; }
					suma += charas[i];
				} if (suma != 24) { fChatLibInstance.sendPrivMessage(data.character, "Wrong characteristics... Example: 4,6,6,8"); return 0; }
				pj.addCharas(charas);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Weapon"]);
				pj.creationStage = "Weapon";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Weapon") {
				let weapon = buscaSlot(shop, args, "Weapons"); if (weapon == -1) { fChatLibInstance.sendPrivMessage(data.character, "Wrong weapon... Just type the name, case sensitive"); return 0; }
				pj.trainedWeapons.push(weapon.Name);
				pj.Weapons.push(weapon);
				if (pj.twNumber > pj.trainedWeapons.length) {
					client.hmset(data.character, pj.saveFile());
					fChatLibInstance.sendPrivMessage(data.character, "Choose your second weapon..."); return 0;
				}
				if (pj.Weapons.length == 1) { pj.Weapons.push(shop[0]); }
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Favorite"]);
				pj.creationStage = "Favorite";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Favorite") {
				pj.edit("favoriteObject",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Age"]);	//Name
				pj.creationStage = "Age";													//Name
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			//if (pj.creationStage == "Name") {
			//	pj.edit("Name",args);
			//	fChatLibInstance.sendPrivMessage(data.character, creationMessage["Age"]);
			//	pj.creationStage = "Age";
			//	client.hmset(data.character, pj.saveFile());
			//	return 0;
			//}
			if (pj.creationStage == "Age") {
				pj.edit("Age",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Sex"]);
				pj.creationStage = "Sex";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Sex") {
				pj.edit("Sex",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Color"]);
				pj.creationStage = "Color";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Color") {
				pj.edit("Color",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Looks"]);
				pj.creationStage = "Looks";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Looks") {
				pj.edit("Looks",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Home"]);
				pj.creationStage = "Home";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Home") {
				pj.edit("Home",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Reason"]);
				pj.creationStage = "Reason";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Reason") {
				pj.edit("Reason",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Personality"]);
				pj.creationStage = "Personality";
				client.hmset(data.character, pj.saveFile());
				return 0;
			}
			if (pj.creationStage == "Personality") {
				pj.edit("Personality",args);
				fChatLibInstance.sendPrivMessage(data.character, creationMessage["Done"]);
				pj.creationStage = "Done";
				client.hmset(data.character, pj.saveFile());
				cmdHandler.sheet1("", data);
				return 0;
			}
		});
	}
	
	
	return cmdHandler;
};

function generarHoja1(pj) {
	let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"]; let color1 = "white";
	if (colores.indexOf(pj.Color.toLowerCase()) > -1) { color1 = pj.Color.toLowerCase(); }
	let eicon = "[icon]"+pj.Owner+"[/icon]"; if (pj.Eicon != "") { eicon = "[eicon]"+pj.Eicon+"[/eicon]"; }
	let message = fs.readFileSync('./plugins/etc/ryuutama_sheet.txt', 'utf8');
	let hoja = "";
	
	let corte1 = message.split("{");
	hoja += corte1.splice(0,1)[0];
	let temp = corte1.length;
	for (let i = 0; i < temp; i++) {
		let corte2 = corte1.splice(0,1)[0].split("}");
		hoja += "[color="+color1+"][b]"+eval(corte2[0])+"[/b][/color]" + corte2[1];
	}
	return hoja;
}

function generateHabilities(pj) {
	let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"]; let color1 = "white";
	if (colores.indexOf(pj.Color.toLowerCase()) > -1) { color1 = pj.Color.toLowerCase(); }
	let hoja = ""; let Habilities = pj.Habilities;
	for (let i = 0; i < Habilities.length; i++) {
		let message = fs.readFileSync('./plugins/etc/ryuutama_sheet_habilities.txt', 'utf8');
		let corte1 = message.split("{");
		hoja += corte1.splice(0,1)[0];
		let temp = corte1.length;
		for (let j = 0; j < temp; j++) {
			let corte2 = corte1.splice(0,1)[0].split("}");
			hoja += eval(corte2[0]) + corte2[1];
		}
	} return hoja;
}

function generarHoja2(pj) {
	let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"]; let color1 = "white";
	if (colores.indexOf(pj.Color.toLowerCase()) > -1) { color1 = pj.Color.toLowerCase(); }
	let message = fs.readFileSync('./plugins/etc/ryuutama_stats.txt', 'utf8');
	let hoja = "";
	
	let corte1 = message.split("{");
	hoja += corte1.splice(0,1)[0];
	let temp = corte1.length;
	for (let i = 0; i < temp; i++) {
		let corte2 = corte1.splice(0,1)[0].split("}"); let o = "[color="+color1+"][b]"; let c = "[/b][/color]";
		hoja += eval(corte2[0]) + corte2[1];
	}
	return hoja;
}

function generateEquipment(pj) {
	let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"]; let color1 = "white";
	if (colores.indexOf(pj.Color.toLowerCase()) > -1) { color1 = pj.Color.toLowerCase(); }
	let hojaTemp = ""; let hoja = "";
	if (pj.Weapons[0] !== undefined) { hojaTemp += "{o+pj.Weapons[0].Name+c}, ATK: {o+pj.Weapons[0].ATK+c}, DMG: {o+pj.Weapons[0].DMG+c}, Effect/etc: {o+pj.Weapons[0].Desc+c}\n"; }
	if (pj.Weapons[1] !== undefined) { hojaTemp += "{o+pj.Weapons[1].Name+c}, ATK: {o+pj.Weapons[1].ATK+c}, DMG: {o+pj.Weapons[1].DMG+c}, Effect/etc: {o+pj.Weapons[1].Desc+c}\n"; }
	if (pj.Shield[0] !== undefined) { hojaTemp += "{o+pj.Shield[0].Name+c}, Defense: {o+pj.Shield[0].Def+c}, Penalty: {o+pj.Shield[0].Penalty+c}, Dodge: {o+oj.Shield[0].Dodge+c}, Effect/etc: {o+pj.Shield[0].Desc+c}\n"; }
	if (pj.Armor[0] !== undefined) { hojaTemp += "{o+pj.Armor[0].Name+c}, Defense: {o+pj.Armor[0].Def+c}, Penalty: {o+pj.Armor[0].Penalty+c}, Effect/etc: {o+pj.Armor[0].Desc+c}\n"; }
	for (let i = 0; i < pj.Clothes.length; i++) {
		hojaTemp += "{o+pj.Clothes["+i+"].Name+c}, Effect/etc: {o+pj.Clothes["+i+"].Desc+c}\n";
	}
	let corte1 = hojaTemp.split("{");
	hoja += corte1.splice(0,1)[0];
	let temp = corte1.length;
	for (let i = 0; i < temp; i++) {
		let corte2 = corte1.splice(0,1)[0].split("}"); let o = "[color="+color1+"][b]"; let c = "[/b][/color]";
		hoja += eval(corte2[0]) + corte2[1];
	}
	return hoja;
}

function generarInventario(pj) {
	let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"]; let color1 = "white";
	if (colores.indexOf(pj.Color.toLowerCase()) > -1) { color1 = pj.Color.toLowerCase(); }
	let hoja = "[color=cyan]";
	hoja +="                                               ⭐ ⭐ [b]Inventory[/b] ⭐ ⭐";
	hoja +="\n                                                           Gold: "+yellow(pj.GOLD);
	let countedItems = [];
	for (let i = 0; i < pj.Inventory.length; i++) {
		let cantidad = 1;
		if (countedItems.indexOf(pj.Inventory[i].Name) != -1) { continue; } else { countedItems.push(pj.Inventory[i].Name); }
		for (let j = i+1; j < pj.Inventory.length; j++) {
			if (pj.Inventory[i].Name == pj.Inventory[j].Name) { cantidad++; }
		}
		hoja += "\n[color="+color1+"][b]"+cantidad+" "+pj.Inventory[i].Name+"[/b][/color] ("+generar_stats(pj.Inventory[i])+")";
	} hoja += "[/color]";
	return hoja;
}

function generarHoja3(pj) {
	let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"]; let color1 = "white";
	if (colores.indexOf(pj.Color.toLowerCase()) > -1) { color1 = pj.Color.toLowerCase(); }
	let message = fs.readFileSync('./plugins/etc/ryuutama_magic.txt', 'utf8');
	let hoja = "";
	
	let corte1 = message.split("{");
	hoja += corte1.splice(0,1)[0];
	let temp = corte1.length;
	for (let i = 0; i < temp; i++) {
		let corte2 = corte1.splice(0,1)[0].split("}");
		hoja += "[color="+color1+"][b]"+eval(corte2[0])+"[/b][/color]" + corte2[1];
	}
	return hoja;
}

function generar_tienda(lista, min, max, store, emoji) {
	let hoja = "\n[color=cyan]";
	hoja +="                                 " + emoji + " " + emoji + " [b]" + store + "[/b] " + emoji + " " + emoji + "\n";
	for (let i = min; i < max; i++) {
		hoja += "► "+lista[i].Price+" G - "+lista[i].Name+" - "+generar_stats(lista[i])+"\n";
	} hoja += "[/color]";
	return hoja;
}

function generar_stats(objeto) {
	let message = [];
	if (objeto.Size != null) 	{ message.push("Size: "+objeto.Size); }
	if (objeto.ATK != null)		{ message.push("ATK: "+objeto.ATK); }
	if (objeto.DMG != null)		{ message.push("DMG: "+objeto.DMG); }
	if (objeto.Def != null)		{ message.push("Defense: +"+objeto.Def); }
	if (objeto.Penalty != null)		{ message.push("Penalty: "+objeto.Penalty); }
	if (objeto.Dodge != null)		{ message.push("Dodge: +"+objeto.Dodge); }
	if (objeto.Desc != null)		{ message.push(objeto.Desc); }
	if (message.length > 0) { message = message.join(", ") + "."; } else { message = ""; }
	return message;
}


//buscar por nombre
function busca(lista, nombre) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].Name.toLowerCase() == nombre.toLowerCase()) {
			return lista[i];
        }
    }
    return -1;
}

//buscar por slot
function buscaSlot(lista, nombre, slot) {
    for (let i = 0; i < lista.length; i++) {
		if (lista[i].Slot != slot) { continue; }
        if (lista[i].Name.toLowerCase() == nombre.toLowerCase()) {
			return lista[i];
        }
    }
    return -1;
}