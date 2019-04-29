var fChatLibInstance;
var channel;
var players = [];
var r = "[color=red][b]"; var y = "[color=yellow][b]"; var g = "[color=green][b]"; var c = "[color=cyan][b]"; var ec = "[/b][/color]";
function green(text) { return g+text+ec; }
function yellow(text) { return y+text+ec; }
function red(text) { return r+text+ec; }
function cyan(text) { return c+text+ec; }

var Personaje = require('./etc/personaje1a.js');
var combate = require('./etc/combate1a.js');
var Combate = new combate();
var monsters = require('./etc/monsters.js');
var races = require('./etc/races.js');

var requireNew = require('require-new');
var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.18", {db: 3});

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	//Admin
	
	cmdHandler.giveXP = function (args,data) {
		//checar si el usuario es DM (pendiente)
		let arr = args.split(' to ');
		let cantidad = parseInt(arr[0]);
		let destiny = arr[1];
		if (isNaN(cantidad) || cantidad < 1) {
			let message = "XP amount should be a positive number";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == undefined) {
			let message = "You must specify a recipient. Example: !giveXP 100 to Kenia Nya";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(destiny, function (err, chara) {
			if (chara == null) {
				let message = destiny + " wasn't found.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			pj.setstat("xp", pj.xp+cantidad);
			let message = "The DM has given "+yellow(cantidad+" XP")+" to "+cyan(destiny)+"!";
			if (pj.xp >= pj.level * 1000) {
				pj.setstat("xp",			(pj.xp - pj.level * 1000));
				pj.setstat("level",			pj.level+1);
				pj.setstat("statpoints",	pj.statpoints+1);
				message += " "+yellow("They have leveled up! (+1 stat point)");
			}
			fChatLibInstance.sendMessage(message, channel);
			client.hmset(pj.name, pj.getSaveFile());
		});
	}
	
	cmdHandler.giveGold = function (args,data) {
		//checar si el usuario es DM (pendiente)
		let arr = args.split(' to ');
		let cantidad = parseInt(arr[0]);
		let destiny = arr[1];
		if (isNaN(cantidad) || cantidad < 1) {
			let message = "Gold amount should be a positive number";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		if (destiny == undefined) {
			let message = "You must specify a recipient. Example: !givegold 10 to Kenia Nya";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(destiny, function (err, chara) {
			if (chara == null) {
				let message = destiny + " wasn't found.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			pj.setstat("Gold", pj.Gold+cantidad);
			let message = "The DM has given "+yellow(cantidad+" Gold")+" to "+cyan(destiny)+"!";
			fChatLibInstance.sendMessage(message, channel);
			client.hmset(pj.name, pj.getSaveFile());
		});
	}
	
	//Character
	
	cmdHandler.register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			let message = "You're already registered.";
			if (reply == 0) {
				let stats = {
					Gold:0, xp:0, level:1, statpoints:0, creacion: "race",
					strength:0,constitution:0,agility:0,intelligence:0,wisdom:0,charisma:0,
					traits:[],hitDie:0,primaryAbility:"",saves:[],hp:0,
					wornArmor:0,wornWeapon:100,wornItem:200,wornFlavor:300,ownedItems:[0,100,200,300],custom:""
				};
				let nuevo = {name: data.character, stats: JSON.stringify(stats)};
				client.hmset(data.character, nuevo);
				message = data.character + " has joined!";
			}
			//data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			fChatLibInstance.sendMessage(message, channel);
		});
	}
	
	cmdHandler.buy = function (args, data) {
		let items = requireNew('./etc/shop3.js');
		let itemAsked = busca(items, args);
		if (itemAsked == -1) {
			let message = "The item '" + args + "' wasn't found.";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the adventure.";
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
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the adventure.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = "The item " + args + " wasn't found in your inventory or it's a starter item.";
			let ganancia = pj.removeItem(args);
			if (ganancia != -1) {
				pj.addGold(ganancia);
				client.hmset(data.character, pj.getSaveFile());
				message = "The " + args + " has been sold! " + data.character + " got $" + ganancia + ".00 Back.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.train = function (args, data) {
		if (args != "strength" && args != "agility" && args != "vitality" && args != "defense") { fChatLibInstance.sendPrivMessage(data.character, "Wrong spelling of stats. Example: !train strength"); return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the adventure.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = ""; let stat = args;
			if (pj.train(stat)) {
				message = "Training successful! You now have "+pj[stat]+" points in "+args+".";
				client.hmset(data.character, pj.getSaveFile());
			} else {
				message = "Not enough xp.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.untrain = function (args, data) {
		if (args != "strength" && args != "agility" && args != "vitality" && args != "defense") { fChatLibInstance.sendPrivMessage(data.character, "Wrong spelling of stats. Example: !train strength"); return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered, use !register to join the adventure.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = ""; let stat = args;
			pj.untrain(stat)
			message = "Untraining successful! You now have "+pj[stat]+" points in "+args+".";
			client.hmset(data.character, pj.getSaveFile());
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.card = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			let message = "You're not registered, use !register to join the adventure.";
			if (chara != null) {
				let pj = new Personaje(chara);
				message = generar_hoja_chica(pj);
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.sheet = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			let message = "You're not registered, use !register to join the adventure.";
			if (chara != null) {
				let pj = new Personaje(chara);
				message = generar_hoja(pj);
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.equip = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered (or come from season one), use !register to join the club or !transfer to bring your character to the new season.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = "The item " + args + " wasn't found in your inventory or cannot be equiped.";
			if (pj.equip(args)) {
				client.hmset(data.character, pj.getSaveFile());
				message = "The item " + args + " has been equipped.";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.rename = function (args, data) {
		let arr = args.split(' to ');
		if (arr.length < 2) {
			let message = "You need to put the name of the current item followed by 'to' and the new name (you can add flavor text using a $ at the end of the name) Example: !rename light hand sextoy to basic egg vibrator $ Small and pink";
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
			return 0;
		}
		let original = arr.splice(0, 1)[0];
		let nuevo = arr.join(" to ");
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered (or come from season one), use !register to join the club or !transfer to bring your character to the new season.";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			let pj = new Personaje(chara);
			let message = "The item " + original + " wasn't found in your inventory.";
			if (pj.renameItem(original, nuevo)) {
				client.hmset(data.character, pj.getSaveFile());
				message = "Your item " + original + " was renamed to " + nuevo + "!";
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	//Combat
	
	cmdHandler.addEnemy = function (args, data) {
		let monsterAsked = busca(monsters, args);
		if (monsterAsked == -1) { fChatLibInstance.sendMessage("Monster '" + args + "' wasn't found.", channel); return 0; }
		if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
		var messages = Combate.addEnemy(monsterAsked);
		fChatLibInstance.sendMessage(messages[0], channel);
		if (messages[1] != "") { fChatLibInstance.sendMessage(messages[1], channel); }
	}
	
	cmdHandler.ready = function (args, data) {
		if (data.publico == false) { return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				let message = "You're not registered";
				data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
				return 0;
			}
			if (Combate.started == true) { fChatLibInstance.sendMessage("Combat already started.", channel); return 0; }
			let pj = new Personaje(chara);
			let messages = Combate.addActor(pj);
			fChatLibInstance.sendMessage(messages[0], channel);
			if (messages[1] != "") { fChatLibInstance.sendMessage(messages[1], channel); }
		});
	}
	
	cmdHandler.begin = function (args, data) {
		fChatLibInstance.sendMessage(Combate.begin(), channel);
	}
	
	cmdHandler.endfight = function (args, data) {
		fChatLibInstance.sendMessage(Combate.reset(), channel);
	}
	
	cmdHandler.status = function (args, data) {
		let message = Combate.status();
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.attack = function (args, data) {
		args = args.trim();
		if (Combate.started == false) { return 0; }
		let origin = data.character;
		let destiny = args;
		let message = Combate.attack(origin, destiny);
		fChatLibInstance.sendMessage(message, channel);
		if (Combate.started == false) { Combate.reset(); }
	}
	
	cmdHandler.enemy_attack = function (args, data) {
		//checar si el user es DM (pendiente!)
		args = args.trim();
		if (Combate.started == false) { return 0; }
		let arr = args.split(' to ');
		let origin = arr[0];
		let destiny = arr[1];
		let message = Combate.enemy_attack(origin, destiny);
		fChatLibInstance.sendMessage(message, channel);
		if (Combate.started == false) { Combate.reset(); }
	}
	
	cmdHandler.rollagility = function (args, data) {
		if (Combate.started == false) { return 0; }
		if (args != "") { fChatLibInstance.sendMessage(Combate.rollagility(args), channel); return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { return 0; }
			fChatLibInstance.sendMessage(Combate.rollagility(data.character), channel);
		});
	}
	
	//Shops
	
	cmdHandler.armors = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop3.js');
			let message = generar_tienda(items, 1, 99, "Armor shop", "👘");
			if (data.publico == false) { fChatLibInstance.sendPrivMessage(data.character, message); return 0; }
			fChatLibInstance.sendMessage(message, channel);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private (private commands disabled for the beta version, sorry).");
		}
	}
	
	cmdHandler.weapons = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop3.js');
			let message = generar_tienda(items, 101, 199, "Weapon shop", "⚒️");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private (private commands disabled for the beta version, sorry).");
		}
	}
	
	cmdHandler.accessories = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop3.js');
			let message = generar_tienda(items, 201, 299, "General store", "📿");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private (private commands disabled for the beta version, sorry).");
		}
	}
	
	cmdHandler.amulets = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop3.js');
			let message = generar_tienda(items, 301, 399, "Amulets store", "📿");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private (private commands disabled for the beta version, sorry).");
		}
	}
	
	cmdHandler.consumables = function (args, data) {
		if (Combate.started == false || data.publico == false) {
			let items = requireNew('./etc/shop3.js');
			let message = generar_tienda(items, 500, 699, "Consumables", "🍶");
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		} else {
			fChatLibInstance.sendPrivMessage(data.character, "There's a combat in progress, command disabled to prevent spam, use it on private (private commands disabled for the beta version, sorry).");
		}
	}
	
	
	
	return cmdHandler;
};

function generar_hoja_chica(pj) {
	if (pj.creacion != "done") { return "You have to finish creating your character first! Send a private message to the bot (me) saying 'tell me what to do, please'"; }
	let color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	let color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	let hoja = "\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Character card[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]"+pj.name+"[/icon] [b]Name:[/b] "+pj.name+" | [b]HP:[/b] "+pj.hp+" | [b]Level:[/b] "+pj.level+"\n";
	hoja +="          [b]Money:[/b] $" + pj.Gold + ".00 | [b]Stat points:[/b] " + pj.statpoints + " | [b]XP:[/b] " + pj.xp + "\n";
	hoja +="          [b]Strength:[/b] "+pj.strength+" [b]Constitution:[/b] "+pj.constitution+" [b]Agility:[/b] "+pj.agility+" [b]Intelligence:[/b] "+pj.intelligence+" [b]Wisdom:[/b] "+pj.wisdom+" [b]Charisma:[/b] "+pj.charisma+"\n";
	hoja +="          [b]Weapon:[/b] " + pj.weapon.name + ". " + generar_stats(pj.weapon) + "\n";
	hoja +="          [b]Armor:[/b] " + pj.armor.name + ". " + generar_stats(pj.armor) + "\n";
	hoja +="          [b]Accessory:[/b] " + pj.item.name + ". " + generar_stats(pj.item) + "\n";
	hoja +="          [b]Amulet:[/b] " + pj.flavorr.name + ". " + generar_stats(pj.flavorr) + "[/color]";
	return hoja;
}

function generar_hoja(pj) { 
	let color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	let color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	let hoja = "\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Character card[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]"+pj.name+"[/icon] [b]Name:[/b] "+pj.name+" | [b]HP:[/b] "+pj.hp+" | [b]Level:[/b] "+pj.level+"\n";
	hoja +="          [b]Money:[/b] $" + pj.Gold + ".00 | [b]Stat points:[/b] " + pj.statpoints + " | [b]XP:[/b] " + pj.xp + "\n";
	hoja +="          [b]Strength:[/b] "+pj.strength+" [b]Agility:[/b] "+pj.agility+" [b]Vitality:[/b] "+pj.vitality+" [b]Defense:[/b] "+pj.defense+"\n";
	hoja +="          [b]Weapon:[/b] " + pj.weapon.name + ". " + generar_stats(pj.weapon) + "\n";
	hoja +="          [b]Armor:[/b] " + pj.armor.name + ". " + generar_stats(pj.armor) + "\n";
	hoja +="          [b]Accessory:[/b] " + pj.item.name + ". " + generar_stats(pj.item) + "\n";
	hoja +="          [b]Amulet:[/b] " + pj.flavorr.name + ". " + generar_stats(pj.flavorr) + "[/color]\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Inventory[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	
	for (let i = 0; i < pj.equipment.length; i++) {
		hoja +="          " + pj.equipment[i].name + ". " + generar_stats(pj.equipment[i]) + "\n";
	}
	return hoja;
}

function generar_tienda(lista, minId, maxId, store, emoji) {
	let hoja = "\n[color=gray]";
	hoja +="══════════════════════════════════════════════════\n[color=purple]";
	hoja +="                                 " + emoji + " " + emoji + " [b]" + store + "[/b] " + emoji + " " + emoji + "[/color]\n";
	hoja +="══════════════════════════════════════════════════\n[color=pink]";
	let items = requireNew('./etc/shop3.js');
	for (let i = 0; i < items.length; i++) { hoja += entrada(lista, i, minId, maxId); }
	hoja += "[/color][/color]";
	return hoja;
}

function generar_stats(objeto) {  
	let message = [];
	if (objeto.strength != null) 	{ message.push(signo(objeto.strength) + " strength"); }
	if (objeto.agility != null)		{ message.push(signo(objeto.agility) + " agility"); }
	if (objeto.vitality != null)	{ message.push(signo(objeto.vitality) + " vitality"); }
	if (objeto.defense != null)		{ message.push(signo(objeto.defense) + " defense"); }
	
	if (objeto.hp != null)		{ message.push(signo(objeto.hp) + " Lust Points"); }
	if (objeto.flavor != null)	{ message.push(objeto.flavor); }
	if (message.length > 0) { message = message.join(", ") + "."; } else { message = ""; }
	return message;
}

function signo(x) { return x > 0 ? "+" + x : x; }

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