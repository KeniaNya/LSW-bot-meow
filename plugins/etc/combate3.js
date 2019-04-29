//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE COMBATE - 2 equipos de 2
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var requireNew = require('require-new');
var ajuste = [0,3,5,6,7,8,9,10,10,11,12,12,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,20,21,21,22,22,23,23,23,24,24,24,25,25,26,26,26,27,27,27,28,28,28,29,29,29,30,30,30];
var crit = false;
var icon = "[icon]Bot Announcer[/icon]";

function Combate() {
	this.mode = ["please","building them up by","lust","pink","cum","sexfight","SMUTALITY"];
	this.modeflag = true;
	this.betting = false;
	this.bettingPeople = [];
	this.turnCount = 1;
	this.sMatch = false;
	this.intervention = false;
	this.finisher = false;
	this.crits = true;
	
	this.actores = [];
	this.started = false;
	this.gender = "";
	this.red = [];
	this.blue = [];
	this.teamsf = false;
	this.teamturn = ["red","blue"];
	this.letras = ["A","B","C","D"];
	
	this.debug = function() {
		console.log("Actores: "+this.actores);
		console.log("Started: "+this.started);
		console.log("Red: "+this.red);
		console.log("Blue: "+this.blue);
		console.log("Teams flag: "+this.teamsf);
		console.log("Team turn: "+this.teamturn);
	}
	
	this.forceCrit = function() {
		crit = true;
		return "Crit forced.";
	}
	
	this.changeMode = function() {
		if (this.modeflag) {
			this.mode = ["hurt","dealing","hit","red","KO","combat","FATALITY"]; this.modeflag = false;
			return "Rough combat mode enabled!";
		} else {
			this.mode = ["please","building them up by","lust","pink","cum","sexfight","SMUTALITY"]; this.modeflag = true;
			return "Rough combat mode disabled!"
		}
	}
	
	this.toggleBetting = function() {
		if (this.betting) { this.betting = false; return "Betting disabled!"; } else { this.betting = true; return "Betting enabled!"; }
	}
	
	this.toggleIntervention = function() {
		if (this.intervention) { this.intervention = false; return "Crowd intervention disabled!"; } else { this.intervention = true; return "Crowd intervention enabled!"; }
	}
	
	this.stripMatch = function() {
		this.sMatch = true;
	}
	
	this.toggleCrits = function() {
		if (this.crits) { this.crits = false; return "Crits disabled!"; } else { this.crits = true; return "Crits enabled!"; }
	}
	
	this.giveOdds = function() {
		let sp0 = this.actores[0].usedstatpoints == 0 ? 1 : this.actores[0].usedstatpoints;
		let sp1 = this.actores[1].usedstatpoints == 0 ? 1 : this.actores[1].usedstatpoints;
		let diff = Math.abs(sp0 - sp1); if (diff == 0) { return [50,50]; }
		if (sp0 > sp1) {
			let odd = Math.round((50 * diff) / sp0);
			return [50+odd,50-odd];
		} else {
			let odd = Math.round((50 * diff) / sp1);
			return [50-odd,50+odd];
		}
	}
	
	this.addBettingPeople = function(persona, cantidad, destiny, odds) {
		let newPersona = {name: persona, cantidad: cantidad, destiny: destiny, odds: odds};
		this.bettingPeople.push(newPersona);
	}
	
	this.loadState = function(actores, red, blue, teamsf, teamturn, betting, bettingPeople, turnCount, sMatch) {
		this.actores = actores;
		this.red = red;
		this.blue = blue;
		this.teamsf = teamsf;
		this.teamturn = teamturn;
		this.started = true;
		this.betting = betting;
		this.bettingPeople = bettingPeople;
		this.turnCount = turnCount;
		this.sMatch = sMatch;
	}
	
	this.begin = function() {
		if (this.red.length == 0) { return "Team red is empty."; }
		if (this.blue.length == 0) { return "Team blue is empty."; }
		this.initiative();
		var message = "\n"+icon+"[color=gray] Welcome to the "+this.mode[5]+" ring! Today we have a team match! It's a potential gangbang! Yaay! Let the match begin![/color]";
		message += this.status();
		return message;
	}
	
	this.addActor = function(actor, hp, team) {
		for (var i = 0; i < this.actores.length; i++) { if (actor.name == this.actores[i].name) { return ["Already joined.",""]; } }
		let rank = getRank(actor.usedstatpoints);
		var hoja = "\n";
		hoja += "[color=gray]═════════════ ⭐ [color=purple]"+this.mode[5]+" ring[/color] ⭐ ═════════════\n";		
		if (team == "red" || team == "blue") {
			if (this.teamsf == false && this.actores.length == 1) {
				return ["The previous person needs to select a team. Use !endfight to clear the ring and then use !ready team red or !ready team blue",""];
			}
			if (this[team].length == 2) { return ["The "+team+" team is full.",""]; }
			hoja += "          [icon]" + actor.name + "[/icon][eicon]"+rank+"-rank[/eicon] [b][color=pink]"+actor.stageName+"[/color][/b] has entered the ring on team [color="+team+"]"+team+"![/color][/color]";
			actor.letra = this.letras[this.actores.length];
			actor.team = team;
			this[team].push(actor);
			this.teamsf = true;
			this.bettingPeople = [];
			this.betting = false;
		} else {
			if (this.teamsf == true) { return ["You must select a team",""]; }
			hoja += "          [icon]" + actor.name + "[/icon][eicon]"+rank+"-rank[/eicon] [b][color=pink]"+actor.stageName+"[/color][/b] has entered the ring![/color]";
			this.bettingPeople = [];
			this.betting = false;
		}
		var cantidad = parseInt(hp);
		if (!isNaN(cantidad) && cantidad > 0 && cantidad < 1001) {
			actor.removeHP(100 - cantidad);
			hoja += " [color=yellow]Starting with "+cantidad+" lust points.[/color]";
		}
		hoja += "\n          [color=gray]Sextoy: "+actor.weapon.name+", Outfit: "+actor.armor.name+", Accessory: "+actor.item.name+", Other: "+actor.flavorr.name+".[/color]";
		actor.maxHP = actor.HP;
		this.actores.push(actor);
		var messages = [hoja, ""];
		if (this.actores.length == 2 && this.teamsf == false) {
			this.initiative();
			var message = "\n"+icon+"[color=gray] Welcome to the "+this.mode[5]+" ring! Tonight it's " + this.actores[0].stageName + " vs " + this.actores[1].stageName + ", Who will hold out, and who will end up in a pool of their own spunk? Let's find out... now![/color]";
			message += this.status();
			messages[1] = message;
		}
		return messages;
	}
	
	this.addActor2 = function(actor, hp) {
		var cantidad = hp;
		if (!isNaN(cantidad) && cantidad > 0) {
			actor.removeHP(100 - cantidad);
		}
		actor.maxHP = actor.HP;
		this.actores.push(actor);
	}
	
	this.setGender = function(dest) {
		this.gender = dest;
	}
	
	this.initiative = function() {
		if (this.teamsf == false) {
			if (Math.random() > 0.5) { this.actores.push(this.actores.shift()); }
		} else {
			if (Math.random() > 0.5) { this.teamturn.push(this.teamturn.shift()); }
		}
		this.started = true;
	}
	
	this.startFight = function () {
		this.started = true;
	}
	
	this.activeActor = function(name) {
		if (this.teamsf == false) {
			return (this.actores[0].name == name);
		} else {
			if (this[this.teamturn[0]].length > 1) {
				if (this[this.teamturn[0]][0].name == name) { return true; }
				if (this[this.teamturn[0]][1].name == name) { return true; }
			} else {
				if (this[this.teamturn[0]][0].name == name) { return true; }
			}
		}
	}
	
	this.nextActor = function() {
		for (let i = 0; i < this.actores.length; i++) {
			this.actores[i].nextTurn();
		}
		if (this.teamsf == false) {
			this.actores.push(this.actores.shift());
		} else {
			this.teamturn.push(this.teamturn.shift());
		}
		this.turnCount += 1;
	}
	
	this.attack = function(origin1, destiny1, letra, name, statusSkip, crowd, score) {
		let isSextoy = false;
		if (origin1 == "sextoy") {
			isSextoy = true; let n = 0;
			if (this.teamsf == true) {
				let temp = this.nameToActor(name);
				if (temp.weapon.atklips !== undefined) { origin1 = "lips"; }
				if (temp.weapon.atkfingers !== undefined) { origin1 = "fingers"; }
				if (temp.weapon.atktits !== undefined) { origin1 = "tits"; }
				if (temp.weapon.atksex !== undefined) { origin1 = "sex"; }
				if (temp.weapon.atkass !== undefined) { origin1 = "ass"; }
				if (temp.weapon.atkfeet !== undefined) { origin1 = "feet"; }
			} else {
				if (this.actores[n].weapon.atklips !== undefined) { origin1 = "lips"; }
				if (this.actores[n].weapon.atkfingers !== undefined) { origin1 = "fingers"; }
				if (this.actores[n].weapon.atktits !== undefined) { origin1 = "tits"; }
				if (this.actores[n].weapon.atksex !== undefined) { origin1 = "sex"; }
				if (this.actores[n].weapon.atkass !== undefined) { origin1 = "ass"; }
				if (this.actores[n].weapon.atkfeet !== undefined) { origin1 = "feet"; }
			}
		}
		var origin = searchOrigins(origin1);
		var destiny = searchDestinies(destiny1);
		if (origin != "" && destiny != "") {
			var atkStat = "atk" + origin; var addStat = "add" + origin;
			var defStat = "def" + destiny;
			var skipturn = false;
			if (this.teamsf == true) {
				if (this.letraToActor(letra) == -1) { return "Target not found. Remember to use capital letters, example: !attack tits to lips to A"; }
				if (this.nameToActor(name) == -1) { return "Este es un bug muy raro, favor de checar. Attack"; }
				var atacante = this.nameToActor(name);
				if (atacante.alive == false) { return "You are out or KO'd."; }
				var defensor = this.letraToActor(letra);
				if (defensor.alive == false) { return "That player is out or KO'd."; }
			} else {
				if (letra == "me") { var defensor = this.actores[0]; } else { var defensor = this.actores[1]; }
				if (crowd === undefined) { var atacante = this.actores[0]; } else {
					var atacante = crowd; skipturn = true;
					if (name == this.actores[0].name) { defensor = this.actores[0]; } else { defensor = this.actores[1]; }
				}
			}
			var ataque = atacante[atkStat] + defensor[addStat];
			var defensa = defensor[defStat];
			var dado = diceroll();
			var damage0 = 4 + parseInt(dado) + parseInt(ataque - defensa);
			if (damage0 < 1) { damage0 = 1; } var damage = damage0; //var damage = ajuste[damage0];
			if (this.turnCount == 1) { damage = Math.ceil(damage / 2); } // AJUSTE PARA BALANCEAR EL PODER DEL PRIMER JUGADOR
			
			//ajuste para las partes del cuerpo
			if (destiny == "fingers" || destiny == "feet" || destiny == "sight") { damage -= Math.floor(damage/5); console.log("strong"); }
			if (destiny == "sex" || destiny == "ass") { damage += Math.floor(damage/5); console.log("weak"); }
			
			//ajuste para dom/sub
			if (defensor.domsub != "competitive") {
				if (atacante.domsub == "dom") { damage += 2; console.log("dom bonus"); }
				if (atacante.domsub == "sub") { damage -= 2; console.log("sub bonus"); }
				if (atacante.domsub == "toy") { damage -= 4; console.log("toy bonus"); }
			}
			//bono por racha de victorias derrotas
			if (atacante.cwins > 0 && atacante.domsub == "dom") {
				damage += Math.min(Math.floor(atacante.cwins/3),3);
				console.log("win streak bonus");
			}
			if (atacante.closes > 0 && (atacante.domsub == "sub" || atacante.domsub == "toy")) {
				damage -= Math.min(Math.floor(atacante.closes/3),3);
				console.log("lose streak bonus");
			}
			if (damage <= 0) { damage = 1; }
			
			//if (score !== undefined) { if (!isNaN(score)) { console.log("Score: "+score); damage += Math.floor(score/20); } }
			console.log(atacante.name+"("+origin+") ataque: "+atacante[atkStat]+"+("+defensor[addStat]+"), "+defensor.name+"("+destiny+") defensa: "+defensa+", diferencia: " + (ataque - defensa) + ", dado: " + dado + ", daño: " + damage+"("+damage0+")");
			if (isSextoy) { origin1 = atacante.weapon.name+" ("+origin1+")"; }
			
			//APRIL'S FOOL JOKE
			//let fool = ","+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString();
			let fool = "";
			var message = "\n"+icon+"[color=pink][b]" + atacante.stageName + "[/b][/color] used their [color=pink][b]" + origin1 + "[/b][/color] to "+this.mode[0]+" [color=pink][b]" + defensor.stageName + "'s " + destiny1 + "[/b][/color], "+this.mode[1]+" [color="+this.mode[3]+"][b]" + damage +fool+ " "+this.mode[2]+" points![/b][/color] "+comment(damage);
			if (dado == "14") { message += " [color=yellow][b](Critical hit~!)[/b][/color] Yeowch!"; }
			if (this.teamsf == false) {
				if (defensor.removeHP(damage)) {
					if (Math.ceil(Math.random()*2) == 1 || !(!skipturn && letra != "me") || this.finisher || this.gender != "") {
					//Normal
					message += "\n" + atacante.stageName + " made " + defensor.stageName + " "+this.mode[4]+"! They both win $5.00, kinda anti-climactic if you ask me. I mean, why does the loser still get $5.00? Ah well.";
					if (this.finisher) { message += " [color=red][b]"+this.mode[6]+"[/b][/color]"; }
					if (!skipturn && letra != "me") { this.nextActor(); }
					message += this.status();
					message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
					this.started = false;
					this.finisher = false;
					} else {
					//Smutality?
					message += "\n" + atacante.stageName + " has " + defensor.stageName + " in a very weakened state! [color=red][b]FINISH THEM[/b][/color] ("+atacante.stageName+" has an extra turn)";
					this.finisher = true;
					crit = true;
					}
				} else {
					if (!skipturn) { this.nextActor(); }
					if (!statusSkip) { message += this.status(); } //****************************************************************************************************************************************************************
				}
			} else {
				if (defensor.removeHP(damage)) {
					message += "\n[color=gray]" + atacante.stageName + " made " + defensor.stageName + " "+this.mode[4]+"![/color]";
				}
				this.nextActor();
				message += this.status();
				if (this.checkVictory() != "") { //checkar si un equipo esta totalmente muerto
					message += "\n[color=gray]Team [color="+this.checkVictory()+"]"+this.checkVictory()+"[/color] wins! Everyone gets $5.00, thank you for participating.[/color]";
					message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
					this.started = false;
				}
			}
		} else {
			var message = "Invalid body parts or spelling. Remember to use 'to', example: !attack tits to lips. To see the full list, check the bot profile.";
		}
		return message;
	}
	
	this.strip = function(letra, name) {
		if (this.teamsf == false) {
			var atacante = this.actores[0];
			var defensor = this.actores[1];
		} else {
			if (this.letraToActor(letra) == -1) { return "Target not found. Remember to use capital letters, example: !strip A"; }
			if (this.nameToActor(name) == -1) { return "Este es un bug muy raro, favor de checar. Strip"; }
			var atacante = this.nameToActor(name);
			if (atacante.alive == false) { return "You are out or KO'd."; }
			var defensor = this.letraToActor(letra);
			if (defensor.alive == false) { return "That player is out or KO'd."; }
		}
		if (defensor.armor.id == 0 && defensor.weapon.id == 100 && defensor.item.id == 200) { return "Your opponent is not wearing any outfit to strip."; }
		var dado = Math.ceil(Math.random() * 100) - atacante.stripchance;
		var probabilidad = 10 + (100 - defensor.HP);
		console.log("probabilidad: " + probabilidad + ", dado: " + dado);
		if (dado <= probabilidad) {
			defensor.stripMe();
			var message = "\n"+icon+"[color=pink][b]"+atacante.stageName+"[/b][/color] managed to strip [color=pink][b]"+defensor.stageName+"'s[/b][/color] outfit! Things are getting hot now! [color=cyan]And it's still their turn~[/color]";
			if (this.sMatch) {
				message += " They both win $5.00, kinda anti-climactic if you ask me. I mean, why does the loser still get $5.00? Ah well.";
				this.nextActor();
				message += this.status();
				message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
				this.started = false;
				return message;
			}
		} else {
			this.nextActor();
			var message = "\n"+icon+"[color=pink][b]"+atacante.stageName+"[/b][/color] tried to strip [color=pink][b]"+defensor.stageName+"'s[/b][/color] outfit but [color=yellow][b]failed! Yeesh, that was clumsy![/b][/color]";
		}
		message += this.status();
		return message;
	}
	
	this.strip2 = function(name) {
		if (this.teamsf == false) {
			var atacante = this.actores[0];
		} else {
			if (this.nameToActor(name) == -1) { return "Este es un bug muy raro, favor de checar. Strip"; }
			var atacante = this.nameToActor(name);
			if (atacante.alive == false) { return "You are out or KO'd."; }
		}
		if (atacante.armor.id == 0 && atacante.weapon.id == 100 && atacante.item.id == 200) { return "You're not wearing any outfit to strip."; }
		atacante.stripMe();
		var message = "\n"+icon+"[color=gray]" + atacante.stageName + " stripped their own outfit! Ooh, sexy! It's still their turn![/color]";
		//this.nextActor();
		message += this.status();
		return message;
	}
	
	this.use = function(name, item, letra) {
		if (this.teamsf == false) {
			var atacante = this.actores[0];
			var defensor = this.actores[1];
		} else {
			if (this.letraToActor(letra) == -1) { return "Target not found. Remember to use capital letters, example: !strip A"; }
			if (this.nameToActor(name) == -1) { return "Este es un bug muy raro, favor de checar. Strip"; }
			var atacante = this.nameToActor(name);
			if (atacante.alive == false) { return "You are out or KO'd."; }
			var defensor = this.letraToActor(letra);
			if (defensor.alive == false) { return "That player is out or KO'd."; }
		}
		//chechar si el actor tiene el item solicitado
		let res = atacante.use(item);
		if (res[0] == "consumable") {
			var message = "\n"+icon+"[color=pink][b]" + atacante.stageName + "[/b][/color] used the consumable item [color=pink][b]" + item + "![/b][/color]";
			defensor.use2(res[1]);
			if (defensor.HP <= 0) {
				defensor.HP = 0;
				message += "\n[color=gray]" + atacante.stageName + " made " + defensor.stageName + " "+this.mode[4]+"! They both win $5.00, kinda anti-climactic if you ask me. I mean, why does the loser still get $5.00? Ah well.[/color]";
				if (letra == "meow to meow") { this.nextActor(); }
				message += this.status();
				message += "\n[color=gray]════════════════ ⭐ [color=purple]Combat ended[/color] ⭐ ════════════════[/color]\n";
				this.started = false;
			} else {
				this.nextActor();
				message += this.status();
			}
			return message;
		}
		if (res[0] == "bondage") {
			var message = "\n"+icon+"[color=pink][b]" + atacante.stageName + "[/b][/color] used the bondage item [color=pink][b]" + item + "! Things are getting kinky!~![/b][/color]";
			defensor.use2(res[1]);
			this.nextActor();
			message += this.status();
			return message;
		}
		return "Item not found in your inventory or it's not a consumable or bondage item.";
	}
	
	this.letraToActor = function(letra) {
		for (var i = 0; i < this.red.length; i++) {
			//if (this.red[i].letra == letra) { return this.red[i]; }
			if (this.red[i].name == letra) { return this.red[i]; }
		}
		for (var i = 0; i < this.blue.length; i++) {
			//if (this.blue[i].letra == letra) { return this.blue[i]; }
			if (this.blue[i].name == letra) { return this.blue[i]; }
		}
		return -1;
	}
	
	this.nameToActor = function(name) {
		for (var i = 0; i < this.red.length; i++) {
			if (this.red[i].name == name) { return this.red[i]; }
		}
		for (var i = 0; i < this.blue.length; i++) {
			if (this.blue[i].name == name) { return this.blue[i]; }
		}
		return -1;
	}
	
	this.checkVictory = function() {
		var redAlive = 0; var blueAlive = 0;
		for (var i = 0; i < this.red.length; i++) {
			if (this.red[i].alive == true) { redAlive += 1; }
		}
		for (var i = 0; i < this.blue.length; i++) {
			if (this.blue[i].alive == true) { blueAlive += 1; }
		}
		if (redAlive == 0) { return "blue"; }
		if (blueAlive == 0) { return "red"; }
		return "";
	}
	
	this.status = function() {
		if (this.teamsf == false) {
			var hoja = "\n";
			//bloque de texto que genera el estado del combate
			if (this.started) {
				hoja += "[color=gray]═════════════════ ⭐ [color=purple]"+this.mode[5]+" ring[/color] ⭐ ═════════════════\n";
				hoja += " " + hpBarL(this.actores[0].HP,this.actores[0].maxHP) + " ⭐ [color=purple]VS[/color] ⭐ " +  hpBarR(this.actores[1].HP,this.actores[1].maxHP) + "\n";
				hoja += "► [icon]" + this.actores[0].name + "[/icon]                                                                  [icon]" + this.actores[1].name + "[/icon]\n";
				
				hoja += "It's " + this.actores[0].stageName + "'s turn![/color]\n";
				
			} else {
				if (this.actores.length > 0) {
					hoja += "[color=gray]════════════════ ⭐ [color=purple]"+this.mode[5]+" ring[/color] ⭐ ════════════════\n";
					hoja += "          [icon]" + this.actores[0].name + "[/icon] Is waiting for a challenger! Don't keep 'em waiting![/color]\n";
				} else {
					hoja += "[color=gray]The ring is empty![/color]";
				}
			}
			return hoja;
		} else {
			var hoja = "\n";
			//bloque de texto que genera el estado del combate en equipos
			hoja += "[color=gray]═════════════════ ⭐ [color=purple]"+this.mode[5]+" ring[/color] ⭐ ═════════════════\n";
			if (this.red.length >= 1 && this.blue.length >= 1) {
				hoja += "[color=red]"+this.red[0].letra+"[/color] "+hpBarL(this.red[0].HP,this.red[0].maxHP)+" [color=purple]VS[/color] "+hpBarR(this.blue[0].HP,this.blue[0].maxHP)+" [color=blue]"+this.blue[0].letra+"[/color]\n";
			} else {
				if (this.red.length >= 1) {
					hoja += "[color=red]"+this.red[0].letra+"[/color] "+hpBarL(this.red[0].HP,this.red[0].maxHP)+"\n";
				} else {
					if (this.blue.length >= 1) {
						hoja += "                                                  "+hpBarR(this.blue[0].HP,this.blue[0].maxHP)+" [color=blue]"+this.blue[0].letra+"[/color]\n";
					}
				}
			}
			if (this.red.length == 2 && this.blue.length == 2) {
				hoja += "[color=red]"+this.red[1].letra+"[/color] "+hpBarL(this.red[1].HP,this.red[1].maxHP)+"      "+hpBarR(this.blue[1].HP,this.blue[1].maxHP)+" [color=blue]"+this.blue[1].letra+"[/color]\n";
			} else {
				if (this.red.length == 2) {
					hoja += "[color=red]"+this.red[1].letra+"[/color] "+hpBarL(this.red[1].HP,this.red[1].maxHP)+"\n";
				} else {
					if (this.blue.length == 2) {
						hoja += "                                                  "+hpBarR(this.blue[1].HP,this.blue[1].maxHP)+" [color=blue]"+this.blue[1].letra+"[/color]\n";
					}
				}
			}
			//poner la lista de los actores...
			hoja += "Players: [color="+this.actores[0].team+"]"+this.actores[0].stageName+" ("+this.actores[0].letra+")[/color]";
			for (var i = 1; i < this.actores.length; i++) {
				hoja += ", [color="+this.actores[i].team+"]"+this.actores[i].stageName+" ("+this.actores[i].letra+")[/color]";
			} hoja += "[/color]\n";
			if (this.started) { hoja += "It's team [color="+this.teamturn[0]+"]"+this.teamturn[0]+"'s turn![/color]\n"; }
			return hoja;
		}
	}
	
	this.reset = function() {
		this.actores = [];
		this.started = false;
		this.red = [];
		this.blue = [];
		this.teamsf = false;
		this.teamturn = ["red","blue"];
		this.turnCount = 1;
		this.sMatch = false;
		this.intervention = false;
		this.crits = true;
	}
	
	function diceroll() {
		if (this.crits == true) { 
			if (crit) { crit = false; return 14; }
			if (Math.ceil(Math.random()*20) == 20) { return 14; }
		}
		return Math.ceil(Math.random()*6) + Math.ceil(Math.random()*4) + 2;
	}
	
}

