var fchat;
var channel;

var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.25", {db: 3});

var c = {};

var g = "[color=green]"; var y = "[color=yellow]"; var r = "[color=red]"; var p = "[color=pink]"; var ec = "[/color]";

var notregistered = "You're not registered (or come from season one or two), use !register to join the club~";
var combatinprogress = "There's a combat in progress! Wait for them to finish or use another room~";
var alreadyjoined = "You're already inside the ring! Meow!";
var notyourturn = "It's not your turn";
var nocombat = "There's no match going on! Attacks outside matches are on the way!";
var attackerror = "Wrong spelling of body parts. Use one of the following: lips, fingers, tits, sex, ass, feet. Example: !attack fingers to tits";

var bodyParts = ["fingers","lips","tits","sex","ass","feet"];

module.exports = function (parent, chanName){
	fchat = parent;
	channel = chanName;
	setup();
	
	var cmd = {};
	client.on("error", function (err) { console.log("Redis error " + err); });
	
	cmd.status = function(args, data) {
		if (fchat.roomStatus[channel] == "combat") { send(statusDisplay(""), data); return 0; }
		if (fchat.roomStatus[channel] == "busy") { send("Someone is waiting...!", data); return 0; } ////////////
		send(g+"The ring is empty~ But a roleplay might be going on!"+ec, data);
	}
	
	cmd.statusmeow = function (args, data) {
		send(objectDisplay(c), data);
	}
	
	cmd.ready = function(args, data) {
		if (fchat.roomStatus[channel] == "combat") { send(combatinprogress, data); return 0; }
		fchat.roomStatus[channel] = "busy";
		
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(notregistered, data); return 0; }
			let pj = JSON.parse(chara.data);
			pj.turn = c.players.length; //CAMBIAR ESTO PARA CUANDO SE HABILITEN LAS TEAM FIGHTS
			
			for (let i = 0; i < c.players.length; i++) {
				if (c.players[i].name == pj.name) { send(alreadyjoined, data); return 0; }
			}
			
			c.players.push(pj);
			
			send(playerjoined(pj), data);
			
			// not a team fight, change this for when team fights are enabled!
			if (c.players.length == 2) {
				fchat.roomStatus[channel] = "combat";
				send(battlestart(), data);
			}
		});
		
		
	}
	
	cmd.endfight = function(args, data) {
		setup();
		send("Combat ended!", data);
	}
	
	cmd.pass = function(args, data) {
		if (fchat.roomStatus[channel] != "combat") { return 0; }
		if (data.character != c.players[c.turn].name) { send(notyourturn, data); return 0; } ////////////
		send(turnpassed(), data);
	}
	
	cmd.debug = function(args, data) {
		if (data.character != "Kenia Nya") { return 0; }
		send(JSON.stringify(c), data);
	}
	
	cmd.attack = function(args, data) {
		//here comes the good stuff~
		
		if (fchat.roomStatus[channel] != "combat") { send(nocombat, data); return 0; }
		if (data.character != c.players[c.turn].name) { send(notyourturn, data); return 0; } ////////////
		
		parts = args.split(" to ");
		
		if (parts.length != 2) { send(attackerror, data); return 0; }
		if (!isBodyPart(parts[0]) || !isBodyPart(parts[1])) { send(attackerror, data); return 0; }
		
		let attacker = c.players[c.turn];
		let defender = c.players[c.turn ? 0 : 1]; /////////////////////////////////////////// change this
		
		let diceroll = Math.ceil(Math.random()*6 + Math.random()*6); // 2d6
		
		//------------------------------------------- debuggy
		send("dice roll: "+diceroll+", attack: "+attacker.stats.attack[parts[0]]+", defense: "+defender.stats.defense[parts[1]], data);
		//-------------------------------------------
		
		// ************************************************************************************************
		let damage = 4 + diceroll + attacker.stats.attack[parts[0]] - defender.stats.defense[parts[1]];
		// ************************************************************************************************
		defender.stats.HP -= damage;
		
		nextTurn();
		
		send(statusDisplay(attacker.stagename+" used their "+parts[0]+" to please "+defender.stagename+"'s "+parts[1]+", dealing "+damage+" lust points!\n"), data);
		
	}
	
	//attack, pass
	//recuerda hacer la prueba de guardar el estado del combate en la base de datos luego de cada movimiento
	
	return cmd;
}

function nextTurn() {
	c.turn += 1;
	if (c.turn == c.players.length) { c.turn = 0; }
}

function turnpassed() {
	let message = c.players[c.turn].stagename+" has passed their turn!\n";
	nextTurn();
	return statusDisplay(message);	
}

function battlestart() {
	//change this for team fights...
	c.turn = Math.round(Math.random());
	let message = "The fight has started! Today we have "+c.players[0].stagename+" vs "+c.players[1].stagename+", It's "+c.players[c.turn].stagename+"'s turn!";
	return message;
}

function playerjoined(pj) {
	let message = "";
	message += pj.stagename +" has entered the ring and they're ready to rumble!";
	//message += poner un resumen del rango, equipamiento, etc...
	return message;
}

function statusDisplay(prevMessage) { //pendiente: añadir el estado de esperando oponente!
	let message = prevMessage;
	message += "Match of "+c.players[0].stagename+" ("+c.players[0].stats.HP+" LP) vs "+c.players[1].stagename+" ("+c.players[1].stats.HP+" LP), It's "+c.players[c.turn].stagename+"'s turn!";
	
	return message;
}

function objectDisplay(object) {
	let message = "";
	let names = Object.keys(object);
	for (let name in names) {
		message += names[name]+": "+object[names[name]]+", ";
	}
	return message.substr(0, message.length-2);
}

function setup() {
	fchat.roomStatus[channel] = "free";
	
	c.players = [];
	c.turn = 0;
	c.teams = [];
	c.teamTurn = "";
	c.teamfight = false;
	c.roughmode = false;
	c.intervention = false;
	c.finisher = false;
	c.forcedcrit = false;
}

function isBodyPart(part) {
	// I NEED TO CHANGE THIS TO INCLUDE ALL OF THE SYNONYMS, MEOW ///////////////////////////////////////
	if (bodyParts.indexOf(part) == -1) { return false; }
	return true;
}

function send(message, data) {
	if (data.publico) {
		fchat.sendMessage(message, channel);
	}
	else {
		fchat.sendPrivMessage(data.character, message);
	}
}