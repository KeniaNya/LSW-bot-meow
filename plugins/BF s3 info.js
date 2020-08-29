var fchat;
var channel;

var requireNew = require('require-new');

var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.25", {db: 3});

var notregistered = "You're not registered (or come from season one or two), use !register to join the club~";

module.exports = function (parent, chanName){
	fchat = parent;
	channel = chanName;
	
	var cmd = {};
	client.on("error", function (err) { console.log("Redis error " + err); });
	
	
	cmd.card = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(notregistered, data); return 0; }
			let pj = JSON.parse(chara.data);
			if (fchat.roomStatus[channel] == "busy") {
				priv(generateCard(pj), data);
				return 0;
			}
			send(generateCard(pj), data);
		});
	}
	
	cmd.cardplus = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(notregistered, data); return 0; }
			let pj = JSON.parse(chara.data);
			if (fchat.roomStatus[channel] == "busy") {
				priv(generateCardPlus(pj), data);
				return 0;
			}
			send(generateCardPlus(pj), data);
		});
	}
	
	//status, card, cardplus, sheet, shops
	
	return cmd;
}

function id2obj(numero) {
    let lista = requireNew('./etc/shop3.js');
	for (let i = 0; i < lista.length; i++) {
        if (lista[i].id == numero) {
			return lista[i];
        }
    }
    return -1;
}

