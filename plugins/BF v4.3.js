var fChatLibInstance;
var channel;
var now = require('moment');
var jsonfile = require('jsonfile');
var fs = require('fs');
var requireNew = require('require-new');
var saveDir = process.cwd()+"/saves";
var saveFile = "/saves.js";
var saveFile2 = "/trashcan.js";
var redis = require("redis");
var yuni = require('./etc/yuni.js');
var milly = require('./etc/milly.js');
var robert = require('./etc/robert.js');
var emily = require('./etc/emily.js');
var Personaje = require('./etc/personaje.js');
var combate = require('./etc/combate3.js'); ///////////////////////////////////////////////////////////
var Combate = new combate();
var gyms = {};
var client = redis.createClient(6379, "127.0.0.1", {db: 1});
var totalXP = [0,100,500,1200,2200,3500,5000,6700,8500,10500,12600,14900,17300,19800,22500,25300,28200,31200,34300,37500,40800,44200,47700,51300,55000,58800,62600,66500,70500,74600,78800,83000,87300,91700,96200,100700,105300,110000,114700,119500,124400,129300,134300,139400,144500,149700,155000,160300,165700,171100,176600,182200,187800,193500,199200,205000,210800,216700,222700,228700,234800,240900,247100,253300,259600,265900,272300,278700,285200,291700,298300,304900,311600,318300,325100,331900,338800,345700,352700,359700,366800,373900,381100,388300,395500,402800,410100,417500,424900,432400,439900,447500,455100,462700,470400,478100,485900,493700,501600,509500,517400,525400,533400,541500,549600,557700,565900,574100,582400,590700,599000,607400,615800,624300,632800,641300,649900,658500,667100,675800,684500,693300,702100,710900,719800,728700,737600,746600,755600,764700,773800,782900,792100,801300,810500,819800,829100,838400,847800,857200,866600,876100,885600,895200,904800,914400,924100,933800,943500,953300,963100,972900,982800,992700,1002600];
var level = [1,4,7,10,13,15,17,18,20,21,23,24,25,27,28,29,30,31,32,33,34,35,36,37,38,38,39,40,41,42,42,43,44,45,45,46,47,47,48,49,49,50,51,51,52,53,53,54,54,55,56,56,57,57,58,58,59,60,60,61,61,62,62,63,63,64,64,65,65,66,66,67,67,68,68,69,69,70,70,71,71,72,72,72,73,73,74,74,75,75,76,76,76,77,77,78,78,79,79,79,80,80,81,81,81,82,82,83,83,83,84,84,85,85,85,86,86,86,87,87,88,88,88,89,89,89,90,90,91,91,91,92,92,92,93,93,93,94,94,94,95,95,96,96,96,97,97,97,98,98,98,99,99,99,100];
var xpForNext = [8,25,12,131,544,596,832,159,761,148,1224,725,276,2152,1889,1700,1591,1568,1637,1804,2075,2456,2953,3572,4319,519,1400,2421,3588,4907,707,2184,3825,5636,1136,3123,5292,592,2949,5500,600,3351,6308,1208,4377,7764,2464,6075,675,4516,8593,2993,7312,1612,6179,379,5200,10281,4281,9628,3528,9147,2947,8844,2544,8725,2325,8796,2296,9063,2463,9532,2832,10209,3409,11100,4200,12211,5211,13548,6448,15117,7917,717,9724,2424,11775,4375,14076,6576,16633,9033,1433,11852,4152,14939,7139,18300,10400,2500,14041,6041,17968,9868,1768,14087,5887,18604,10304,2004,15125,6725,20256,11756,3256,17203,8603,3,14372,5672,20469,11669,2869,18100,9200,300,15971,6971,23088,13988,4888,21457,12257,3057,20084,10784,1484,18975,9575,175,18136,8636,27073,17473,7873,26792,17092,7392,26799,16999,7199,27100,17200,7300,27701];

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
	
	cmdHandler.createPrivateRoomMeow = function(args, data) {
		parent.sendWS('CCR', { channel: "Private ring for "+data.character+" and "+args });
	}
	
	cmdHandler.viewsheet = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Kaffir") { return 0; }
		client.hgetall(args, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, args + " wasn't found."); return 0;
			}
			let pj = new Personaje(chara);
			let message = generar_hoja(pj);
			fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.viewcard = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Kaffir") { return 0; }
		client.hgetall(args, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, args + " wasn't found."); return 0;
			}
			let pj = new Personaje(chara);
			let message = generar_hoja_chica(pj);
			fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.viewbotstatus = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Kaffir") { return 0; }
		let message = "People training: ";
		let personas = Object.keys(gyms);
		for (let i = 0; i < personas.length; i++) {
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
		let arr = args.split(' to ');
		let cantidad = parseInt(arr[0]);
		let destiny = arr[1];
		if (isNaN(cantidad) || cantidad < 1) {
			let message = "Money amount should be a positive number (without the $ or the .00)";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == undefined) {
			let message = "You must specify a recipient. Example: !sendmoney 3 to Kenia Nya";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara1) {
			if (chara1 == null) {
				let message = "You are not registered.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			client.hgetall(destiny, function (err, chara2) {
				if (chara2 == null) {
					let message = destiny + " wasn't found.";
					data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
					return 0;
				}
				let pj2 = new Personaje(chara2);
				let message = "";
				if (parseInt(chara1.Gold) >= cantidad) {
					if (pj2.dailyMoneyCheck(cantidad) == true) {
						chara1.Gold = parseInt(chara1.Gold) - cantidad;
						pj2.addGold(cantidad);
						client.hmset(data.character, chara1);
						client.hmset(destiny, pj2.getSaveFile());
						message = chara1.name + " has sent $" + cantidad + ".00 to " + pj2.name + ".";
					} else {
						message = "Players can't receive more than $20.00 per day, try again tomorrow~";
					}
				} else {
					message = "You don't have enough money for that trade.";
				}
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	}
	
	cmdHandler.card = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			client.hgetall(data.character, function (err, chara) {
				let message = "You're not registered, use !register to join the club.";
				if (chara != null) {
					let pj = new Personaje(chara)
					message = generar_hoja_chica(pj);
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
				let pj = new Personaje(chara)
				let message = "[noparse]" + generar_hoja_chica(pj) + "[/noparse]";
				fChatLibInstance.sendPrivMessage(data.character, message);
			} else {
				fChatLibInstance.sendMessage("You're not registered, use !register to join the club.", channel);
			}
		});
	}
	
	cmdHandler.sheet = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				let pj = new Personaje(chara)
				let message = generar_hoja(pj);
				fChatLibInstance.sendPrivMessage(data.character, message);
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club.");
			}
		});
	}
	
	cmdHandler.sheetcode = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara != null) {
				let pj = new Personaje(chara)
				let message = "[noparse]" + generar_hoja(pj) + "[/noparse]";
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
		let items = requireNew('./etc/shop.js');
		let itemAsked = busca(items, args);
		if (itemAsked == -1) {
			let message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let costo = itemAsked.Gold;
			let pj = new Personaje(chara);
			let message = "You can't afford that item, you currently have $" + pj.Gold + ".00";
			if (pj.Gold >= costo) {
				pj.addGold(costo * -1);
				pj.giveItem(itemAsked);
				client.hmset(data.character, pj.getSaveFile());
				message = "The item " + args + " has been added to your item list. You now have $" + pj.Gold + ".00 left.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.sell = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		let items = requireNew('./etc/shop.js');
		let itemAsked = busca(items, args);
		if (itemAsked == -1) {
			let message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = "The item " + args + " wasn't found in your inventory or it's a starter item.";
			if (pj.removeItem(itemAsked)) {
				let ganancia = itemAsked.Gold;
				pj.addGold(ganancia);
				client.hmset(data.character, pj.getSaveFile());
				message = "The " + args + " has been sold! " + data.character + " got $" + ganancia + ".00 Back.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.equip = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		let items = requireNew('./etc/shop.js');
		let itemAsked = busca(items, args);
		if (itemAsked == -1) {
			let message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = "The item " + args + " wasn't found in your inventory or cannot be equiped.";
			if (pj.equip(itemAsked)) {
				client.hmset(data.character, pj.getSaveFile());
				message = "The item " + args + " has been equipped.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			let message = "You're already registered.";
			if (reply == 0) {
				let nuevo = {};
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
				nuevo.deffeet = 1;
				
				nuevo.wornArmor = "0";
				nuevo.wornWeapon = "100";
				nuevo.wornItem = "200";
				nuevo.wornFlavor = "300";
				nuevo.ownedItems = "0,100,200,300,400";
				
				nuevo.lastpost = "0";
				nuevo.battlestoday = "0";
				nuevo.wins = "0";
				nuevo.loses = "0";
				
				client.hmset(data.character, nuevo);
				message = data.character + " has joined!";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.resetcharacter = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			let message = "Register first.";
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
				chara.deffeet = 1;
				
				chara.wornArmor = "0";
				chara.wornWeapon = "100";
				chara.wornItem = "200";
				chara.wornFlavor = "300";
				chara.ownedItems = "0,100,200,300,400";
				
				client.hmset(data.character, chara);
				message = data.character + " did a reset on their character!";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.train = function (args, data) {
		if (data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "This command only works in private to avoid spam, use it here.");
			return 0;
		}
		let arr = args.split(' on ');
		let atkORdef = arr[0];
		let part = arr[1];
		if (!( ( (part == "lips" || part == "fingers" || part == "tits" || part == "sex" || part == "ass" || part == "feet") && (atkORdef == "attack") ) || ( (part == "lips" || part == "tits" || part == "sex" || part == "ass" || part == "feet") && (atkORdef == "defense") ) )) {
			fChatLibInstance.sendPrivMessage(data.character, "Wrong spelling of body parts or attack/defense. Use one of the following: lips, fingers, tits, sex, ass, feet. Example: !train attack on fingers");
			return 0;
		}
		let destiny = (atkORdef == "attack" ? "atk" : "def") + part;
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
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
		let arr = args.split(' on ');
		let atkORdef = arr[0];
		let part = arr[1];
		if (!( ( (part == "lips" || part == "fingers" || part == "tits" || part == "sex" || part == "ass" || part == "feet") && (atkORdef == "attack") ) || ( (part == "lips" || part == "tits" || part == "sex" || part == "ass" || part == "feet") && (atkORdef == "defense") ) )) {
			fChatLibInstance.sendPrivMessage(data.character, "Wrong spelling of body parts or attack/defense. Use one of the following: lips, fingers, tits, sex, ass, feet. Example: !train attack on fingers");
			return 0;
		}
		let destiny = (atkORdef == "attack" ? "atk" : "def") + part;
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			if (pj.indulge(destiny)) {
				fChatLibInstance.sendPrivMessage(data.character, "Indulging successful! You now have " + pj[destiny] + " points in " + atkORdef + " on " + part + ".");
				client.hmset(data.character, pj.getSaveFile());
			} else {
				fChatLibInstance.sendPrivMessage(data.character, "You have the least amount on that part (Min wihout items: -3).");
			}
		});
	}
	
	cmdHandler.sheetcolors = function (args, data) {
		let arr = args.split(' and ');
		let color1 = arr[0];
		let color2 = arr[1];
		let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"];
		
		if (colores.indexOf(color1) == -1 || colores.indexOf(color2) == -1) {
			let message = "Wrong colors, valid colors are: red, blue, white, yellow, pink, gray, green, orange, purple, black, brown and cyan.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			chara.color1 = color1;
			chara.color2 = color2;
			client.hmset(data.character, chara);
			let message = "Colors changed!";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.ad = function (args, data) {
		let ad = fs.readFileSync("./ad2.txt", "utf8");
		fChatLibInstance.sendPrivMessage(data.character, "[noparse]"+ad+"[/noparse]");
	}
	
	//****************************
	//Combat commands
	//****************************
	
	cmdHandler.begin = function (args, data) {
		if (data.publico == false) { return 0; }
		if (Combate.teamsf == false) {
			fChatLibInstance.sendMessage("There's no team match set up. Use !ready team red/blue to set it up.", channel);
		}
		fChatLibInstance.sendMessage(Combate.begin(args), channel);
	}
	
	cmdHandler.ready = function (args, data) {
		if (data.publico == false) { return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
			let pj = new Personaje(chara);
			let team = ""; let hp = args;
			if (args.substr(0, 5) == "team ") {
				team = args.substr(5,4).trim();
				if (team != "red" && team != "blue") { fChatLibInstance.sendMessage("Team names should be either red or blue", channel); return 0; }
				hp = args.substr(9).trim();
			}
			let messages = Combate.addActor(pj, hp, team);
			fChatLibInstance.sendMessage(messages[0], channel);
			if (messages[1] != "") { fChatLibInstance.sendMessage(messages[1], channel); }
		});
	}
	
	cmdHandler.readyshort = function (args, data) {
		if (data.publico == false) { return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
			let messages = Combate.addActor(pj, "50", "");
			fChatLibInstance.sendMessage(messages[0], channel);
			if (messages[1] != "") { fChatLibInstance.sendMessage(messages[1], channel); }
		});
	}
	
	cmdHandler.readyeven = function (args, data) {
		if (data.publico == false) { return 0; }
		if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the club.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			chara.atklips = 1; chara.atkfingers = 1; chara.atktits = 1; chara.atksex = 1; chara.atkass = 1; chara.atkfeet = 1; chara.deflips = 1; chara.deftits = 1; chara.defsex = 1; chara.defass = 1; chara.deffeet = 1; chara.wornArmor = "0"; chara.wornWeapon = "100"; chara.wornItem = "200"; chara.wornFlavor = "300";
			let pj = new Personaje(chara);
			let team = ""; let hp = args;
			if (args.substr(0, 5) == "team ") {
				team = args.substr(5,4).trim();
				if (team != "red" && team != "blue") { fChatLibInstance.sendMessage("Team names should be either red or blue", channel); return 0; }
				hp = args.substr(9).trim();
			}
			let messages = Combate.addActor(pj, hp, team);
			fChatLibInstance.sendMessage(messages[0], channel);
			if (messages[1] != "") { fChatLibInstance.sendMessage(messages[1], channel); }
		});
	}
	
	cmdHandler.kiss = function (args, data) { cmdHandler.attack("lips to lips", data); }
	cmdHandler.fuck = function (args, data) { cmdHandler.attack("sex to sex", data); }
	cmdHandler.spank = function (args, data) { cmdHandler.attack("hands to butt", data); }
	cmdHandler.rimjob = function (args, data) { cmdHandler.attack("tongue to ass", data); }
	cmdHandler.sexymoves = function (args, data) { cmdHandler.attack("body to sight", data); }
	cmdHandler.giveanal = function (args, data) { cmdHandler.attack("sex to ass", data); }
	cmdHandler.receiveanal = function (args, data) { cmdHandler.attack("ass to sex", data); }
	cmdHandler.masturbate = function (args, data) { cmdHandler.attack("fingers to sex to me", data); }
	
	cmdHandler.attack = function (args, data) { // pendiente
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (!Combate.activeActor(data.character)) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			let arr = args.split(' to ');
			let origin = arr[0];
			let destiny = arr[1];
			let letra = "meow to meow";
			if (arr.length == 3) { letra = arr[2]; }
			let message = Combate.attack(origin, destiny, letra, data.character);
			fChatLibInstance.sendMessage(message, channel);
			if (Combate.started == false) {
				if (Combate.teamsf == false) {
					client.hgetall(Combate.actores[1].name, function (err, chara1) {
						let pj1 = new Personaje(chara1);
						pj1.addGold(2);
						pj1.addWin();
						client.hmset(pj1.name, pj1.getSaveFile());
					});
					client.hgetall(Combate.actores[0].name, function (err, chara2) {
						let pj2 = new Personaje(chara2);
						pj2.addGold(1);
						pj2.addLose();
						client.hmset(pj2.name, pj2.getSaveFile());
					});
				} else { //darle paga a todos *************************************************************************************************************
					for (let i = 0; i < Combate.actores.length; i++) {
						if (Combate.actores[i].team == Combate.checkVictory()) {
							client.hgetall(Combate.actores[i].name, function (err, chara) {
								let pj = new Personaje(chara);
								pj.addGold(2);
								pj.addWin();
								client.hmset(pj.name, pj.getSaveFile());
							});
						} else {
							client.hgetall(Combate.actores[i].name, function (err, chara) {
								let pj = new Personaje(chara);
								pj.addGold(1);
								pj.addLose();
								client.hmset(pj.name, pj.getSaveFile());
							});
						}
					}
				}
				Combate.reset();
			}
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			let arr = args.split(' to ');
			let origin = arr[0]; if (searchOrigins(origin) == "body") { fChatLibInstance.sendPrivMessage(data.character, "You can't use body to sight on the bots, sorry"); return 0; }
			let destiny = arr[1]; if (searchDestinies(destiny) == "sight") { fChatLibInstance.sendPrivMessage(data.character, "You can't use body to sight on the bots, sorry"); return 0; }
			
			let message = gyms[data.character].attack(origin, destiny, "meow to meow", data.character); //ataque del player hacia el bot
			if (gyms[data.character].activeActor(data.character)) { //ataque fallido
				fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let botname = "yuni";
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { botname = "emily"; }
			let resultado_logica = logica_dummy(data, origin, destiny, botname);
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
				message += gyms[data.character].attack(resultado_logica.origin2, resultado_logica.destiny2, "meow to meow"); //ataque del bot hacia el player
				if (gyms[data.character].started == false) { //el player ha muerto XD
					message += resultado_logica.win;
					client.hgetall(data.character, function (err, chara) {
						let pj = new Personaje(chara);
						pj.addGold(1);
						//pj.addLose();
						client.hmset(data.character, pj.getSaveFile());
					});
					delete gyms[data.character];
				}
			} else { //el bot ha muerto XD
				message += resultado_logica.loss;
				let dinero = 2;
				if (botname == "milly") { dinero = 6; message += "\nYou get $4.00 extra for defeating the boss!"; }
				client.hgetall(data.character, function (err, chara) {
					let pj = new Personaje(chara);
					pj.addGold(dinero);
					client.hmset(data.character, pj.getSaveFile());
				});
				delete gyms[data.character];
			}
			if (message != "") { fChatLibInstance.sendPrivMessage(data.character, message); }
		}
	}
	
	cmdHandler.pass = function (args, data) {
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (!Combate.activeActor(data.character)) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			let message = "\n[icon]Bot Announcer[/icon][color=gray]" + data.character + " passed their turn![/color]";
			Combate.nextActor();
			message += Combate.status();
			fChatLibInstance.sendMessage(message, channel);
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			gyms[data.character].nextActor();
			let message = "\n[icon]Bot Announcer[/icon][color=gray]" + gyms[data.character].actores[1].name + " passed their turn![/color]";
			let botname = "yuni";
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { botname = "emily"; }
			let resultado_logica = logica_dummy(data, "sex", "sex", botname);
			message += resultado_logica.message3 + resultado_logica.message2;
			message += gyms[data.character].attack(resultado_logica.origin2, resultado_logica.destiny2, "meow to meow");
			if (gyms[data.character].started == false) { //si pierdes ante el bot
				message += resultado_logica.win;
				client.hgetall(data.character, function (err, chara) {
					let pj = new Personaje(chara);
					pj.addGold(1);
					client.hmset(data.character, pj.getSaveFile());
				});
				delete gyms[data.character];
			}
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	cmdHandler.giveup = function (args, data) { // pendiente
		if (data.publico) {
			if (Combate.started == false) { fChatLibInstance.sendMessage("Combat hasn't started yet.", channel); return 0; }
			if (!Combate.activeActor(data.character)) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			let message = "\n[icon]Bot Announcer[/icon][color=gray]" + data.character + " has given up and/or climaxed earlier! The winner gets $1.00 and the loser gets nothing, thank you for participating.[/color]";
			message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
			fChatLibInstance.sendMessage(message, channel);
			if (Combate.teamsf == false) {
				client.hgetall(Combate.actores[1].name, function (err, chara1) {
					let pj1 = new Personaje(chara1);
					pj1.addGold(1);
					pj1.addWin();
					client.hmset(pj1.name, pj1.getSaveFile());
				});
				client.hgetall(Combate.actores[0].name, function (err, chara2) {
						let pj2 = new Personaje(chara2);
						pj2.addLose();
						client.hmset(pj2.name, pj2.getSaveFile());
					});
			} else {
				// darle paga a todos **********************************************************************************************************
			}
			Combate.reset();
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			let botname = "yuni";
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { botname = "emily"; }
			let resultado_logica = logica_dummy(data, "lips", "lips", botname);
			let message = "\n[icon]Bot Announcer[/icon][color=gray]" + Combate.actores[0].name + " has given up and/or climaxed earlier! The loser gets nothing, thank you for participating.[/color]";
			message += "\n[color=gray]════════════════ ⭐ [color=purple]Training ended[/color] ⭐ ════════════════[/color]\n";
			message += resultado_logica.win;
			delete gyms[data.character];
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	cmdHandler.endfight = function (args, data) {
		if (data.publico) {
			if (Combate.started == true) {
				let actors = []
				for (let i = 0; i < Combate.actores.length; i++) { actors[i] = Combate.actores[i].name }
				Combate.saveName = actors.toString() + " (match deleted) on " + now().format("dddd, MMMM Do YYYY, h:mm a") + " (GMT -6)";
				let save = loadData2();
				save.push(Combate);
				saveData2(save);
				delete Combate.saveName;
			}
			if (Combate.actores.length > 0) {
				Combate.reset();
				fChatLibInstance.sendMessage("Combat ended!", channel);
			}
		} else {
			if (gyms[data.character] != undefined) {
				delete gyms[data.character];
				fChatLibInstance.sendPrivMessage(data.character, "Training ended!");
			}
		}
	}
	
	cmdHandler.loadFight2 = function (args, data) {
		if (data.publico == false) { return 0; }
		if (Combate.started) { fChatLibInstance.sendMessage("There is a match already going on.", channel); return 0; }
		let numero = parseInt(args);
		if (isNaN(numero) || numero < 1) { fChatLibInstance.sendMessage("Invalid save slot number.", channel); return 0; }
		let save = loadData2();
		if (save.length == 0) { fChatLibInstance.sendMessage("There are no saved fights.", channel); return 0; }
		if (numero > save.length) { fChatLibInstance.sendMessage("You selected a number higher than the maximum number of saved fights", channel); return 0; }
		numero = numero - 1;
		let message = "Resuming match!\n";
		let actores = []; let red = []; let blue = [];
		for (let j = 0; j < save[numero].actores.length; j++) {
			let pj = new Personaje({ownedItems:""});
			let pjsave = save[numero].actores[j];
			let llaves = Object.keys(pjsave);
			for (let i = 0; i < llaves.length; i++) { pj[llaves[i]] = pjsave[llaves[i]]; }
			actores.push(pj);
		}
		for (let j = 0; j < save[numero].red.length; j++) {
			let pj = new Personaje({ownedItems:""});
			let pjsave = save[numero].red[j];
			let llaves = Object.keys(pjsave);
			for (let i = 0; i < llaves.length; i++) { pj[llaves[i]] = pjsave[llaves[i]]; }
			red.push(pj);
		}
		for (let j = 0; j < save[numero].blue.length; j++) {
			let pj = new Personaje({ownedItems:""});
			let pjsave = save[numero].blue[j];
			let llaves = Object.keys(pjsave);
			for (let i = 0; i < llaves.length; i++) { pj[llaves[i]] = pjsave[llaves[i]]; }
			blue.push(pj);
		}
		Combate.loadState(actores, red, blue, save[numero].teamsf, save[numero].teamturn);
		message += Combate.status();
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.status = function (args, data) {
		if (data.publico) {
			let message = Combate.status();
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
			if (!Combate.activeActor(data.character)) { fChatLibInstance.sendMessage("It's not your turn.", channel); return 0; }
			let message = "";
			if (args == "me") {
				message = Combate.strip2(data.character);
			} else {
				message = Combate.strip(args, data.character);
			}
			fChatLibInstance.sendMessage(message, channel);
		} else {
			if (gyms[data.character] == undefined) { return 0; }
			let message = "";
			if (args == "me") {
				message = gyms[data.character].strip2(data.character);
			} else {
				message = gyms[data.character].strip();
			}
			if (gyms[data.character].activeActor(data.character)) { //ataque fallido
				fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let botname = "yuni";
			if (gyms[data.character].actores[0].name == "Yuni Hermit") { botname = "yuni"; }
			if (gyms[data.character].actores[0].name == "Milly The Succubot") { botname = "milly"; }
			if (gyms[data.character].actores[0].name == "Sissy Robert Bot") { botname = "robert"; }
			if (gyms[data.character].actores[0].name == "Boxing Emily Bot") { botname = "emily"; }
			let resultado_logica = logica_dummy(data, "sex", "sex", botname);
			message += resultado_logica.strip; //AÑADIR EMOTES PARA EL MOMENTO DE PERDER LA ROPA? QUISAS?
			fChatLibInstance.sendPrivMessage(data.character, message);
			message = "\n";
			message += resultado_logica.message2;
			message += gyms[data.character].attack(resultado_logica.origin2, resultado_logica.destiny2, "meow to meow"); //ataque del bot hacia el player
			if (gyms[data.character].started == false) { //el player ha muerto XD
				message += resultado_logica.win;
				client.hgetall(data.character, function (err, chara) {
					let pj = new Personaje(chara);
					pj.addGold(1);
					client.hmset(data.character, pj.getSaveFile());
				});
				delete gyms[data.character];
			}
			fChatLibInstance.sendPrivMessage(data.character, message);
		}
	}
	
	//****************************
	//Save and load commands
	//****************************
	
	cmdHandler.saveFight = function (args, data) {
		if (data.publico == false) { return 0; }
		if (Combate.started == false) { fChatLibInstance.sendMessage("There is no match going on to be saved.", channel); return 0; }
		let actors = []
		for (let i = 0; i < Combate.actores.length; i++) { actors[i] = Combate.actores[i].name }
		Combate.saveName = actors.toString() + " on " + now().format("dddd, MMMM Do YYYY, h:mm a") + " (GMT -6)";
		let save = loadData();
		save.push(Combate);
		saveData(save);
		delete Combate.saveName;
		Combate.reset();
		fChatLibInstance.sendMessage("Match saved! To get a list of saved matches, use !savedfights", channel);
	}
	
	cmdHandler.savedFights = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		let save = loadData();
		if (save.length == 0) { fChatLibInstance.sendMessage("There are no saved fights.", channel); return 0; }
		let message = "\nList of saved fights:\n";
		for (let i = 0; i < save.length; i++) {
			message += "          ► " + (i+1) + ": " + save[i].saveName + "\n";
		}
		message += "To load a fight, use the command !loadfight followed by the number of the fight you want to load. Example: !loadfight 3";
		data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
	}
	
	cmdHandler.savedFights2 = function (args, data) {
		if (Combate.started == true && data.publico == true) {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
			return 0;
		}
		let save = loadData2();
		if (save.length == 0) { fChatLibInstance.sendMessage("There are no saved fights.", channel); return 0; }
		let message = "\nList of saved fights (trash can):\n";
		for (let i = 0; i < save.length; i++) {
			message += "          ► " + (i+1) + ": " + save[i].saveName + "\n";
		}
		message += "To load a fight, use the command !loadfight2 followed by the number of the fight you want to load. Example: !loadfight2 3";
		data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
	}
	
	cmdHandler.loadFight = function (args, data) {
		if (data.publico == false) { return 0; }
		if (Combate.started) { fChatLibInstance.sendMessage("There is a match already going on.", channel); return 0; }
		let numero = parseInt(args);
		if (isNaN(numero) || numero < 1) { fChatLibInstance.sendMessage("Invalid save slot number.", channel); return 0; }
		let save = loadData();
		if (save.length == 0) { fChatLibInstance.sendMessage("There are no saved fights.", channel); return 0; }
		if (numero > save.length) { fChatLibInstance.sendMessage("You selected a number higher than the maximum number of saved fights", channel); return 0; }
		numero = numero - 1;
		let message = "Resuming match!\n";
		let actores = []; let red = []; let blue = [];
		for (let j = 0; j < save[numero].actores.length; j++) {
			let pj = new Personaje({ownedItems:""});
			let pjsave = save[numero].actores[j];
			let llaves = Object.keys(pjsave);
			for (let i = 0; i < llaves.length; i++) { pj[llaves[i]] = pjsave[llaves[i]]; }
			actores.push(pj);
		}
		for (let j = 0; j < save[numero].red.length; j++) {
			let pj = new Personaje({ownedItems:""});
			let pjsave = save[numero].red[j];
			let llaves = Object.keys(pjsave);
			for (let i = 0; i < llaves.length; i++) { pj[llaves[i]] = pjsave[llaves[i]]; }
			red.push(pj);
		}
		for (let j = 0; j < save[numero].blue.length; j++) {
			let pj = new Personaje({ownedItems:""});
			let pjsave = save[numero].blue[j];
			let llaves = Object.keys(pjsave);
			for (let i = 0; i < llaves.length; i++) { pj[llaves[i]] = pjsave[llaves[i]]; }
			blue.push(pj);
		}
		Combate.loadState(actores, red, blue, save[numero].teamsf, save[numero].teamturn);
		let save2 = loadData2();
		save2.push(save.splice(numero, 1));
		saveData(save);
		saveData2(save2);
		message += Combate.status();
		fChatLibInstance.sendMessage(message, channel);
	}
	
	//****************************
	//Dummy commands
	//****************************
	
	cmdHandler.succuboss = function (args, data) {
		if (args != "male" && args != "female" && args != "shemale" && args != "herm") {
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm. Example: !succuboss female"); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			let pj = new Personaje(chara);
			if (pj.dailyCheck() == false) { fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum amount of times you can fight the bot per day, come back tomorrow~"); return 0; }
			if (pj.Gold < 2) { fChatLibInstance.sendPrivMessage(data.character, "You can't afford fighting the boss, it costs $2.00, but you get $6.00 if you win."); return 0; }
			client.hgetall("Milly The Succubot", function (err, dummy) {
				//hay que guardar los datos de pj
				pj.addGold(-2);
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				let dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor2(pj);
				gyms[data.character].addActor2(dmy);
				gyms[data.character].setGender(args);
				let message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the boss fight! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
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
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm. Example: !trainingdummy female"); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			let pj = new Personaje(chara);
			if (pj.dailyCheck() == false) {
				fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum amount of times you can fight the bot per day, come back tomorrow~"); return 0;
			}
			client.hgetall("Yuni Hermit", function (err, dummy) {
				//hay que guardar los datos de pj
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				let dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor2(pj);
				gyms[data.character].addActor2(dmy);
				gyms[data.character].setGender(args);
				let message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the training ring! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
				gyms[data.character].startFight();
				message += gyms[data.character].status();
				fChatLibInstance.sendPrivMessage(data.character, message);
			});
		});
	}
	
	cmdHandler.trainingdummy2 = function (args, data) {
		if (args != "male" && args != "female" && args != "shemale" && args != "herm") {
			fChatLibInstance.sendPrivMessage(data.character, "You need to specify your gender. Options: male, female, shemale and herm. Example: !trainingdummy2 female"); return 0;
		}
		if (gyms[data.character] != undefined) {
			fChatLibInstance.sendPrivMessage(data.character, "Training already started! Use !status to see where you are or !endfight to stop the training match."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, "You're not registered, use !register to join the club."); return 0;
			}
			let pj = new Personaje(chara);
			if (pj.dailyCheck() == false) {
				fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum amount of times you can fight the bot per day, come back tomorrow~"); return 0;
			}
			client.hgetall("Sissy Robert Bot", function (err, dummy) {
				//hay que guardar los datos de pj
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				let dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor2(pj);
				gyms[data.character].addActor2(dmy);
				gyms[data.character].setGender(args);
				let message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the training ring! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
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
			let pj = new Personaje(chara);
			if (pj.dailyCheck() == false) {
				fChatLibInstance.sendPrivMessage(data.character, "You reached the maximum amount of times you can fight the bot per day, come back tomorrow~"); return 0;
			}
			client.hgetall("Boxing Emily Bot", function (err, dummy) {
				//hay que guardar los datos de pj
				client.hmset(data.character, pj.getSaveFile());
				//puedes pelear
				let dmy = new Personaje(dummy);
				gyms[data.character] = new combate();
				gyms[data.character].addActor(pj);
				gyms[data.character].addActor(dmy);
				gyms[data.character].setGender(args);
				let message = "\n[icon]Bot Announcer[/icon][color=gray] Welcome to the training ring! Today we have " + gyms[data.character].actores[0].name + " vs " + gyms[data.character].actores[1].name + "! Let the match begin![/color]";
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
				let pj = new Personaje(chara);
				let fecha = Date.now();
				let diferencia = fecha - pj.lastpost;
				let restante = 79200000 - diferencia;
				if (restante < 0) { restante = 0; }
				let tiempo = restante / 3600000;
				let horas = Math.floor(tiempo);
				let minutos = Math.floor((tiempo - horas) * 60);
				let segundos = Math.floor((((tiempo - horas) * 60) - minutos) * 60);
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
			let items = requireNew('./etc/shop.js');
			let message = generar_tienda(items, 1, 99, "Outfit store", "👘");
			if (data.publico == false) { fChatLibInstance.sendPrivMessage(data.character, message); return 0; }
			let lines = 0; let message1 = "";
			for (let i = 0; i < message.length; i++) {
				if (message[i] == "\n") {
					lines += 1;
					if (lines == 15) {
						message1 = message.substring(0, i);
					}
				}
			}
			message1 += "[/color][/color][color=yellow]\nThe outfit list is so big that if you want to see it full, you have to use this command via private message to the bot.[/color]"
			fChatLibInstance.sendMessage(message1, channel);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	//cmdHandler.outfits1 = cmdHandler.outfits;
	/* cmdHandler.outfits2 = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			if (data.publico == false) { return 0; }
			let items = requireNew('./etc/shop.js');
			let message = generar_tienda(items, 1, 99, "Outfit store", "👘");
			let lines = 0; let message1 = "";
			for (let i = 0; i < message.length; i++) {
				if (message[i] == "\n") {
					lines += 1;
					if (lines == 15) {
						message1 = "[color=gray][color=pink]"+message.substring(i);
					}
				}
			}
			fChatLibInstance.sendMessage(message1, channel);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	} */
	
	cmdHandler.sextoys = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop.js');
			let message = generar_tienda(items, 101, 199, "Sex Shop", "⚒️");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.accessories = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop.js');
			let message = generar_tienda(items, 201, 299, "General store", "📿");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	cmdHandler.yunishop = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let hoja = "\n[color=gray]";
			hoja +="════════════════════════════════════════════════════════════════════════════════════════════════════\n[color=purple]";
			hoja +="                                                                                      🐺 🐺 [b]Yuni Hermit[/b] 🐺 🐺[/color]\n";
			hoja +="════════════════════════════════════════════════════════════════════════════════════════════════════\n[color=pink]";
			hoja +="          [icon]Yuni Hermit[/icon]\n";
			hoja +="          [b]'Welcome to the Sub Shop! What? No, we sell submissive gear, not sandwiches. If you've got a favorite weak spot, and\n";
			hoja +="want something to direct your dominants at your most sensitive bits, we probably have some gear for you here! If we don't\n";
			hoja +="have what you want, feel free to shoot a suggestion at my manager, and we might add it to our catalogue.\n";
			hoja +="          Now how can I service you? Er, help you. How can I help you?'[/b]\n";
			let items = requireNew('./etc/shop.js');
			for (let i = 0; i < items.length; i++) {
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
			let items = requireNew('./etc/shop.js');
			let message = generar_tienda(items, 401, 499, "Addictions", "❤️");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private.");
		}
	}
	
	//****************************
	//Listeners
	//****************************
	if (channel == "ADH-5b5393f9514b3c25ab71") {
	//if (channel == "Frontpage") {
		fChatLibInstance.addPrivateMessageListener(function(parent, data) {
			if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
				let opts = {
					command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
					argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
				};
				let newData = data;
				newData.publico = false;
				if (typeof cmdHandler[opts.command] === 'function') {
					cmdHandler[opts.command](opts.argument, newData);
				} else {
					//not found
				}
			}
		});
	}
	
    return cmdHandler;
};

function logica_dummy(data, origin, destiny, botname) {
	
	let win = ""; let loss = ""; let pass = false; let strip = "[i]Oh no! I've been stripped![/i]\n";
	let message1 = ""; let message2 = ""; let message3 = ""; let origin2 = ""; let destiny2 = "";
	
	if (botname == "emily") {
		//1, calcular el emote de recepción de daño
		let dest = ["lips","ass"];
		let bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//let dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		let dict_sex_penis = ["cock","shaft","dick","penis"];
		let origin1 = searchOrigins(origin);
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
		let destiny1 = searchDestinies(destiny);
		
		message1 = "[i]" + emily.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		let origenes = ["lips","punch","tits","sex","ass","feet","tail"];
		let destinos = dest.concat(bits[gyms[data.character].gender]);
		origin2 = origenes[Math.floor(Math.random() * 7)];
		destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		message2 = "\n[i]" + emily.attacks[origin2][destiny2] + "[/i]";
		// mensajes
		message3 = "\n[i]";
		message3 += emily.special.pass;
		win += emily.special.win;
		loss += emily.special.loss;
		message3 += "[/i]\n";
	}
	
	if (botname == "robert") {
		//1, calcular el emote de recepción de daño
		let dest = ["lips","ass"];
		let bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//let dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		let dict_sex_penis = ["cock","shaft","dick","penis"];
		let origin1 = searchOrigins(origin);
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
		let destiny1 = searchDestinies(destiny);
		message1 = "[i]" + robert.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		let origenes = ["lips","fingers","tits","sex","ass","feet"];
		let destinos = dest.concat(bits[gyms[data.character].gender]);
		origin2 = origenes[Math.floor(Math.random() * 6)];
		destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		message2 = "[i]" + robert.attacks[origin2][destiny2] + "[/i]";
		//if (destiny2 == "penis" || destiny2 == "vagina") { destiny2 = "sex"; }
		message3 = "\n[i]Robert giggles to himself. 'You want more? Okay... come here!' He beckons with one hand, staring hungrily at your body and licking his lips.[/i]\n";
	}
	
	
	if (botname == "yuni") {
		//1, calcular el emote de recepción de daño
		let dest = ["lips","ass"];
		let bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//let dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		let dict_sex_penis = ["cock","shaft","dick","penis"];
		let origin1 = searchOrigins(origin);
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
		let destiny1 = searchDestinies(destiny);
		
		message1 = "[i]" + yuni.defenses[origin1][destiny1] + "[/i]\n";
		//2, escojer un ataque y destino al azar
		let origenes = ["lips","fingers","tits","sex","ass","feet"];
		let destinos = dest.concat(bits[gyms[data.character].gender]);
		origin2 = origenes[Math.floor(Math.random() * 6)];
		destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		message2 = "[i]" + yuni.attacks[origin2][destiny2] + "[/i]";
		//if (destiny2 == "penis" || destiny2 == "vagina") { destiny2 = "sex"; }
		message3 = "\n[i]Yuni giggles to herself. 'You want more, Sugar? Okay... come here, Cutie.' She beckons with one paw, staring hungrily at your body and licking her lips.[/i]\n";
	}
	
	if (botname == "milly") {
		//1, calcular el emote de recepción de daño
		let dest = ["lips","ass"];
		let bits = {male:["penis"],female:["tits","vagina"],shemale:["penis","tits"],herm:["penis","vagina","tits"]};
		//let dict_sex = ["sex","pussy","cock","slit","shaft","cunny","cunt","clit","dick","vagina","penis"];
		let dict_sex_penis = ["cock","shaft","dick","penis"];
		let origin1 = searchOrigins(origin);
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
		let destiny1 = searchDestinies(destiny);
		if (destiny == "tail") { destiny1 = "tail"; if (origin1 == "ass" || origin1 == "penis") { pass = false; } else { pass = true; } }
		message1 = "[i]" + milly.defenses[origin1][destiny1] + "[/i]\n";
		
		//2, escojer un ataque y destino al azar
		let origenes = ["lips","fingers","tits","sex","ass","feet","tail"];
		let destinos = dest.concat(bits[gyms[data.character].gender]);
		origin2 = origenes[Math.floor(Math.random() * 7)];
		destiny2 = destinos[Math.floor(Math.random() * destinos.length)];
		//3, imprimir el emote apropiado
		message2 = "\n[i]" + milly.attacks[origin2][destiny2] + "[/i]";
		// mensaje de pass
		message3 = "\n[i]";
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
	
	let resultado_logica = { message1: message1, message2: message2, message3: message3, origin2: origin2, destiny2: destiny2, win: win, loss: loss, pass: pass, strip: strip };
	return resultado_logica;
}

function generar_ayuda() {
	let hoja = fs.readFileSync("./help.txt", "utf8");
	return hoja;
}

function generar_tienda(lista, minId, maxId, store, emoji) {
	let hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n[color=purple]";
	hoja +="                                 " + emoji + " " + emoji + " [b]" + store + "[/b] " + emoji + " " + emoji + "[/color]\n";
	hoja +="══════════════════════════════════════════════════\n[color=pink]";
	let items = requireNew('./etc/shop.js');
	for (let i = 0; i < items.length; i++) {
		hoja += entrada(lista, i, minId, maxId);
	}
	hoja += "[/color][/color]";
	return hoja;
}

function generar_hoja_chica(pj) { 
	let color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	let color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	let hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Character card[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]" + pj.name + "[/icon]\n";
	hoja +="          [b]Name:[/b] " + pj.name + " | [b]Money:[/b] $" + pj.Gold + ".00 | [b]Wins/Losses:[/b] " + pj.wins + "/" + pj.loses + "\n";
	hoja +="          [b]Attack:[/b] " + pj.atklips + " Lips, " + pj.atkfingers + " Fingers, " + pj.atktits + " Tits, " + pj.atksex + " Sex, " + pj.atkass + " Ass, " + pj.atkfeet + " Feet.\n";
	hoja +="          [b]Defense:[/b] " + pj.deflips + " Lips, " + pj.deftits + " Tits, " + pj.defsex + " Sex, " + pj.defass + " Ass, " + pj.deffeet + " Feet.\n";
	hoja +="          [b]Sextoy:[/b] " + pj.weapon.name + ". " + generar_stats(pj.weapon) + "\n";
	hoja +="          [b]Outfit:[/b] " + pj.armor.name + ". " + generar_stats(pj.armor) + "\n";
	hoja +="          [b]Accessory:[/b] " + pj.item.name + ". " + generar_stats(pj.item) + "\n";
	hoja +="          [b]Flavor item:[/b] " + pj.flavorr.name + ". " + generar_stats(pj.flavorr) + "\n";
	//hoja +="          [b]Addiction:[/b] " + pj.addiction.name + ". " + generar_stats(pj.addiction) + "\n";
	hoja +="          [b]Level:[/b] "+level[pj.wins]+" | [b]Total XP:[/b] "+totalXP[pj.wins]+" | [b]XP for next level:[/b] "+xpForNext[pj.wins]+" | [b]XP gain on next battle:[/b] "+100*level[pj.wins];
	hoja +="[/color][/color]";
	return hoja;
} //xpgain = lvl * 100;

function generar_hoja(pj) {
	let color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	let color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	
	let Weapon_stats = generar_stats(pj.weapon);
	let Armor_stats = generar_stats(pj.armor);
	let Item_stats = generar_stats(pj.item);
	let Flavor_stats = generar_stats(pj.flavorr);
	let Addiction_stats = generar_stats(pj.addiction);
	
	let hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]General details[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]" + pj.name + "[/icon]\n";
	hoja +="          [b]Name:[/b] " + pj.name + " | [b]Money:[/b] $" + pj.Gold + ".00 | Wins/Losses: " + pj.wins + "/" + pj.loses+"\n";
	hoja +="          [b]Level:[/b] "+level[pj.wins]+" | [b]Total XP:[/b] "+totalXP[pj.wins]+" | [b]XP for next level:[/b] "+xpForNext[pj.wins]+" | [b]XP gain on next battle:[/b] "+100*level[pj.wins] + "\n[/color]";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Attack / Defense[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="          [b]Lips:[/b] " + pj.atklips + " / " + pj.deflips + "\n";
	hoja +="          [b]Fingers:[/b] " + pj.atkfingers + "\n";
	hoja +="          [b]Tits:[/b] " + pj.atktits + " / " + pj.deftits + "\n";
	hoja +="          [b]Sex:[/b] " + pj.atksex + " / " + pj.defsex + "\n";
	hoja +="          [b]Ass:[/b] " + pj.atkass + " / " + pj.defass + "\n";
	hoja +="          [b]Feet:[/b] " + pj.atkfeet + " / " + pj.deffeet + "[/color]\n";
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
	
	for (let i = 0; i < pj.equipment.length; i++) {
		hoja +="          " + pj.equipment[i].name + ". " + generar_stats(pj.equipment[i]) + "\n";
	}
	
	hoja += "[/color][/color]";
	return hoja;
}

function generar_stats(objeto) {  
	let message = [];
	if (objeto.deflips != null) 	{ message.push(signo(objeto.deflips) + " def on lips"); }
	if (objeto.deftits != null)		{ message.push(signo(objeto.deftits) + " def on tits"); }
	if (objeto.defsex != null)		{ message.push(signo(objeto.defsex) + " def on sex"); }
	if (objeto.defass != null)		{ message.push(signo(objeto.defass) + " def on ass"); }
	if (objeto.deffeet != null)		{ message.push(signo(objeto.defass) + " def on feet"); }
	
	if (objeto.atklips != null) 	{ message.push(signo(objeto.atklips) + " atk on lips"); }
	if (objeto.atkfingers != null) 	{ message.push(signo(objeto.atkfingers) + " atk on fingers"); }
	if (objeto.atktits != null) 	{ message.push(signo(objeto.atktits) + " atk on tits"); }
	if (objeto.atksex != null) 		{ message.push(signo(objeto.atksex) + " atk on sex"); }
	if (objeto.atkass != null) 		{ message.push(signo(objeto.atkass) + " atk on ass"); }
	if (objeto.atkfeet != null) 	{ message.push(signo(objeto.atkfeet) + " atk on feet"); }
	
	if (objeto.hp != null)		{ message.push(signo(objeto.hp) + " endurance"); }
	if (objeto.flavor != null)	{ message.push(objeto.flavor); }
	if (message.length > 0) { message = message.join(", ") + "."; } else { message = ""; }
	return message;
}

//funcion para generar entrada de la tienda
function entrada(lista, indice, minId, maxId) {
	let message = "";
	let objeto = lista[indice];
	if (objeto.id >= minId && objeto.id <= maxId) {
		//genera entrada
		message += "          ► $" + objeto.Gold + ".00 - " + objeto.name + " (" + generar_stats(objeto) + ")\n";
	}
	return message;
}

//buscar por nombre
function busca(lista, nombre) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].name.toLowerCase() == nombre.toLowerCase()) {
			return lista[i];
        }
    }
    return -1;
}

//buscar por id
function buscaId(lista, nombre) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id == nombre) {
			return lista[i];
        }
    }
    return -1;
}

function parseStringToIntArray(myString) {
    let myArray = myString.split(",");
    for (let i = 0; i < myArray.length; i++) {
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
	jsonfile.writeFileSync(saveDir+saveFile, data);
}

function loadData2() {
	try {
		if (fs.statSync(saveDir+saveFile2)) {
			return jsonfile.readFileSync(saveDir+saveFile2);
		} else {
			return [];
		}
	}
	catch(err){
		return [];
	}
}

function saveData2(data) {
	if (!fs.existsSync(saveDir)){
		fs.mkdirSync(saveDir);
	}
	jsonfile.writeFileSync(saveDir+saveFile2, data);
}

function searchDestinies(part) {
	let bodyparts = requireNew('./etc/bodyparts.js');
	let destinies = bodyparts.destinies;
	let categorias = Object.keys(destinies);
	for (let i = 0; i < categorias.length; i++) {
		if (destinies[categorias[i]].indexOf(part) != -1) {
			return categorias[i];
		}
	}
	return "";
}

function searchOrigins(part) {
	let bodyparts = requireNew('./etc/bodyparts.js');
	let origins = bodyparts.origins;
	let categorias = Object.keys(origins);
	for (let i = 0; i < categorias.length; i++) {
		if (origins[categorias[i]].indexOf(part) != -1) {
			return categorias[i];
		}
	}
	return "";
}