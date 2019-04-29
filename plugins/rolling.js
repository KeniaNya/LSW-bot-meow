var fChatLibInstance;
var channel;
var actions = ["kiss","rub","finger","suck"];
var bodyparts = ["lips","nipples","pussy/cock","neck","belly","butt"];
var bottle = [];

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.bottlejoin = function (args, data) {
		var indice = busca(bottle, data.character);
		if (indice < 0) {
			bottle.push(data.character);
			fChatLibInstance.sendMessage("[color=cyan]" + data.character + " has joined.[/color]", channel);
		} else {
			fChatLibInstance.sendMessage("[color=gray]" + data.character + " has already joined.[/color]", channel);
		}
	}
	
	cmdHandler.bottleleave = function (args, data) {
		var indice = busca(bottle, data.character);
		if (indice > -1) {
			bottle.splice(indice, 1);
			fChatLibInstance.sendMessage("[color=gray]" + data.character + " has left.[/color]", channel);
		} else {
			fChatLibInstance.sendMessage("[color=gray]" + data.character + " wasn't in.[/color]", channel);
		}
	}
	
	cmdHandler.bottleremove = function (args, data) {
		var indice = busca(bottle, args);
		if (indice > -1) {
			bottle.splice(indice, 1);
			fChatLibInstance.sendMessage("[color=gray]" + args + " has been removed.[/color]", channel);
		} else {
			fChatLibInstance.sendMessage("[color=gray]" + args + " wasn't in or wasn't found.[/color]", channel);
		}
	}
	
	cmdHandler.bottleplayers = function (args, data) {
		if (bottle.length > 0) {
			fChatLibInstance.sendMessage("[color=cyan]Current players:[/color] " + bottle.toString(), channel);
		} else {
			fChatLibInstance.sendMessage("[color=gray]There are no players.[/color]", channel);
		}
	}
	
	cmdHandler.bottleend = function (args, data) {
		bottle = [];
		fChatLibInstance.sendMessage("[color=gray]Everyone has been removed from the bottle game.[/color]", channel);
	}
	
	cmdHandler.spin = function (args, data) {
		var playerid = busca(bottle, data.character);
		if (playerid < 0) {
			fChatLibInstance.sendMessage("[color=gray]You're not in the bottle game.[/color]", channel);
			return 0;
		}
		if (bottle.length < 2) {
			fChatLibInstance.sendMessage("[color=gray]Not enough players.[/color]", channel);
			return 0;
		}
		bottle.splice(playerid, 1);
		//fChatLibInstance.sendMessage("[color=gray]" + data.character + " spins the bottle![/color]", channel);
		var destiny = bottle[Math.floor(Math.random() * bottle.length)];
		var action = actions[Math.floor(Math.random() * actions.length)];
		var bodypart = bodyparts[Math.floor(Math.random() * bodyparts.length)];
		bottle.push(data.character);
		var message = "[user]" + data.character + "[/user] rolls the foreplay dice and spins a bottle, getting the result of [color=red]~ ";
		message += "[color=pink]❤️ [color=cyan]" + action + " [color=yellow]and[/color] " + bodypart + "[/color] ❤️[/color] ~[/color] with the victim being: ";
		message += "[color=pink]❤️ [user]" + destiny + "[/user] ❤️[/color]";
		fChatLibInstance.sendMessage(message, channel);
	}
	
	return cmdHandler;
};

function busca(lista, nombre) {
    var j = -1;
    for (var i = 0; i < lista.length; i++) {
        if (lista[i] == nombre) {
            j = i;
        }
    }
    return j;
}