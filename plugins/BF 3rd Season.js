var fchat;
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
var client = redis.createClient(6379, "192.168.0.12", {db: 2});
client.on("error", function (err) { console.log("Redis error " + err); });

var mainChannel = "adh-cbbdce8a953436b609a9";

//var pjBase = require('./etc/ryuutama_base_pj.js');
//var Personaje = require('./etc/ryuutama_personaje.js');
//var classes = require('./etc/ryuutama_classes.js');
//var arquetipos = require('./etc/ryuutama_arquetipos.js');
//var creationMessage = require('./etc/msgCreacion.js');
//var shop = require('./etc/ryuutama_shop.js');

module.exports = function (parent, chanName) {
    fchat = parent;

    var cmdHandler = {};
    channel = chanName;
	
	//Character
	
	cmdHandler.myCharacters = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fchat.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let message = " Character list: "; let characters = []; let selected = data1.selected; delete data1.selected;
			let elements = Object.keys(data1);
			for (let i in elements) { let character = elements[i];
				if (character == selected) { characters.push(green(character)); } else { characters.push(character); }
			}
			fchat.sendMessage(green("Info")+message+characters.toString()+" (Green = selected)", channel);
		});
	}
	
	cmdHandler.selectCharacter = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fchat.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let selected = data1.selected; delete data1.selected;
			if (args == selected) { fchat.sendMessage(red("Error!")+" Character already selected.", channel); return 0; }
			let elements = Object.keys(data1);
			if (elements.indexOf(args) == -1) { fchat.sendMessage(red("Error!")+" Character not found.", channel); cmdHandler.myCharacters("", data); return 0; }
			data1.selected = args;
			client.hmset(data.character, data1);
			fchat.sendMessage(green("Info")+" "+args+" was selected!", channel);
		});
	}
	
	cmdHandler.deleteCharacter = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fchat.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let selected = data1.selected; delete data1.selected; let deleted = data1[args];
			let elements = Object.keys(data1);
			if (elements.indexOf(args) == -1) { fchat.sendMessage(red("Error!")+" Character not found.", channel); return 0; }
			if (elements.length == 1) {
				client.del(data.character);
				fchat.sendMessage(green("Info")+" Character deleted.", channel);
				client.hlen("Deleted Characters Meow", function (err, reply) {
					let next = [parseInt(reply)+1].toString();
					client.hset("Deleted Characters Meow", next+" "+args, deleted);
				});
			} else {
				
				elements.splice(elements.indexOf(args),1);
				data1.selected = elements[0];
				client.hmset(data.character, data1);
				fchat.sendMessage(green("Info")+" Character deleted.", channel);
				client.hlen("Deleted Characters Meow", function (err, reply) {
					let next = [parseInt(reply)+1].toString();
					client.hset("Deleted Characters Meow", next+" "+args, deleted);
				});
				client.hdel(data.character, args);
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
						data1[args] = {editable:["Name"]};
						data1[args].Name = args;
						data1[args].Owner = data.character;
						data1[args].creationStage = "best attack";
						data1[args] = JSON.stringify(data1[args]);
						data1.selected = args;
						client.hmset(data.character, data1);
						fchat.sendMessage(green("Info")+" The character "+cyan(args)+" was created by "+cyan(data.character)+"!", channel);
						cmdHandler.characterCreation("Registered!", data);
						return 0;
					} else { fchat.sendMessage(red("Error!")+" You already have a character with that name, choose another", channel); return 0; }
				});
			} else {											//Si no hay nada en la base de datos...
				let data1 = {selected: args};
				data1[args] = {editable:["Name"]};
				data1[args].Name = args;
				data1[args].Owner = data.character;
				data1[args].creationStage = "best attack";
				data1[args] = JSON.stringify(data1[args]);
				client.hmset(data.character, data1);
				fchat.sendMessage(green("Info")+" The character "+cyan(args)+" was created by "+cyan(data.character)+"!", channel);
				cmdHandler.characterCreation("Registered!", data);
				return 0;
			}
		});
	}
	
	cmdHandler.edit = function (args, data) {
		args = args.trim();
		// !edit Name to Sophie
		let corte1 = args.split(' to '); // Name, Sophie
		if (corte1.length != 2) { fchat.sendMessage(red("Error!")+" Example: !edit Name to Sophie", channel); return 0; }
		
		let item = corte1[0];
		let value = corte1[1];
		
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fchat.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let player = JSON.parse(data1[data1.selected]);
			if (player.editable.indexOf(item) == -1) { fchat.sendMessage(red("Error!")+" Information not found", channel); return 0; }
			player[item] = value;
			fchat.sendMessage(green("Info")+" Information changed!", channel);
			data1[data1.selected] = JSON.stringify(player);
			client.hmset(data.character, data1);
		});
	}
	
	cmdHandler.sheet1 = function (args, data) {
		client.hgetall(data.character, function (err, data1) {
			if (data1 == null) { fchat.sendMessage(red("Error!")+" Player not found.", channel); return 0; }
			let pj = new Personaje(data1);
			fchat.sendMessage(generarHoja1(pj), channel);
		});
	}
	
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CREACION DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
	
	if (channel == mainChannel) {
		fchat.addPrivateMessageListener(function(parent, data) {
			if (!data || !data.message || !(data.message.length > 0) || data.message[0] == "!") { return 0; }
			let args = data.message.trim();
			cmdHandler.characterCreation(args, data);
		});
	}
	
	cmdHandler.characterCreation = function (args, data) {			//Estados: 
		client.hgetall(data.character, function (err, data1) { if (data1 == null) { return 0; }
			let bodyparts = ["fingers","lips","tits","sex","ass","feet"];
			let pj = JSON.parse(data1[data1.selected]); if (pj.creationStage == "Done") { return 0; }
			console.log(args);
			if (args == "Registered!") { fchat.sendPrivMessage(data.character, 
			"Welcome to Third Season! This is the new character creation process. Don't worry, I'll guide you trough! Choose your best attack body part (Options: lips, fingers, tits, sex, ass, feet. Just type it in~)"
			); return 0; }
			
			if (pj.creationStage == "best attack") {
				args = args.toLowerCase();
				if (bodyparts.indexOf(args) == -1) { fchat.sendPrivMessage(data.character, "Invalid best attack body part. Options: lips, fingers, tits, sex, ass, feet. Just type it in~"); return 0; }
				pj["atk"+args] = 3;
				fchat.sendPrivMessage(data.character, 
				"Now choose a good attack body part!"
				);
				pj.creationStage = "good attack 1";
				data1[data1.selected] = JSON.stringify(pj);
				client.hmset(data.character, data1);
				return 0;
			}
			if (pj.creationStage == "good attack 1") {
				args = args.toLowerCase();
				if (bodyparts.indexOf(args) == -1) { fchat.sendPrivMessage(data.character, "Invalid good attack body part. Options: lips, fingers, tits, sex, ass, feet. Just type it in~"); return 0; }
				pj["atk"+args] = 2;
				fchat.sendPrivMessage(data.character, 
				"Now choose another good attack body part!"
				);
				pj.creationStage = "good attack 2";
				data1[data1.selected] = JSON.stringify(pj);
				client.hmset(data.character, data1);
				return 0;
			}
			if (pj.creationStage == "good attack 2") {
				args = args.toLowerCase();
				if (bodyparts.indexOf(args) == -1) { fchat.sendPrivMessage(data.character, "Invalid good attack body part. Options: lips, fingers, tits, sex, ass, feet. Just type it in~"); return 0; }
				pj["atk"+args] = 2;
				fchat.sendPrivMessage(data.character, 
				"Now choose an average attack body part!"
				);
				pj.creationStage = "average attack 1";
				data1[data1.selected] = JSON.stringify(pj);
				client.hmset(data.character, data1);
				return 0;
			}
			if (pj.creationStage == "average attack 1") {
				args = args.toLowerCase();
				if (bodyparts.indexOf(args) == -1) { fchat.sendPrivMessage(data.character, "Invalid average attack body part. Options: lips, fingers, tits, sex, ass, feet. Just type it in~"); return 0; }
				pj["atk"+args] = 1;
				fchat.sendPrivMessage(data.character, 
				"Now choose another average attack body part!"
				);
				pj.creationStage = "average attack 2";
				data1[data1.selected] = JSON.stringify(pj);
				client.hmset(data.character, data1);
				return 0;
			}
			if (pj.creationStage == "average attack 2") {
				args = args.toLowerCase();
				if (bodyparts.indexOf(args) == -1) { fchat.sendPrivMessage(data.character, "Invalid average attack body part. Options: lips, fingers, tits, sex, ass, feet. Just type it in~"); return 0; }
				pj["atk"+args] = 1;
				fchat.sendPrivMessage(data.character, 
				"Now choose your best defense body part!"
				);
				pj.creationStage = "best defense";
				for (i in bodyparts) {
					if (pj["atk"+bodyparts[i]] == undefined) { pj["atk"+part] = 0; }
				}
				data1[data1.selected] = JSON.stringify(pj);
				client.hmset(data.character, data1);
				return 0;
			}
			
			
			
			//,"adh-cbbdce8a953436b609a9":{"plugins":["BF 3rd Season"],"name":"Testing?"}
			
		});
	}
	
	
	return cmdHandler;
};