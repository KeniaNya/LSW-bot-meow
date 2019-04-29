var fChatLibInstance;
var channel;
var now = require('moment');
var jsonfile = require('jsonfile');
var fs = require('fs');
var saveDir = process.cwd()+"/saves";
var saveFile = "/saves.js";
var redis = require("redis");
var items = require('./etc/shop.js');
var yuni = require('./etc/yuni.js');
var milly = require('./etc/milly.js');
var robert = require('./etc/robert.js');
var emily = require('./etc/emily.js');
var Personaje = require('./etc/personaje.js');
var combate = require('./etc/combate.js');
var Combate = new combate();
var gyms = {};
var client = redis.createClient(6379, "127.0.0.1", {db: 1});

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	client.on("error", function (err) {
        console.log("Redis error " + err);
    });
	
	cmdHandler.help = function (args, data) {
		fChatLibInstance.sendPrivMessage(data.character, generar_ayuda());
	}
	
	//****************************
	//Admin only commands
	//****************************
	
	cmdHandler.privateRoom = function(args, data) {
		parent.sendWS('CCR', { channel: "Private ring for "+data.character+" and "+args });
	}
	
	cmdHandler.viewsheet = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Kaffir") { return 0; }
		client.hgetall(args, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, args + " wasn't found."); return 0;
			}
			var pj = new Personaje(chara);
			var message = generar_hoja(pj);
			fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.viewcard = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Kaffir") { return 0; }
		client.hgetall(args, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, args + " wasn't found."); return 0;
			}
			var pj = new Personaje(chara);
			var message = generar_hoja_chica(pj);
			fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.viewbotstatus = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Kaffir") { return 0; }
		var message = "People training: ";
		var personas = Object.keys(gyms);
		for (var i = 0; i < personas.length; i++) {
			message += personas[i] + ": ";
			if (gyms[personas] != null) {
				message += "Training. ";
			} else {
				message += "Not training. ";
			}
		}
		message += "\nCombat: " + Combate.started;
		if (Combate.started == true) {
			message += "\n" + Combate.actores[0].name + " (" + Combate.actores[0].HP + ") vs " + Combate.actores[1].name + "(" + Combate.actores[1].HP + ")";
		}
		fChatLibInstance.sendPrivMessage(data.character, message);
	}
	
	//****************************
	//User commands
	//****************************
	
	cmdHandler.sendmoney = function (args, data) {	
		var arr = args.split(' to ');
		var cantidad = parseInt(arr[0]);
		var destiny = arr[1];
		if (isNaN(cantidad) || cantidad < 1) {
			var message = "Money ammount should be a positive number (without the $ or the .00)";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == undefined) {
			var message = "You must specify a recipient. Example: !sendmoney 3 to Kenia Nya";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara1) {
			if (chara1 == null) {
				var message = "You are not registered.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			client.hgetall(destiny, function (err, chara2) {
				if (chara2 == null) {
					var message = destiny + " wasn't found.";
					data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
					return 0;
				}
				if (parseInt(chara1.Gold) >= cantidad) {
					chara1.Gold = parseInt(chara1.Gold) - cantidad;
					chara2.Gold = parseInt(chara2.Gold) + cantidad;
					client.hmset(data.character, chara1);
					client.hmset(destiny, chara2);
					var message = data.character + " has sent $" + cantidad + ".00 to " + destiny + ".";
				} else {
					var message = "You don't have enough money for that trade.";
				}
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	}
	
	cmdHandler.card = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			client.hgetall(data.character, function (err, chara) {
				if (chara != null) {
					var pj = new Personaje(chara)
					var message = generar_hoja_chica(pj);
				} else {
					var message = "You're not registered, use !register to join the club.";
				}
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			});
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.cardcode = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				var pj = new Personaje(chara)
				var message = "[noparse]" + generar_hoja_chica(pj) + "[/noparse]";
				fChatLibInstance.sendPrivMessage(data.character, message);
			} else {
				fChatLibInstance.sendMessage("You're not registered, use !register to join the club.", channel);
			}
		});
	}
	
	cmdHandler.sheet = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				var pj = new Personaje(chara)
				var message = generar_hoja(pj);
				fChatLibInstance.sendPrivMessage(data.character, message);
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club.");
			}
		});
	}
	
	cmdHandler.sheetcode = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				var pj = new Personaje(chara)
				var message = "[noparse]" + generar_hoja(pj) + "[/noparse]";
				fChatLibInstance.sendPrivMessage(data.character, message);
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club.");
			}
		});
	}
	
	cmdHandler.buy = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		var itemAsked = busca(items, args);
		if (itemAsked == -1) {
			var message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var costo = itemAsked.Gold;
			var pj = new Personaje(chara);
			if (pj.Gold >= costo) {
				pj.addGold(costo * -1);
				pj.giveItem(itemAsked);
				client.hmset(data.character, pj.getSaveFile());
				var message = "The item " + args + " has been added to your item list. You now have $" + pj.Gold + ".00 left.";
			} else {
				var message = "You can't afford that item, you currently have $" + pj.Gold + ".00";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.sell = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		var itemAsked = busca(items, args);
		if (itemAsked == -1) {
			var message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var pj = new Personaje(chara);
			if (pj.removeItem(itemAsked)) {
				var ganancia = Math.floor(itemAsked.Gold / 2);
				pj.addGold(ganancia);
				client.hmset(data.character, pj.getSaveFile());
				var message = "The " + args + " has been sold! " + data.character + " got $" + ganancia + ".00 Back. (Items are bought at half their list price due to sanitation fees)";
			} else {
				var message = "The item " + args + " wasn't found in your inventory or it's a starter item.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.equip = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		var itemAsked = busca(items, args);
		if (itemAsked == -1) {
			var message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var pj = new Personaje(chara);
			if (pj.equip(itemAsked)) {
				client.hmset(data.character, pj.getSaveFile());
				var message = "The item " + args + " has been equipped.";
			} else {
				var message = "The item " + args + " wasn't found in your inventory or cannot be equiped.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			if (reply == 0) {
				var nuevo = {};
				nuevo.name = data.character;
				nuevo.Gold = 50;
				nuevo.HP = 100;
				
				nuevo.atklips = 1;
				nuevo.atkfingers = 1;
				nuevo.atktits = 1;
				nuevo.atksex = 1;
				nuevo.atkass = 1;
				nuevo.atkfeet = 1;
				
				nuevo.deflips = 1;
				nuevo.deftits = 1;
				nuevo.defsex = 1;
				nuevo.defass = 1;
				
				nuevo.wornArmor = "0";
				nuevo.wornWeapon = "100";
				nuevo.wornItem = "200";
				nuevo.wornFlavor = "300";
				nuevo.ownedItems = "0,100,200,300,400";
				
				nuevo.lastpost = "0";
				nuevo.battlestoday = "0";
				
				client.hmset(data.character, nuevo);
				var message = data.character + " has joined!";
			} else {
				var message = "You're already registered.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.resetcharacter = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				chara.Gold = 50;
				
				chara.atklips = 1;
				chara.atkfingers = 1;
				chara.atktits = 1;
				chara.atksex = 1;
				chara.atkass = 1;
				chara.atkfeet = 1;
				
				chara.deflips = 1;
				chara.deftits = 1;
				chara.defsex = 1;
				chara.defass = 1;
				
				chara.wornArmor = "0";
				chara.wornWeapon = "100";
				chara.wornItem = "200";
				chara.wornFlavor = "300";
				chara.ownedItems = "0,100,200,300,400";
				
				client.hmset(data.character, chara);
				var message = data.character + " did a reset on their character!";
			} else {
				var message = "Register first.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.train = function (args, data) {
		if (data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "This command only works in private to avoid spam, use it here.");
			return 0;
		}
		var arr = args.split(' on ');
		var atkORdef = arr[0];
		var part = arr[1];
		if (!( ( (part == "lips" || part == "fingers" || part == "tits" || part == "sex" || part == "ass" || part == "feet") && (atkORdef == "attack") ) || ( (part == "lips" || part == "tits" || part == "sex" || part == "ass") && (atkORdef == "defense") ) )) {
			fChatLibInstance.sendPrivMessage(data.character, "Wrong spelling of body parts or attack/defense. Use one of the following: lips, fingers, tits, sex, ass, feet. Example: !train attack on fingers");
			return 0;
		}
		var destiny = (atkORdef == "attack" ? "atk" : "def") + part;
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var pj = new Personaje(chara);
			if (pj.train(destiny)) {
				fChatLibInstance.sendPrivMessage(data.character, "[eicon]training[/eicon] Training successful! You now have " + pj[destiny] + " points in " + atkORdef + " on " + part + ".");
				client.hmset(data.character, pj.getSaveFile());
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "Not enough money (Cost: $10.00) or you have maxed out that part (Max wihout items: 5).");
			}
		});
	}
	
	cmdHandler.indulge = function (args, data) {
		if (data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "This command only works in private to avoid spam, use it here.");
			return 0;
		}
		var arr = args.split(' on ');
		var atkORdef = arr[0];
		var part = arr[1];
		if (!( ( (part == "lips" || part == "fingers" || part == "tits" || part == "sex" || part == "ass" || part == "feet") && (atkORdef == "attack") ) || ( (part == "lips" || part == "tits" || part == "sex" || part == "ass") && (atkORdef == "defense") ) )) {
			fChatLibInstance.sendPrivMessage(data.character, "Wrong spelling of body parts or attack/defense. Use one of the following: lips, fingers, tits, sex, ass, feet. Example: !train attack on fingers");
			return 0;
		}
		var destiny = (atkORdef == "attack" ? "atk" : "def") + part;
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var pj = new Personaje(chara);
			if (pj.indulge(destiny)) {
				fChatLibInstance.sendPrivMessage(data.character, "Indulging successful! You now have " + pj[destiny] + " points in " + atkORdef + " on " + part + ".");
				client.hmset(data.character, pj.getSaveFile());
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "You have the least ammount on that part (Min wihout items: -3).");
			}
		});
	}
	
	cmdHandler.sheetcolors = function (args, data) {
		var arr = args.split(' and ');
		var color1 = arr[0];
		var color2 = arr[1];
		var colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"];
		
		if (colores.indexOf(color1) == -1 || colores.indexOf(color2) == -1) {
			var message = "Wrong colors, valid colors are: red, blue, white, yellow, pink, gray, green, orange, purple, black, brown and cyan.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			chara.color1 = color1;
			chara.color2 = color2;
			client.hmset(data.character, chara);
			var message = "Colors changed!";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	//****************************
	//Combat commands
	//****************************
	
	cmdHandler.ready = function (args, data) {
		if (data.publico == false) { return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var pj = new Personaje(chara);
			if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
			if (Combate.addActor(pj)) {
				hoja = "\n";
				hoja += "[color=gray]═════════════ ⭐ [color=purple]Sexfight ring[/color] ⭐ ═════════════\n";
				hoja += "          [icon]" + data.character + "[/icon] Has entered the ring![/color]";
				var cantidad = parseInt(args);
				if (!isNaN(cantidad) || cantidad > 1) { pj.removeHP(100 - cantidad); hoja += " [color=yellow]Starting with "+cantidad+" lust points.[/color]"; }
				hoja += "\n          [color=gray]Sextoy: "+pj.weapon.name+", Outfit: "+pj.armor.name+", Accessory: "+pj.item.name+", Other: "+pj.flavorr.name+".[/color]";
				fChatLibInstance.sendMessage(hoja, channel);
				if (Combate.actores.length == 2) {
					Combate.initiative();
					var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the sexfight ring! Today we have " + Combate.actores[0].name + " vs " + Combate.actores[1].name + "! Let the match begin![/color]";
					message += Combate.status();
					fChatLibInstance.sendMessage(message, channel);
				}
			} else {
				fChatLibInstance.sendMessage("Already joined.", channel);
			}
		});
	}
	
	cmdHandler.readyshort = function (args, data) {
		if (data.publico == false) { return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			var pj = new Personaje(chara);
			pj.removeHP(50);
			if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
			if (Combate.addActor(pj)) {
				hoja = "\n";
				hoja += "[color=gray]═════════════ ⭐ [color=purple]Sexfight ring[/color] ⭐ ═════════════\n";
				hoja += "          [icon]" + data.character + "[/icon] Has entered the ring![/color]";
				hoja += " [color=yellow]Starting with 50 lust points.[/color]";
				hoja += "\n          [color=gray]Sextoy: "+pj.weapon.name+", Outfit: "+pj.armor.name+", Accessory: "+pj.item.name+", Other: "+pj.flavorr.name+".[/color]";
				fChatLibInstance.sendMessage(hoja, channel);
				if (Combate.actores.length == 2) {
					Combate.initiative();
					var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the sexfight ring! Today we have " + Combate.actores[0].name + " vs " + Combate.actores[1].name + "! Let the match begin![/color]";
					message += Combate.status();
					fChatLibInstance.sendMessage(message, channel);
				}
			} else {
				fChatLibInstance.sendMessage("Already joined.", channel);
			}
		});
	}
	
	cmdHandler.readyeven = function (args, data) {
		if (data.publico == false) { return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				var message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			chara.atklips = 1; chara.atkfingers = 1; chara.atktits = 1; chara.atksex = 1; chara.atkass = 1; chara.atkfeet = 1; chara.deflips = 1; chara.deftits = 1; chara.defsex = 1; chara.defass = 1; chara.wornArmor = "0"; chara.wornWeapon = "100"; chara.wornItem = "200"; chara.wornFlavor = "300";
			var pj = new Personaje(chara);
			if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
			if (Combate.addActor(pj)) {
				hoja = "\n";
				hoja += "[color=gray]═════════════ ⭐ [color=purple]Sexfight ring[/color] ⭐ ═════════════\n";
				hoja += "          [icon]" + data.character + "[/icon] Has entered the ring![/color]";
				hoja += " [color=yellow]Starting with default stats and items.[/color]";
				fChatLibInstance.sendMessage(hoja, channel);
				if (Combate.actores.length == 2) {
					Combate.initiative();
					var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the sexfight ring! Today we have " + Combate.actores[0].name + " vs " + Combate.actores[1].name + "! Let the match begin![/color]";
					message += Combate.status();
					fChatLibInstance.sendMessage(message, channel);
				}
			} else {
				fChatLibInstance.sendMessage("Already joined.", channel);
			}
		});
	}
	
	cmdHandler.attack = function (args, data) {
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (Combate.activeActor() != data.character) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			var arr = args.split(' to ');
			var origin = arr[0];
			var destiny = arr[1];
			var message = Combate.attack(origin, destiny);
			fChatLibInstance.sendMessage(message, channel);
			if (Combate.started == false) {
				client.hgetall(Combate.actores[1].name, function (err, chara1) {
					var pj1 = new Personaje(chara1);
					pj1.addGold(2);
					client.hmset(pj1.name, pj1.getSaveFile());
				});
				client.hgetall(Combate.actores[0].name, function (err, chara2) {
					var pj2 = new Personaje(chara2);
					pj2.addGold(1);
					client.hmset(pj2.name, pj2.getSaveFile());
				});
				Combate.reset();
			}
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			var arr = args.split(' to ');
			var origin = arr[0];
			var destiny = arr[1];
			var message = gyms[data.character].attack(origin, destiny); //ataque del player hacia el bot
			if (gyms[data.character].activeActor() == data.character) { //ataque fallido
				fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { var botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { var botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { var botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { var botname = "emily"; }
			var resultado_logica = logica_dummy(data, origin, destiny, botname);
			message += resultado_logica.message1;
			fChatLibInstance.sendPrivMessage(data.character, message);
			message = "\n";
			if (gyms[data.character].started) { //el bot sigue vivo
				if (resultado_logica.pass == true) {
					//el bot tiene que pasar el turno
					gyms[data.character].nextActor();
					message = "\n[icon]Bot Announcer[/icon][color=gray]" + gyms[data.character].actores[1].name + " passed their turn![/color]";
					message += gyms[data.character].status();
					fChatLibInstance.sendPrivMessage(data.character, message);
					return 0;
				}
				message += resultado_logica.message2;
				message += gyms[data.character].attack(resultado_logica.origin2, resultado_logica.destiny2); //ataque del bot hacia el player
				if (gyms[data.character].started == false) { //el player ha muerto XD
					message += resultado_logica.win;
					client.hgetall(data.character, function (err, chara) {
						var pj = new Personaje(chara);
						pj.addGold(1);
						client.hmset(data.character, pj.getSaveFile());
					});
					gyms[data.character] = undefined;
				}
			} else { //el bot ha muerto XD
				message += resultado_logica.loss;
				if (botname == "milly") { var dinero = 6; message += "\nYou get $4.00 extra for defeating the boss!"; } else { var dinero = 2; }
				client.hgetall(data.character, function (err, chara) {
					var pj = new Personaje(chara);
					pj.addGold(dinero);
					client.hmset(data.character, pj.getSaveFile());
				});
				gyms[data.character] = undefined;
			}
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	cmdHandler.pass = function (args, data) {
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (Combate.activeActor() != data.character) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			Combate.nextActor();
			var message = "\n[icon]Bot Announcer[/icon][color=gray]" + Combate.actores[1].name + " passed their turn![/color]";
			message += Combate.status();
			fChatLibInstance.sendMessage(message, channel);
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			gyms[data.character].nextActor();
			var message = "\n[icon]Bot Announcer[/icon][color=gray]" + gyms[data.character].actores[1].name + " passed their turn![/color]";
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { var botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { var botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { var botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { var botname = "emily"; }
			var resultado_logica = logica_dummy(data, "sex", "sex", botname);
			message += resultado_logica.message3 + resultado_logica.message2;
			message += gyms[data.character].attack(resultado_logica.origin2, resultado_logica.destiny2);
			if (gyms[data.character].started == false) { //si pierdes ante el bot
				message += resultado_logica.win;
				client.hgetall(data.character, function (err, chara) {
					var pj = new Personaje(chara);
					pj.addGold(1);
					client.hmset(data.character, pj.getSaveFile());
				});
				gyms[data.character] = undefined;
			}
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	cmdHandler.giveup = function (args, data) {
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (Combate.activeActor() != data.character) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			var message = "\n[icon]Bot Announcer[/icon][color=gray]" + Combate.actores[0].name + " has given up and/or climaxed earlier! The winner gets $1.00 and the loser gets nothing, thank you for participating.[/color]";
			message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
			fChatLibInstance.sendMessage(message, channel);
			client.hgetall(Combate.actores[1].name, function (err, chara1) {
				var pj1 = new Personaje(chara1);
				pj1.addGold(1);
				client.hmset(pj1.name, pj1.getSaveFile());
			});
			Combate.reset();
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { var botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { var botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { var botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { var botname = "emily"; }
			var resultado_logica = logica_dummy(data, "lips", "lips", botname);
			var message = "\n[icon]Bot Announcer[/icon][color=gray]" + Combate.actores[0].name + " has given up and/or climaxed earlier! The loser gets nothing, thank you for participating.[/color]";
			message += "\n[color=gray]════════════════ ⭐ [color=purple]Training ended[/color] ⭐ ════════════════[/color]\n";
			message += resultado_logica.win;
			gyms[data.character] = undefined;
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	cmdHandler.endfight = function (args, data) {
		if (data.publico) {
			if (Combate.actores.length > 0) {
				Combate.reset();
				fChatLibInstance.sendMessage("Combat ended!", channel);
			}
		} else {
			if (gyms[data.character] != undefined) {
				gyms[data.character] = undefined;
				fChatLibInstance.sendPrivMessage(data.character, "Training ended!");
			}
		}
	}
	
	cmdHandler.status = function (args, data) {
		if (data.publico) {
			var message = Combate.status();
			fChatLibInstance.sendMessage(message, channel);
		} else {
			if (gyms[data.character] != null) {
				fChatLibInstance.sendPrivMessage(data.character, gyms[data.character].status())
			}
		}
	}
	
	cmdHandler.strip = function (args, data) {
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (Combate.activeActor() != data.character) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			var message = Combate.strip();
			fChatLibInstance.sendMessage(message, channel);
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			var message = gyms[data.character].strip(); //ataque del player hacia el bot
			if (gyms[data.character].activeActor() == data.character) { //ataque fallido
				fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { var botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { var botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { var botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { var botname = "emily"; }
			var resultado_logica = logica_dummy(data, origin, destiny, botname);
			//message += resultado_logica.message1; //AÑADIR EMOTES PARA EL MOMENTO DE PERDER LA ROPA? QUISAS?
			fChatLibInstance.sendPrivMessage(data.character, message);
			message = "\n";
			message += resultado_logica.message2;
			message += gyms[data.character].attack(resultado_logica.origin2, resultado_logica.destiny2); //ataque del bot hacia el player
			if (gyms[data.character].started == false) { //el player ha muerto XD
				message += resultado_logica.win;
				client.hgetall(data.character, function (err, chara) {
					var pj = new Personaje(chara);
					pj.addGold(1);
					client.hmset(data.character, pj.getSaveFile());
				});
				gyms[data.character] = undefined;
			}
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	//**************************** Combate.actores[0].name, Combate.actores[1].name], HP: [Combate.actores[0].HP, Combate.actores[1].HP]
	//Save and load commands
	//****************************
	
	cmdHandler.saveFight = function (args, data) {
		if (data.publico == false) { return 0; }
		var persona = data.character;
		//if (fChatLibInstance.isUserChatOP(data.character, channel)) { persona = "esta persona es un administrador con poderes sobre humanos"; }
		if (Combate.started == false) { fChatLibInstance.sendMessage("There is no match going on to be saved.", channel); return 0; }
		//if (!(Combate.actores[0].name == persona || Combate.actores[1].name == persona || persona == "esta persona es un administrador con poderes sobre humanos")) { fChatLibInstance.sendMessage("You're not a participant of the current match.", channel); return 0; }
		var saveName = Combate.actores[0].name + " VS " + Combate.actores[1].name + " on " + now().format("dddd, MMMM Do YYYY, h:mm a") + " (GMT -6)";
		var data = loadData();
		var newData = { actores: [Combate.actores[0].name, Combate.actores[1].name], HP: [Combate.actores[0].HP, Combate.actores[1].HP], nombre: saveName };
		data.push(newData);
		saveData(data);
		Combate.reset();
		fChatLibInstance.sendMessage("Match saved! To get a list of saved matches, use !savedfights", channel);
	}
	
	cmdHandler.savedFights = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		var datas = loadData();
		if (datas.length == 0) { fChatLibInstance.sendMessage("There are no saved fights.", channel); return 0; }
		var message = "\nList of saved fights:\n";
		for (var i = 0; i < datas.length; i++) {
			message += "          ► " + (i+1) + ": " + datas[i].nombre + "\n";
		}
		message += "To load a fight, use the command !loadfight followed by the number of the fight you want to load. Example: !loadfight 3";
		data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
	}
	
	cmdHandler.loadFight = function (args, data) {
		if (data.publico == false) { return 0; }
		if (Combate.started) { fChatLibInstance.sendMessage("There is a match already going on.", channel); return 0; }
		var numero = parseInt(args);
		if (isNaN(numero) || numero < 1) { fChatLibInstance.sendMessage("Invalid save slot number.", channel); return 0; }
		var persona = data.character;
		//if (fChatLibInstance.isUserChatOP(data.character, channel)) { persona = "esta persona es un administrador con poderes sobre humanos"; }
		var datas = loadData();
		if (datas.length == 0) { fChatLibInstance.sendMessage("There are no saved fights.", channel); return 0; }
		if (numero > datas.length) { fChatLibInstance.sendMessage("You selected a number higher than the maximum number of saved fights", channel); return 0; }
		//if (datas[(numero-1)].actores[0] != persona && datas[(numero-1)].actores[1] != persona && persona != "esta persona es un administrador con poderes sobre humanos") { fChatLibInstance.sendMessage("You're not a participant of that match or an admin.", channel); return 0; }
		var message = "Resuming match!\n";
		client.hgetall(datas[(numero-1)].actores[0], function (err, chara1) {
			client.hgetall(datas[(numero-1)].actores[1], function (err, chara2) {
				var pj1 = new Personaje(chara1);
				var pj2 = new Personaje(chara2);
				pj1.removeHP(100 - datas[(numero-1)].HP[0]);
				pj2.removeHP(100 - datas[(numero-1)].HP[1]);
				Combate.addActor(pj1);
				Combate.addActor(pj2);
				datas.splice((numero-1), 1);
				saveData(datas);
				Combate.startFight();
				message += Combate.status();
				fChatLibInstance.sendMessage(message, channel);
			});
		});
	}
	
	//****************************
	//Dummy commands
	//****************************
	
	cmdHandler.succuboss = function (args, data) {
		if (args != "male" && args != "female" && args != "shemale" && args != "herm") {
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm."); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			var pj = new Personaje(chara);
			if (pj.dailyCheck() == false) { fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum ammount of times you can fight the bot per day, come back tomorrow~"); return 0; }
			if (pj.Gold < 2) { fChatLibInstance.sendPrivMessage(data.character, "You can't afford fighting the boss, it costs $2.00, but you get $6.00 if you win."); return 0; }
			client.hgetall("Milly The Succubot", function (err, dummy) {
				//hay que guardar los datos de pj
				pj.addGold(-2);
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				var dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor(pj);
				gyms[data.character].addActor(dmy);
				gyms[data.character].setGender(args);
				var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the boss fight! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
				gyms[data.character].startFight();
				message += gyms[data.character].status();
				//añadir intro
				if (args == "male") { message+= milly.special.male_intro; }
				if (args == "female") { message+= milly.special.female_intro; }
				if (args == "shemale" || args == "herm") { message+= milly.special.other_intro; }
				fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	}
	
	cmdHandler.trainingdummy = function (args, data) {
		if (args != "male" && args != "female" && args != "shemale" && args != "herm") {
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm."); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			var pj = new Personaje(chara);
			if (pj.dailyCheck() == false) {
				fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum ammount of times you can fight the bot per day, come back tomorrow~"); return 0;
			}
			client.hgetall("Yuni Hermit", function (err, dummy) {
				//hay que guardar los datos de pj
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				var dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor(pj);
				gyms[data.character].addActor(dmy);
				gyms[data.character].setGender(args);
				var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the training ring! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
				gyms[data.character].startFight();
				message += gyms[data.character].status();
				fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	}
	
	cmdHandler.trainingdummy2 = function (args, data) {
		if (args != "male" && args != "female" && args != "shemale" && args != "herm") {
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm."); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			var pj = new Personaje(chara);
			if (pj.dailyCheck() == false) {
				fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum ammount of times you can fight the bot per day, come back tomorrow~"); return 0;
			}
			client.hgetall("Sissy Robert Bot", function (err, dummy) {
				//hay que guardar los datos de pj
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				var dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor(pj);
				gyms[data.character].addActor(dmy);
				gyms[data.character].setGender(args);
				var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the training ring! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
				gyms[data.character].startFight();
				message += gyms[data.character].status();
				fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	}
	
	/* cmdHandler.trainingdummy3 = function (args, data) {
		if (args != "male" && args != "female" && args != "shemale" && args != "herm") {
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm."); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			var pj = new Personaje(chara);
			if (pj.dailyCheck() == false) {
				fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum ammount of times you can fight the bot per day, come back tomorrow~"); return 0;
			}
			client.hgetall("Boxing Emily Bot", function (err, dummy) {
				//hay que guardar los datos de pj
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				var dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor(pj);
				gyms[data.character].addActor(dmy);
				gyms[data.character].setGender(args);
				var message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the training ring! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
				gyms[data.character].startFight();
				message += gyms[data.character].status();
				message+= emily.special.intro;
				fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	} */
	
	cmdHandler.time2dummy = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				var pj = new Personaje(chara);
				var fecha = Date.now();
				var diferencia = fecha - pj.lastpost;
				var restante = 79200000 - diferencia;
				if (restante < 0) { restante = 0; }
				var tiempo = restante / (1000 * 60 * 60);
				var horas = Math.floor(tiempo);
				var minutos = Math.floor((tiempo - horas) * 60);
				var segundos = Math.floor((((tiempo - horas) * 60) - minutos) * 60);
				fChatLibInstance.sendPrivMessage(data.character, "You can fight the bot again in " + horas + "h " + minutos + "m " + segundos + "s.");
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club.");
			}
		});
	}
	
	//****************************
	//Shops
	//****************************
	
	cmdHandler.outfits = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			var message = generar_tienda(items, 1, 99, "Outfit store", "👘");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.sextoys = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			var message = generar_tienda(items, 101, 199, "Sex Shop", "⚒️");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.accessories = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			var message = generar_tienda(items, 201, 299, "General store", "📿");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.yunishop = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			var hoja = "\n[color=gray]";
			hoja +="════════════════════════════════════════════════════════════════════════════════════════════════════\n[color=purple]";
			hoja +="                                                                                      🐺 🐺 [b]Yuni Hermit[/b] 🐺 🐺[/color]\n";
			hoja +="════════════════════════════════════════════════════════════════════════════════════════════════════\n[color=pink]";
			hoja +="          [icon]Yuni Hermit[/icon]\n";
			hoja +="          [b]'Welcome to the Sub Shop! What? No, we sell submissive gear, not sandwiches. If you've got a favorite weak spot, and\n";
			hoja +="want something to direct your dominants at your most sensitive bits, we probably have some gear for you here! If we don't\n";
			hoja +="have what you want, feel free to shoot a suggestion at my manager, and we might add it to our catalogue.\n";
			hoja +="          Now how can I service you? Er, help you. How can I help you?'[/b]\n";
			for (var i = 0; i < items.length; i++) {
				hoja += entrada(items, i, 301, 399);
			}
			hoja += "[/color][/color]";
			data.publico ? fChatLibInstance.sendMessage(hoja, channel) : fChatLibInstance.sendPrivMessage(data.character, hoja);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.addictions = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			var message = generar_tienda(items, 401, 499, "Addictions", "❤️");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	//****************************
	//Listeners
	//****************************
	
	/* fChatLibInstance.addPrivateMessageListener(function(parent, data) {
		if (data && data.message && data.message.length > 2 && data.message[0] == '!') {

			var opts = {
				command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
				argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
			};
			
			var newData = data;
			newData.publico = false;
			
			if (typeof cmdHandler[opts.command] === 'function') {
				cmdHandler[opts.command](opts.argument, newData);
			} else {
				//not found
			}
		}
	}); */
	
    return cmdHandler;
};

function logica_dummy(data, origin, destiny, botname) {
	
	var win = ""; var loss = ""; var pass = false;
	
	if (botname == "emily") {
		//1, calcular el emote de recepción de daño
		var dest = ["lips","ass"];
		var bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//var dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		var dict_sex_penis = ["cock","shaft","dick","penis"];
		var origin1 = searchOrigins(origin);
		if (origin1 == "sex") {
			if (gyms[data.character].gender == "male") { origin1 = "penis"; }
			if (gyms[data.character].gender == "female") { origin1 = "vagina"; }
			if (gyms[data.character].gender == "shemale") { origin1 = "penis"; }
			if (gyms[data.character].gender == "herm") {
				if (dict_sex_penis.indexOf(origin) != -1) {
					origin1 = "penis";
				} else {
					if (origin == "sex") {
						origin1 = bits.herm[Math.floor(Math.random() * 2)];
					} else {
						origin1 = "vagina";
					}
				}
			}
		}
		var destiny1 = searchDestinies(destiny);
		
		var message1 = "[i]" + emily.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		var origenes = ["lips","punch","tits","sex","ass","feet","tail"];
		var destinos = dest.concat(bits[gyms[data.character].gender]);
		var origin2 = origenes[Math.floor(Math.random() * 7)];
		var destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		var message2 = "\n[i]" + emily.attacks[origin2][destiny2] + "[/i]";
		// mensajes
		var message3 = "\n[i]";
		message3 += emily.special.pass;
		win += emily.special.win;
		loss += emily.special.loss;
		message3 += "[/i]\n";
	}
	
	if (botname == "robert") {
		//1, calcular el emote de recepción de daño
		var dest = ["lips","ass"];
		var bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//var dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		var dict_sex_penis = ["cock","shaft","dick","penis"];
		var origin1 = searchOrigins(origin);
		if (origin1 == "sex") {
			if (gyms[data.character].gender == "male") { origin1 = "penis"; }
			if (gyms[data.character].gender == "female") { origin1 = "vagina"; }
			if (gyms[data.character].gender == "shemale") { origin1 = "penis"; }
			if (gyms[data.character].gender == "herm") {
				if (dict_sex_penis.indexOf(origin) != -1) {
					origin1 = "penis";
				} else {
					if (origin == "sex") {
						origin1 = bits.herm[Math.floor(Math.random() * 2)];
					} else {
						origin1 = "vagina";
					}
				}
			}
		}
		var destiny1 = searchDestinies(destiny);
		
		var message1 = "[i]" + robert.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		var origenes = ["lips","fingers","tits","sex","ass","feet"];
		var destinos = dest.concat(bits[gyms[data.character].gender]);
		var origin2 = origenes[Math.floor(Math.random() * 6)];
		var destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		var message2 = "[i]" + robert.attacks[origin2][destiny2] + "[/i]";
		//if (destiny2 == "penis" || destiny2 == "vagina") { destiny2 = "sex"; }
		var message3 = "\n[i]Robert giggles to himself. 'You want more? Okay... come here!' He beckons with one hand, staring hungrily at your body and licking his lips.[/i]\n";
	}
	
	
	if (botname == "yuni") {
		//1, calcular el emote de recepción de daño
		var dest = ["lips","ass"];
		var bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//var dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		var dict_sex_penis = ["cock","shaft","dick","penis"];
		var origin1 = searchOrigins(origin);
		if (origin1 == "sex") {
			if (gyms[data.character].gender == "male") { origin1 = "penis"; }
			if (gyms[data.character].gender == "female") { origin1 = "vagina"; }
			if (gyms[data.character].gender == "shemale") { origin1 = "penis"; }
			if (gyms[data.character].gender == "herm") {
				if (dict_sex_penis.indexOf(origin) != -1) {
					origin1 = "penis";
				} else {
					if (origin == "sex") {
						origin1 = bits.herm[Math.floor(Math.random() * 2)];
					} else {
						origin1 = "vagina";
					}
				}
			}
		}
		var destiny1 = searchDestinies(destiny);
		
		var message1 = "[i]" + yuni.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		var origenes = ["lips","fingers","tits","sex","ass","feet"];
		var destinos = dest.concat(bits[gyms[data.character].gender]);
		var origin2 = origenes[Math.floor(Math.random() * 6)];
		var destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		var message2 = "[i]" + yuni.attacks[origin2][destiny2] + "[/i]";
		//if (destiny2 == "penis" || destiny2 == "vagina") { destiny2 = "sex"; }
		var message3 = "\n[i]Yuni giggles to herself. 'You want more, Sugar? Okay... come here, Cutie.' She beckons with one paw, staring hungrily at your body and licking her lips.[/i]\n";
	}
	
	if (botname == "milly") {
		//1, calcular el emote de recepción de daño
		var dest = ["lips","ass"];
		var bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//var dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		var dict_sex_penis = ["cock","shaft","dick","penis"];
		var origin1 = searchOrigins(origin);
		if (origin1 == "sex") {
			if (gyms[data.character].gender == "male") { origin1 = "penis"; }
			if (gyms[data.character].gender == "female") { origin1 = "vagina"; }
			if (gyms[data.character].gender == "shemale") { origin1 = "penis"; }
			if (gyms[data.character].gender == "herm") {
				if (dict_sex_penis.indexOf(origin) != -1) {
					origin1 = "penis";
				} else {
					if (origin == "sex") {
						origin1 = bits.herm[Math.floor(Math.random() * 2)];
					} else {
						origin1 = "vagina";
					}
				}
			}
		}
		var destiny1 = searchDestinies(destiny);
		if (destiny == "tail") { destiny1 = "tail"; if (origin1 == "ass" || origin1 == "penis") { pass = false; } else { pass = true; } }
		var message1 = "[i]" + milly.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		var origenes = ["lips","fingers","tits","sex","ass","feet","tail"];
		var destinos = dest.concat(bits[gyms[data.character].gender]);
		var origin2 = origenes[Math.floor(Math.random() * 7)];
		var destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		var message2 = "\n[i]" + milly.attacks[origin2][destiny2] + "[/i]";
		// mensaje de pass
		var message3 = "\n[i]";
		if (gyms[data.character].gender == "male") {
			message3 += milly.special.male_pass;
			win += milly.special.male_win;
			loss += milly.special.male_loss;
		}
		if (gyms[data.character].gender == "female") {
			message3 += milly.special.female_pass;
			win += milly.special.female_win;
			loss += milly.special.female_loss;
		}
		if (gyms[data.character].gender == "shemale" || gyms[data.character].gender == "herm") {
			message3 += milly.special.other_pass;
			win += milly.special.other_win;
			loss += milly.special.other_loss;
		}
		message3 += "[/i]\n";
	}
	
	var resultado_logica = { message1: message1, message2: message2, message3: message3, origin2: origin2, destiny2: destiny2, win: win, loss: loss, pass: pass };
	return resultado_logica;
}

function generar_ayuda() {
	var hoja = fs.readFileSync("./help.txt", "utf8");
	return hoja;
}

function generar_tienda(lista, minId, maxId, store, emoji) {
	var hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n[color=purple]";
	hoja +="                                 " + emoji + " " + emoji + " [b]" + store + "[/b] " + emoji + " " + emoji + "[/color]\n";
	hoja +="══════════════════════════════════════════════════\n[color=pink]";
	for (var i = 0; i < items.length; i++) {
		hoja += entrada(lista, i, minId, maxId);
	}
	hoja += "[/color][/color]";
	return hoja;
}

function generar_hoja_chica(pj) { 
	var color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	var color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	var hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Character card[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]" + pj.name + "[/icon]\n";
	hoja +="          [b]Name:[/b] " + pj.name + " | [b]Money:[/b] $" + pj.Gold + ".00\n";
	hoja +="          [b]Attack:[/b] " + pj.atklips + " Lips, " + pj.atkfingers + " Fingers, " + pj.atktits + " Tits, " + pj.atksex + " Sex, " + pj.atkass + " Ass, " + pj.atkfeet + " Feet.\n";
	hoja +="          [b]Defense:[/b] " + pj.deflips + " Lips, " + pj.deftits + " Tits, " + pj.defsex + " Sex, " + pj.defass + " Ass.\n";
	hoja +="          [b]Sextoy:[/b] " + pj.weapon.name + ". " + generar_stats(pj.weapon) + "\n";
	hoja +="          [b]Outfit:[/b] " + pj.armor.name + ". " + generar_stats(pj.armor) + "\n";
	hoja +="          [b]Accessory:[/b] " + pj.item.name + ". " + generar_stats(pj.item) + "\n";
	hoja +="          [b]Flavor item:[/b] " + pj.flavorr.name + ". " + generar_stats(pj.flavorr) + "\n";
	hoja +="          [b]Addiction:[/b] " + pj.addiction.name + ". " + generar_stats(pj.addiction) + "\n";
	hoja +="[/color][/color]";
	return hoja;
}

function generar_hoja(pj) {
	var color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	var color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	
	var Weapon_stats = generar_stats(pj.weapon);
	var Armor_stats = generar_stats(pj.armor);
	var Item_stats = generar_stats(pj.item);
	var Flavor_stats = generar_stats(pj.flavorr);
	var Addiction_stats = generar_stats(pj.addiction);
	
	var hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]General details[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]" + pj.name + "[/icon]\n";
	hoja +="          [b]Name:[/b] " + pj.name + " | [b]Money:[/b] $" + pj.Gold + ".00\n[/color]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Attack / Defense[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="          [b]Lips:[/b] " + pj.atklips + " / " + pj.deflips + "\n";
	hoja +="          [b]Fingers:[/b] " + pj.atkfingers + "\n";
	hoja +="          [b]Tits:[/b] " + pj.atktits + " / " + pj.deftits + "\n";
	hoja +="          [b]Sex:[/b] " + pj.atksex + " / " + pj.defsex + "\n";
	hoja +="          [b]Ass:[/b] " + pj.atkass + " / " + pj.defass + "\n";
	hoja +="          [b]Feet:[/b] " + pj.atkfeet + "[/color]\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Equipment[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="          [b]Sextoy:[/b] " + pj.weapon.name + "\n";
	hoja +="                    " + Weapon_stats + "\n";
	hoja +="          [b]Outfit:[/b] " + pj.armor.name + "\n";
	hoja +="                    " + Armor_stats + "\n";
	hoja +="          [b]Accessory:[/b] " + pj.item.name + "\n";
	hoja +="                    " + Item_stats + "\n";
	hoja +="          [b]Flavor item:[/b] " + pj.flavorr.name + "\n";
	hoja +="                    " + Flavor_stats + "\n";
	hoja +="          [b]Addiction:[/b] " + pj.addiction.name + "\n";
	hoja +="                    " + Addiction_stats + "\n[/color]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Inventory[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	
	for (var i = 0; i < pj.equipment.length; i++) {
		hoja +="          " + pj.equipment[i].name + ". " + generar_stats(pj.equipment[i]) + "\n";
	}
	
	hoja += "[/color][/color]";
	return hoja;
}

function generar_stats(objeto) {  
	var message = [];
	if (objeto.deflips != null) 	{ message.push(signo(objeto.deflips) + " defense to lips"); }
	if (objeto.deftits != null)		{ message.push(signo(objeto.deftits) + " defense to tits"); }
	if (objeto.defsex != null)		{ message.push(signo(objeto.defsex) + " defense to sex"); }
	if (objeto.defass != null)		{ message.push(signo(objeto.defass) + " defense to ass"); }
	
	if (objeto.atklips != null) 	{ message.push(signo(objeto.atklips) + " attack to lips"); }
	if (objeto.atkfingers != null) 	{ message.push(signo(objeto.atkfingers) + " attack to fingers"); }
	if (objeto.atktits != null) 	{ message.push(signo(objeto.atktits) + " attack to tits"); }
	if (objeto.atksex != null) 		{ message.push(signo(objeto.atksex) + " attack to sex"); }
	if (objeto.atkass != null) 		{ message.push(signo(objeto.atkass) + " attack to ass"); }
	if (objeto.atkfeet != null) 	{ message.push(signo(objeto.atkfeet) + " attack to feet"); }
	
	if (objeto.hp != null)		{ message.push(signo(objeto.hp) + " endurance"); }
	if (objeto.flavor != null)	{ message.push(objeto.flavor); }
	if (message.length > 0) { message = message.join(", ") + "."; } else { message = ""; }
	return message;
}

//funcion para generar entrada de la tienda
function entrada(lista, indice, minId, maxId) {
	var message = "";
	var objeto = lista[indice];
	if (objeto.id >= minId && objeto.id <= maxId) {
		//genera entrada
		message += "          ► $" + objeto.Gold + ".00 - " + objeto.name + " (" + generar_stats(objeto) + ")\n";
	}
	return message;
}

//buscar por nombre
function busca(lista, nombre) {
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].name.toLowerCase() == nombre.toLowerCase()) {
            return lista[i];
        }
    }
    return -1;
}

//buscar por id
function buscaId(lista, nombre) {
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == nombre) {
            return lista[i];
        }
    }
    return -1;
}

function parseStringToIntArray(myString) {
    var myArray = myString.split(",");
    for (var i = 0; i < myArray.length; i++) {
        if (!isNaN(myArray[i]) && myArray[i] != "") {
            myArray[i] = parseInt(myArray[i]);
        }
        else {
            myArray.splice(i, 1);
        }
    }
    return myArray;
}

function signo(x) { return x > 0 ? "+" + x : x; }

function loadData() {
	try {
		if (fs.statSync(saveDir+saveFile)) {
			return jsonfile.readFileSync(saveDir+saveFile);
		} else {
			return [];
		}
	}
	catch(err){
		return [];
	}
}

function saveData(data) {
	if (!fs.existsSync(saveDir)){
		fs.mkdirSync(saveDir);
	}
	jsonfile.writeFile(saveDir+saveFile, data);
}

function searchDestinies(part) {
	var bodyparts = require('./etc/bodyparts.js');
	var destinies = bodyparts.destinies;
	var categorias = Object.keys(destinies);
	for (var i = 0; i < categorias.length; i++) {
		if (destinies[categorias[i]].indexOf(part) != -1) {
			return categorias[i];
		}
	}
	return "";
}

function searchOrigins(part) {
	var bodyparts = require('./etc/bodyparts.js');
	var origins = bodyparts.origins;
	var categorias = Object.keys(origins);
	for (var i = 0; i < categorias.length; i++) {
		if (origins[categorias[i]].indexOf(part) != -1) {
			return categorias[i];
		}
	}
	return "";
}