function turnIdsToObjects(pj) {
	pj.rank = getRank(pj);
	pj.weight = id2obj(pj.weight);
	
	let names = Object.keys(pj.equipment.worn);
	for (let name in names) {
		pj.equipment.worn[names[name]] = id2obj(pj.equipment.worn[names[name]]);
	}
	
	return pj;
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateEquipments(pj) {
	let message = "";
	let names = Object.keys(pj.equipment.worn);
	for (let name in names) {
		message +="          [b]"+cap(names[name])+":[/b] "+pj.equipment.worn[names[name]].name+". "+generar_stats(pj.equipment.worn[names[name]])+"\n";
	}
	
	return message;
}

function generateHeader(pj) {
	let color1 = pj.color1;
	let color2 = pj.color2;
	
	let hoja = "\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+pj.color1+"][b]Character card[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+pj.color2+"]"; //
	hoja +="                     [icon]" + pj.name + "[/icon] [b]Name:[/b] " + pj.stagename + " [eicon]"+pj.rank+"-rank[/eicon] [b]Level:[/b] "+pj.level+"\n";
	hoja +="          [b]Faction:[/b] " + pj.faction+ " | [b]Dom/sub role:[/b] "+pj.domsub+"\n";
	hoja +="          [b]Wins/Losses:[/b] " + pj.wins + "/" + pj.loses + " | [b]Weight class:[/b] " + pj.weight.name + "\n";
	return hoja;
}

function generateCard(pj) { 
	
	pj = turnIdsToObjects(pj);
	
	let hoja = generateHeader(pj);
	hoja += generateEquipments(pj);
	hoja += "[/color]";
	return hoja;
}

function generateCardPlus(pj) { 
	let color1 = pj.color1;
	let color2 = pj.color2;
	let rank = getRank(pj);
	
	pj = turnIdsToObjects(pj);
	
	let hoja = generateHeader(pj);
	
	hoja += "          [b]Attack:[/b] ";
	let names = Object.keys(pj.stats.attack);
	for (let name in names) {
		hoja += pj.stats.attack[names[name]]+" on "+cap(names[name])+", ";
	}
	hoja = hoja.substr(0, hoja.length-2) + ".\n";
	
	hoja += "          [b]Defense:[/b] ";
	names = Object.keys(pj.stats.defense);
	for (let name in names) {
		hoja += pj.stats.defense[names[name]]+" on "+cap(names[name])+", ";
	}
	hoja = hoja.substr(0, hoja.length-2) + ".\n";
	
	hoja += generateEquipments(pj);
	hoja += "[/color]";
	return hoja;
}
/*

function generar_hoja(pj) {
	let color1 = (pj.color1 === undefined ? "purple" : pj.color1);
	let color2 = (pj.color2 === undefined ? "pink" : pj.color2);
	
	let Weapon_stats = generar_stats(pj.weapon);
	let Armor_stats = generar_stats(pj.armor);
	let Item_stats = generar_stats(pj.item);
	let Flavor_stats = generar_stats(pj.flavorr);
	let Addiction_stats = generar_addictions(pj);
	
	let hoja = "\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]General details[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="                     [icon]" + pj.name + "[/icon]\n";
	hoja +="          [b]Faction:[/b] " + pj.faction+ " [b]Dom/sub role:[/b] "+pj.domsub+"\n";
	hoja +="          [b]Name:[/b] " + pj.name + " | [b]Money:[/b] $" + pj.Gold + ".00 | [b]Stat points:[/b] " + pj.sp + " | Wins/Losses: " + pj.wins + "/" + pj.loses+"\n";
	hoja +="          [b]Level:[/b] "+level[pj.wins]+" | [b]Total XP:[/b] "+totalXP[pj.wins]+" | [b]XP for next level:[/b] "+xpForNext[pj.wins]+" | [b]XP gain on next battle:[/b] "+100*level[pj.wins] + " | [b]Used stat points:[/b] "+pj.usedstatpoints+" / 100 max\n";
	hoja +="          [b]Weight class:[/b] " + pj.weight.name + " | [b]Base LP:[/b] " + pj.HP + " | [b]Strip chance:[/b] " + signo(pj.stripchance) + "%\n";
	hoja +="          [b]Attack:[/b] " + pj.atklips + " Lips, " + pj.atkfingers + " Fingers, " + pj.atktits + " Tits, " + pj.atksex + " Sex, " + pj.atkass + " Ass, " + pj.atkfeet + " Feet.\n";
	hoja +="          [b]Defense:[/b] " + pj.deflips + " Lips, " + pj.deffingers + " Fingers, " + pj.deftits + " Tits, " + pj.defsex + " Sex, " + pj.defass + " Ass, " + pj.deffeet + " Feet.[/color]\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Equipment[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	hoja +="          [b]Sextoy:[/b] " + pj.weapon.name + ". " + generar_stats(pj.weapon) + "\n";
	hoja +="          [b]Outfit:[/b] " + pj.armor.name + ". " + generar_stats(pj.armor) + "\n";
	hoja +="          [b]Accessory:[/b] " + pj.item.name + ". " + generar_stats(pj.item) + "\n";
	hoja +="          [b]Flavor item:[/b] " + pj.flavorr.name + ". " + generar_stats(pj.flavorr) + "\n";
	hoja +="          [b]Addictions:[/b]\n";
	hoja +="          "+Addiction_stats+"[/color]\n";
	hoja +="══════════════════════════════════════════════════\n";
	hoja +="                                 ⭐ ⭐ [color="+color1+"][b]Inventory[/b][/color] ⭐ ⭐\n";
	hoja +="══════════════════════════════════════════════════\n[color="+color2+"]"; //
	
	for (let i = 0; i < pj.equipment.length; i++) {
		hoja +="          " + pj.equipment[i].name + ". " + generar_stats(pj.equipment[i]) + "\n";
	}
	
	hoja += "[/color]";
	return hoja;
}

*/

function getRank(pj) {
	let points = pj.wins - pj.loses;
	if (points <= -30) { return "f"; }
	if (points <= -20) { return "e"; }
	if (points <= -10) { return "d"; }
	if (points <= 0) { return "c"; }
	if (points <= 10) { return "b"; }
	if (points <= 20) { return "a"; }
	if (points <= 30) { return "s"; }
	return "ss";
}

function generar_stats(objeto) {  
	let message = [];
	if (objeto.deflips != null) 	{ message.push(signo(objeto.deflips) + " def on lips"); }
	if (objeto.deffingers != null)	{ message.push(signo(objeto.deffingers) + " def on fingers"); }
	if (objeto.deftits != null)		{ message.push(signo(objeto.deftits) + " def on tits"); }
	if (objeto.defsex != null)		{ message.push(signo(objeto.defsex) + " def on sex"); }
	if (objeto.defass != null)		{ message.push(signo(objeto.defass) + " def on ass"); }
	if (objeto.deffeet != null)		{ message.push(signo(objeto.deffeet) + " def on feet"); }
	
	if (objeto.atklips != null) 	{ message.push(signo(objeto.atklips) + " atk on lips"); }
	if (objeto.atkfingers != null) 	{ message.push(signo(objeto.atkfingers) + " atk on fingers"); }
	if (objeto.atktits != null) 	{ message.push(signo(objeto.atktits) + " atk on tits"); }
	if (objeto.atksex != null) 		{ message.push(signo(objeto.atksex) + " atk on sex"); }
	if (objeto.atkass != null) 		{ message.push(signo(objeto.atkass) + " atk on ass"); }
	if (objeto.atkfeet != null) 	{ message.push(signo(objeto.atkfeet) + " atk on feet"); }
	
	if (objeto.hp != null)		{ message.push(signo(objeto.hp) + " Lust Points"); }
	if (objeto.HP != null)		{ message.push(signo(objeto.HP) + " Lust Points"); }
	if (objeto.stripchance != null)	{ message.push(signo(objeto.stripchance) + "% strip chance"); }
	if (objeto.flavor != null)		{ message.push(objeto.flavor); }
	if (message.length > 0) { message = message.join(", ") + "."; } else { message = ""; }
	return message;
}

function generar_addictions(pj) {
	let message = [];
	if (pj.addlips != 0) { message.push(wor(pj.addlips)+" to lips"); }
	if (pj.addfingers != 0) { message.push(wor(pj.addfingers)+" to fingers"); }
	if (pj.addtits != 0) { message.push(wor(pj.addtits)+" to tits"); }
	if (pj.addsex != 0) { message.push(wor(pj.addsex)+" to sex"); }
	if (pj.addass != 0) { message.push(wor(pj.addass)+" to ass"); }
	if (pj.addfeet != 0) { message.push(wor(pj.addfeet)+" to feet"); }
	if (message.length > 0) { message = message.join(", ") + "."; } else { message = "None yet."; }
	return message;
}


function signo(x) { return x > 0 ? "+" + x : x; }
function wor(x) { return x > 0 ? "weakness lvl " + Math.abs(x) : "resistance lvl " + Math.abs(x); }

function entrada(lista, indice, minId, maxId) {
	let message = "";
	let objeto = lista[indice];
	if (objeto.id >= minId && objeto.id <= maxId) {
		//genera entrada
		if (objeto.Gold < 0) {
			message += "          ► " + objeto.name + " (" + generar_stats(objeto) + ")\n";
			return message;
		}
		message += "          ► $" + objeto.Gold + ".00 - " + objeto.name + " (" + generar_stats(objeto) + ")\n";
	}
	return message;
}















function send(message, data) {
	if (data.publico) {
		fchat.sendMessage(message, channel);
	}
	else {
		fchat.sendPrivMessage(data.character, message);
	}
}

function priv(message, data) {
	fchat.sendPrivMessage(data.character, message);
}

function pub(message, data) {
	fchat.sendMessage(message, channel);
}