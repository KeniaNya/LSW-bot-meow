//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE COMBATE - Aventura
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var requireNew = require('require-new');
var critical = false;

function Combate() {
	this.turnCount = 1;	
	this.started = false;
	this.actores = [];
	this.enemigos = [];
	this.letras = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	
	this.debug = function() {
		console.log("Actores: "+this.actores);
		console.log("Started: "+this.started);
		console.log("Red: "+this.red);
		console.log("Blue: "+this.blue);
		console.log("Teams flag: "+this.teamsf);
		console.log("Team turn: "+this.teamturn);
	}
	
	
	this.begin = function() {
		this.started = true;
		let message = "\n[icon]Bot Announcer[/icon] Combat started!";
		message += this.status();
		return message;
	}
	
	this.addActor = function(actor) {
		for (let i = 0; i < this.actores.length; i++) { if (actor.name == this.actores[i].name) { return ["Already joined.",""]; } }
		let hoja = "\n";
		hoja += "═════════════ ⭐ [color=purple]Adventure Online![/color] ⭐ ═════════════\n";		
		hoja += "          [icon]" + actor.name + "[/icon] Has entered the combat!\n";
		hoja += "          Weapon: "+actor.weapon.name+", Armor: "+actor.armor.name+", Accessory: "+actor.item.name+", Amulet: "+actor.flavorr.name+".";
		actor.alive = true;
		this.actores.push(actor);
		let messages = [hoja, ""];
		return messages;
	}
	
	this.addEnemy = function(enemigo_n) {
		let enemigo = Object.assign({}, enemigo_n);
		enemigo.letra = this.letras[this.enemigos.length];
		enemigo.maxHP = 20 * enemigo.vitality;
		enemigo.hp = enemigo.maxHP;
		let hoja = "\n";
		hoja += "═════════════ ⭐ [color=purple]Adventure Online![/color] ⭐ ═════════════\n";		
		hoja += "          [b]"+enemigo.name+" "+enemigo.letra+"[/b] Has entered the combat!\n";
		enemigo.alive = true;
		this.enemigos.push(enemigo);
		let messages = [hoja, ""];
		return messages;
	}
	
	this.begin = function () {
		this.started = true;
		return this.status();
	}
	
	this.rollagility = function(name) {
		let actor = this.nameToActor(name);
		if (actor == -1) {
			actor = this.letraToActor(name);
			if (actor == -1) { return "You're not in this combat or enemy not found."; }
		}
		let result = diceroll(1, 20) + actor.agility;
		return "[eicon]Bot Announcer[/eicon][color=cyan][b]"+actor.name+"[/b][/color] rolled for agility and got a [color=cyan][b]"+result+"[/b][/color] (1d20 + "+actor.agility+")";
	}
	
	this.attack = function(origin, destiny) {
		let atacante = this.nameToActor(origin);
		let defensor = this.letraToActor(destiny);
		if (atacante == -1) { return "You're not in this combat."; }
		if (defensor == -1) { return "Target not found."; }
		let attack = diceroll(atacante.strength, 6) - defensor.defense;
		if (attack < 1) { attack = 1; }
		let message = "[eicon]Bot Announcer[/eicon][color=cyan][b]"+atacante.name+"[/b][/color] used their [color=cyan][b]"+atacante.weapon.name+"[/b][/color] to attack [color=red][b]"+defensor.name+" "+defensor.letra+"[/b][/color], dealing [color=red][b]"+attack+" hit points![/b][/color] ("+atacante.strength+"d6 - def)";
		if (critical) { message += " [color=yellow][b]Critical hit~![/b][/color]"; critical = false; }
		defensor.hp -= attack;
		if (defensor.hp < 1) {
			defensor.hp = 0; defensor.alive = false;
			message += " [color=red][b]"+defensor.name+" "+defensor.letra+"[/b][/color] is dead!";
			message += this.status();
			if (this.checkVictory() != "") { //checkar si un equipo esta totalmente muerto
				message += "[color=yellow][b]The "+this.checkVictory()+"[/b][/color] win!";
				message += "\n════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════";
				this.started = false;
			}
		} else {
			message += this.status();
		}
		return message;
	}
	
	this.enemy_attack = function(origin, destiny) {
		let atacante = this.letraToActor(origin);
		let defensor = this.nameToActor(destiny);
		if (atacante == -1) { return "You're not in this combat."; }
		if (defensor == -1) { return "Target not found."; }
		let attack = diceroll(atacante.strength, 6) - defensor.defense;
		if (attack < 1) { attack = 1; }
		let message = "[eicon]Bot Announcer[/eicon][color=cyan][b]"+atacante.name+" "+atacante.letra+"[/b][/color] attacked [color=red][b]"+defensor.name+"[/b][/color], dealing [color=red][b]"+attack+" hit points![/b][/color] ("+atacante.strength+"d6 - def)";
		if (critical) { message += " [color=yellow][b]Critical hit~![/b][/color]"; critical = false; }
		defensor.hp -= attack;
		if (defensor.hp < 1) {
			defensor.hp = 0; defensor.alive = false;
			message += " [color=red][b]"+defensor.name+"[/b][/color] is dead!";
			message += this.status();
			if (this.checkVictory() != "") { //checkar si un equipo esta totalmente muerto
				message += "[color=yellow][b]The "+this.checkVictory()+"[/b][/color] win!";
				message += "\n════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════";
				this.started = false;
			}
		} else {
			message += this.status();
		}
		return message;
	}
	
	this.use = function(origin, destiny, item) {
		let atacante = this.nameToActor(origin);
		let defensor = this.letraToActor(destiny);
		if (atacante == -1) { return "You're not in this combat."; }
		if (defensor == -1) { return "Target not found."; }
		//chechar si el actor tiene el item solicitado
		let res = atacante.use(item);
		if (res[0] == "consumable") {
			let message = "[eicon]Bot Announcer[/eicon][color=cyan][b]" + atacante.name + "[/b][/color] used the consumable item [color=pink][b]" + item + "![/b][/color]";
			message += this.status();
			return message;
		}
		return "Item not found in your inventory or it's not a consumable or attack item.";
	}
	
	this.letraToActor = function(letra) {
		for (let i = 0; i < this.enemigos.length; i++) { if (this.enemigos[i].letra == letra) { return this.enemigos[i]; } } return -1;
	}
	
	this.nameToActor = function(name) {
		for (let i = 0; i < this.actores.length; i++) { if (this.actores[i].name == name) { return this.actores[i]; } } return -1;
	}
	
	this.checkVictory = function() {
		if (!this.started) { return ""; }
		let actoresAlive = 0; let enemigosAlive = 0;
		for (let i = 0; i < this.actores.length; i++) {
			if (this.actores[i].alive == true) { actoresAlive += 1; }
		}
		for (let i = 0; i < this.enemigos.length; i++) {
			if (this.enemigos[i].alive == true) { enemigosAlive += 1; }
		}
		if (actoresAlive == 0) { return "enemies"; }
		if (enemigosAlive == 0) { return "players"; }
		return "";
	}
	
	this.status = function() {
		let hoja = "\n";
		//bloque de texto que genera el estado del combate
		hoja += "═════════════════ ⭐ [color=purple]Adventure Online![/color] ⭐ ═════════════════\n";
		let hp_bars = "";
		//let icons = "        ";
		for (let i = 0; i < this.actores.length; i++) {
			hp_bars += "[icon]"+this.actores[i].name+"[/icon] "+hpBar(this.actores[i].hp, this.actores[i].maxHP) + " ";
			//icons += "[icon]"+this.actores[i].name+"[/icon]               ";
		}
		hoja += hp_bars+"\n"; hp_bars = "";
		hoja += "                                                   ⭐ [color=purple]VS[/color] ⭐\n";
		let monsternames = "";
		for (let i = 0; i < this.enemigos.length; i++) {
			hp_bars += "[eicon]" + this.enemigos[i].eicon + "[/eicon]"+hpBar(this.enemigos[i].hp, this.enemigos[i].maxHP) + " ";
			//icons += "[eicon]" + this.enemigos[i].eicon + "[/eicon]               ";
			monsternames += "> " + this.enemigos[i].name+" "+this.enemigos[i].letra + " < ";
		}
		hoja += hp_bars + "\n" + monsternames + "\n";
		if (this.checkVictory() != "") { return hoja; }
		if (this.started) { hoja += "═════════════════ ⭐ [color=purple]Combat started![/color] ⭐ ═════════════════\n"; return hoja; }
		if (this.actores.length > 0 || this.enemigos.length > 0) {
			hoja += "═════════════════ ⭐ [color=purple]Combat inactive[/color] ⭐ ═════════════════\n";
			return hoja;
		}
		hoja = "\n═════════════════ ⭐ [color=purple]The arena is empty[/color] ⭐ ═════════════════\n";
		return hoja;
	}
	
	this.reset = function() {
		this.actores = [];
		this.enemigos = [];
		this.started = false;
		this.turnCount = 1;
		return "\n═════════════════ ⭐ [color=purple]Combat ended![/color] ⭐ ═════════════════\n";
	}
	
}

function hpBar(size, maxsize) {
	let fill = Math.ceil(size*5/maxsize); let color = "[color=red]";
	if (fill >= 3) { color = "[color=green]"; }
	return color+"█".repeat(fill)+"[/color][color=black]"+"█".repeat(5-fill)+"[/color]";
}

function diceroll(number,type) {
	let result = 0;
	for (let i = 0; i < number; i++) { result += Math.ceil(Math.random() * type); }
	if (Math.ceil(Math.random() * 20) == 20) { result = result * 2; critical = true; }
	return result;
}

module.exports = Combate;
