//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE COMBATE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

function Combate() {
	this.actores = [];
	this.started = false;
	this.gender = "";
	
	this.addActor = function(actor) {
		for (var i = 0; i < this.actores.length; i++) {
			if (actor.name == this.actores[i].name) {
				return false;
			}
		}
		this.actores.push(actor);
		return true;
	}
	
	this.removeActor = function(actor) {
		for (var i = 0; i < this.actores.length; i++) {
			if (actor.name == this.actores[i].name) {
				this.actores.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	
	this.setGender = function(dest) {
		this.gender = dest;
	}
	
	this.initiative = function() {
		//Revolver
		if (Math.random() > 0.5) {
			var temp = this.actores[0];
			this.actores[0] = this.actores[1];
			this.actores[1] = temp;
		}
		this.started = true;
	}
	
	this.startFight = function () {
		this.started = true;
	}
	
	this.activeActor = function() {
		return this.actores[0].name;
	}
	
	this.nextActor = function() {
		var temp = this.actores[0];
		this.actores[0] = this.actores[1];
		this.actores[1] = temp;
	}
	
	this.attack = function(origin1, destiny1) {
		var origin = searchOrigins(origin1);
		var destiny = searchDestinies(destiny1);
		if (origin != "" && destiny != "") {
			var atkStat = "atk" + origin; var addStat = "add" + origin;
			var defStat = "def" + destiny;
			var atacante = this.actores[0];
			var defensor = this.actores[1];
			var ataque = atacante[atkStat] + defensor[addStat];
			var defensa = defensor[defStat];
			var dado = diceroll();
			var damage = 4 + parseInt(dado) + parseInt(ataque - defensa);
			if (damage < 1) { damage = 1; }
			console.log("diferencia: " + (ataque - defensa) + ", dado: " + dado + ", daño: " + damage);
			var message = "\n[eicon]Bot Announcer[/eicon][color=gray]" + this.actores[0].name + " used their " + origin1 + " to tease " + this.actores[1].name + "'s " + destiny1 + ", dealing " + damage + " lust points![/color]";
			if (this.actores[1].removeHP(damage)) {
				message += "\n[color=gray]" + this.actores[0].name + " made " + this.actores[1].name + " cum! The winner gets $2.00 and the loser gets $1.00, thank you for participating.[/color]";
				this.nextActor();
				message += this.status();
				message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
				this.started = false;
			} else {
				this.nextActor();
				message += this.status();
			}
		} else {
			var message = "Invalid body parts or spelling. Remember to use 'to', example: !attack tits to lips. To see the full list, check the bot profile.";
		}
		return message;
	}
	
	this.strip = function() {
		var defensor = this.actores[1];
		if (defensor.armor.id == 0) { return "Your opponent is not wearing any outfit to strip."; }
		var dado = Math.ceil(Math.random() * 100);
		var probabilidad = 10 + (100 - defensor.HP);
		console.log("probabilidad: " + probabilidad + ", dado: " + dado);
		if (dado <= probabilidad) {
			this.actores[1].equip({id: 0, name: "Nude", slot: "armor", Gold: 0, flavor: "Just you and your body"});
			this.actores[1].updateStats();
			var message = "\n[eicon]Bot Announcer[/eicon][color=gray]" + this.actores[0].name + " managed to strip " + this.actores[1].name + "'s outfit![/color]";
			this.nextActor();
			message += this.status();
		} else {
			var message = "\n[eicon]Bot Announcer[/eicon][color=gray]" + this.actores[0].name + " tried to strip " + this.actores[1].name + "'s outfit but [color=yellow]failed![/color][/color]";
			this.nextActor();
			message += this.status();
		}
		return message;
	}
	
	this.killActor = function(destiny) {
		this.actores.splice(destiny, 1);
	}
	
	this.status = function() {
		var hoja = "\n";
		//bloque de texto que genera el estado del combate
		if (this.started) {
			hoja += "[color=gray]═════════════════ ⭐ [color=purple]Sexfight ring[/color] ⭐ ═════════════════\n";
			hoja += " " + hpBarL(this.actores[0].HP) + " ⭐ [color=purple]VS[/color] ⭐ " +  hpBarR(this.actores[1].HP) + "\n"
			hoja += "► [icon]" + this.actores[0].name + "[/icon]                                                                  [icon]" + this.actores[1].name + "[/icon]\n";
			
			hoja += "It's " + this.actores[0].name + "'s turn![/color]\n";
			
		} else {
			if (this.actores.length > 0) {
				hoja += "[color=gray]════════════════ ⭐ [color=purple]Sexfight ring[/color] ⭐ ════════════════\n";
				hoja += "          [icon]" + this.actores[0].name + "[/icon] Is waiting for a challenger![/color]\n";
			} else {
				hoja += "[color=gray]The ring is empty![/color]";
			}
		}
		return hoja;
	}
	
	this.reset = function() {
		this.actores = [];
		this.started = false;
	}
	
}

function hpBarR(size) {
	var message = "";
	var j = 20;
	for (var i = 0; i < size / 5; i++) {
		message += "▓";
		j--;
	}
	for (var i = 0; i < j; i++) {
		message += "░";
	}
	if (size >= 50) { return "[color=purple]" + message + "[/color]"; } else { return "[color=red]" + message + "[/color]"; }
}

function hpBarL(size) {
	var message = "";
	var j = 20;
	for (var i = 0; i < size / 5; i++) {
		message += "▓";
		j--;
	}
	for (var i = 0; i < j; i++) {
		message += "░";
	}
	message = message.split("").reverse().join("");
	if (size >= 50) { return "[color=purple]" + message + "[/color]"; } else { return "[color=red]" + message + "[/color]"; }
}

module.exports = Combate;

function searchDestinies(part) {
	var bodyparts = require('./bodyparts.js');
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
	var bodyparts = require('./bodyparts.js');
	var origins = bodyparts.origins;
	var categorias = Object.keys(origins);
	for (var i = 0; i < categorias.length; i++) {
		if (origins[categorias[i]].indexOf(part) != -1) {
			return categorias[i];
		}
	}
	return "";
}

function diceroll() {
	var resultados = ["2",
					  "3", "3",
					  "4", "4", "4",
					  "5", "5", "5", "5",
					  "6", "6", "6", "6", "6",
					  "7", "7", "7", "7", "7", "7",
					  "8", "8", "8", "8", "8",
					  "9", "9", "9", "9",
					  "10", "10", "10",
					  "11", "11",
					  "12"];
	var resultado = resultados[Math.floor(Math.random() * 36)]
	return resultado;
}