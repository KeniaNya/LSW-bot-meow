var fs = require('fs');
var fChatLibInstance;
var channel;
var ad_on = false;
var ad_message = "";
var ad_message2 = "";
var target = "";
var yo = "";
var ad = false;

var tiempo;

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	//fChatLibInstance.onlineUsers[data.character].status
	cmdHandler.searchStatus = function (args, data) {
		//if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo" && data.character != "Bella Rossi") { return 0; }
		let reply = "Result: ";
		for (user in fChatLibInstance.onlineUsers) {
			let status = fChatLibInstance.onlineUsers[user].statusMessage.toLowerCase();
			let n = status.search(args.toLowerCase());
			if (n != -1) { reply += "[user]"+user+"[/user] "; }
		}
		fChatLibInstance.sendPrivMessage(data.character, reply);
	}
	
	cmdHandler.searchName = function (args, data) {
		//if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo") { return 0; }
		let reply = "Result: ";
		for (user in fChatLibInstance.onlineUsers) {
			let n = user.toLowerCase().search(args.toLowerCase());
			if (n != -1) { reply += "[user]"+user+"[/user] "; }
		}
		fChatLibInstance.sendPrivMessage(data.character, reply);
	}
	
	cmdHandler.speak1 = function (args, data) {
		//if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo") { return 0; }
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		fChatLibInstance.sendMessage(args, "adh-5b5393f9514b3c25ab71");
	}
	cmdHandler.speak2 = function (args, data) {
		//if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo") { return 0; }
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		fChatLibInstance.sendMessage(args, "adh-ab26b5c3fd556ff4384b");
	}
	cmdHandler.speak3 = function (args, data) {
		//if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo") { return 0; }
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		fChatLibInstance.sendMessage(args, "adh-6901886fee30cce8e3d5");
	}
	cmdHandler.speak4 = function (args, data) {
		//if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo") { return 0; }
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		fChatLibInstance.sendMessage(args, "adh-730b2671384a88f6e578");
	}
	cmdHandler.debuggy = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat" && data.character != "Netrunner Cibo") { return 0; }
		if (data.publico == false) {
			fChatLibInstance.sendPrivMessage(data.character, fChatLibInstance.debuggy(args));
		} else {
			fChatLibInstance.sendMessage(fChatLibInstance.debuggy(args), channel);
		}
	}
	
	/* cmdHandler.listen = function(args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat") { return 0; }
		yo = data.character;
	}
	
	cmdHandler.sendprivate = function (args, data) { // character
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat") { return 0; }
		//arr = args.split(",");
		//target = arr[0];
		target = args;
		yo = data.character;
		fChatLibInstance.sendPrivMessage(data.character, "sending privates to " + target);
	}
	
	cmdHandler.stoplisten = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat") { return 0; }
		target = "";
		yo = "";
		fChatLibInstance.sendPrivMessage(data.character, "stopped");
	} */
	
	cmdHandler.post_ad = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat") { return 0; }
		ad_on = true;
		
		ad_message = "[color=pink][color=purple][b]Hourly announcement:[/b][/color] Remember to check the second room [session=LSW 2]adh-ab26b5c3fd556ff4384b[/session] that you can use when the main one is busy. Also, there's a third OOC room [session=OOC and Games room]adh-6901886fee30cce8e3d5[/session] where you can have casual chatter and discussion or play my other games, check it's description for more info. [color=orange]If you're looking for more traditional combat (using the same game engine) you can head to the [session=Virtual Fight Arena - Dice, Ryona, Rape, Bad endings]adh-730b2671384a88f6e578[/session], a place without kink restrictions![/color] Finally, be sure to check the latest updates in [url=https://sexfightclub.wordpress.com/]the official blog![/url][/color]";
		
		ad_message2 = "[color=pink][color=purple][b]Hourly announcement:[/b][/color] Remember that the MAIN ROOM is this one: [session=Lewd Sexual Wrestling - The sexfight club!]adh-5b5393f9514b3c25ab71[/session] That's where most of the action happens, so be sure to be there so you don't miss it![/color]";
		
		//ad_message = "[url=https://sexfightclub.wordpress.com/2019/04/22/bikini-contest/]The Bikini Contest has started! Please cast your votes![/url]";
		//ad_message2 = "[url=https://sexfightclub.wordpress.com/2019/04/22/bikini-contest/]The Bikini Contest has started! Please cast your votes![/url]";
		
		//fChatLibInstance.sendCommand("LRP", {channel: channel, message: ad_message})
		
		/*
		fChatLibInstance.sendMessage(ad_message, channel);
		fChatLibInstance.sendMessage(ad_message2, "adh-ab26b5c3fd556ff4384b"); // room 2
		fChatLibInstance.sendMessage(ad_message2, "adh-730b2671384a88f6e578"); // rough
		fChatLibInstance.sendMessage(ad_message2, "adh-6901886fee30cce8e3d5"); // ooc
		*/
		clearInterval(tiempo);
		
		//tiempo = setInterval( function() { fChatLibInstance.sendCommand("LRP", {channel: channel, message: ad_message}) }, 3600000 );
		tiempo = setInterval( function() {
			fChatLibInstance.sendMessage(ad_message, channel);
			fChatLibInstance.sendMessage(ad_message2, "adh-ab26b5c3fd556ff4384b"); // room 2
			fChatLibInstance.sendMessage(ad_message2, "adh-730b2671384a88f6e578"); // rough
			fChatLibInstance.sendMessage(ad_message2, "adh-6901886fee30cce8e3d5"); // ooc
		}, 7200000 );
		
	}
	if (ad == false) { setTimeout( function() { cmdHandler.post_ad("",{character: "Kenia Nya"}) }, 10000); ad = true; }
	
	//[color=pink][color=purple][b]Hourly announcement:[/b][/color] Remember to check the second room [session=LSW 2]adh-ab26b5c3fd556ff4384b[/session] that you can use when the main one is busy. Also, there's a third OOC room [session=OOC and Games room]adh-6901886fee30cce8e3d5[/session] where you can have casual chatter and discussion or play my other games, check it's description for more info. Finally, if you like this place and want to help spread the word, send me (the bot) a pm with the command [color=purple][b]!ad[/b][/color] and you'll get a fancy ready-to-copy ad that you can use in public channels (just make sure to respect the rooms' rules regarding ads)[/color]
	
	cmdHandler.stop_ad = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat") { return 0; }
		fChatLibInstance.sendPrivMessage(data.character, "Ad stopped.");
		clearInterval(tiempo);
		ad_on = false;
		ad_message = "";
	}
	
	cmdHandler.ad_status = function (args, data) {
		if (data.character != "Kenia Nya" && data.character != "Darent" && data.character != "Ken the Wildcat") { return 0; }
		fChatLibInstance.sendPrivMessage(data.character, "Ad on: " + ad_on + ", ad message: " + ad_message);
	}
	
	cmdHandler.ad = function (args, data) {
		let ad = fs.readFileSync("./ad2.txt", "utf8");
		fChatLibInstance.sendPrivMessage(data.character, "[noparse]"+ad+"[/noparse]");
	}
	
	fChatLibInstance.addPrivateMessageListener(function(parent, data) {
		if (data && data.message && data.message.length > 2 && data.message[0] == '!') {

			var opts = {
				command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
				argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
			};
			data.publico = false;
			if (typeof cmdHandler[opts.command] === 'function') {
				cmdHandler[opts.command](opts.argument, data);
			} else {
				//not found
			}
		}
		//} else {
			//if (data.character == "Kenia Nya" && data.character == "Darent" && data.character == "Ken the Wildcat") { return 0; }
			//if (yo == "") { return 0; }
			//fChatLibInstance.sendPrivMessage(data.message, yo);
		//}
	});
	
	return cmdHandler;
};