function hpBarL(size, maxsize) {
	var fill = Math.ceil(size*20/maxsize);
	if (fill >= 10) { var color = "[/color][color=purple]"; } else { var color = "[/color][color=red]"; }
	return "[color=black]"+"█".repeat(20-fill)+color+"█".repeat(fill)+"[/color]";
}

function hpBarR(size, maxsize) {
	var fill = Math.ceil(size*20/maxsize);
	if (fill >= 10) { var color = "[color=purple]"; } else { var color = "[color=red]"; }
	return color+"█".repeat(fill)+"[/color][color=black]"+"█".repeat(20-fill)+"[/color]";
}

module.exports = Combate;

function getRank(points) {
	if (points <= 5) { return "f"; }
	if (points <= 15) { return "e"; }
	if (points <= 30) { return "d"; }
	if (points <= 50) { return "c"; }
	if (points <= 70) { return "b"; }
	if (points <= 100) { return "a"; }
	if (points <= 150) { return "s"; }
	return "ss";
}

function searchDestinies(part) {
	var bodyparts = requireNew('./bodyparts.js');
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
	var bodyparts = requireNew('./bodyparts.js');
	var origins = bodyparts.origins;
	var categorias = Object.keys(origins);
	for (var i = 0; i < categorias.length; i++) {
		if (origins[categorias[i]].indexOf(part) != -1) {
			return categorias[i];
		}
	}
	return "";
}



function comment(d) {
	if (d < 5) { return "Uh... wow. That didn't look like it was effective at all."; }
	if (d < 9) { return "Looks like that warmed them up a little."; }
	if (d < 14) { return "Ooh, they definitely felt that."; }
	if (d < 19) { return "Woah, that looked hot!"; }
	if (d < 25) { return "What an erotic move!"; }
	return "That shouldn't be legal!!!";
}

function busca(lista, nombre) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i] == nombre) {
			return i;
        }
    }
    return -1;
}