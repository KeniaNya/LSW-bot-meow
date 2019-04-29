var fChatLibInstance;
var channel;
var players = [];
var jsonfile = require('jsonfile');
var kinks = jsonfile.readFileSync("./plugins/etc/kinks.json");
var monsters = jsonfile.readFileSync("./plugins/etc/mons.json");
var random_kink = "";
var misses = 0;
var cushions = 0;
var cookies = 0;
var buttons = 0;
var g = "[color=green]"; var y = "[color=yellow]"; var r = "[color=red]"; var ec = "[/color]";

var bbcouch = "A spring-loaded boxing glove fires up from under the cushion, smashing into their crotch! It pushes them a couple inches off the cushion before retreating, firing again as they fall, and again until they stop falling on the cushion."
var bbbondage = "A leg spreader snaps from the floor and pushes them off their feet, keeping their legs parted wide as they land into straps that hold their hips and hands still! Their crotch is now very exposed on the hard floor."

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.roll = function (args, data) {
		let numbers = args.split("d");
		if (numbers.length != 2) { return 0; }
		let howmany = parseInt(numbers[0]); if (isNaN(howmany) || howmany < 1 || howmany > 5) { return 0; }
		let sizes = [4,6,8,10,12];
		let size = parseInt(numbers[1]); if (sizes.indexOf(size) == -1) { return 0; }
		let result = ""; let o = "[eicon]"; let c = "[/eicon]";
		for (let i = 0; i < howmany; i++) {
			let roll = Math.ceil(Math.random()*size);
			result += o+roll+"_d"+size+c;
		}
		fChatLibInstance.sendMessage(result, channel);
	}
	
	cmdHandler.bondage = function (args, data) {
	    let request = args.toLowerCase();
		let types = ["light","weak","small","heavy","strong","large"];
		let index = -1;
		for (let i = 0; i < types.length; i++) { if (request == types[i]) { index = i; } }
		if (index == -1) { fChatLibInstance.sendMessage("You have to request a category. Options: light, weak, small, heavy, strong, large", channel); return 0; }
		var light = ['blindfold', 'muzzle gag', 'pink fuzzy hancuffs', 'cloth gag', 'rope with a chest harness', 'ball gag'];
        var heavy = ['nosehooks', 'nipple clamps', 'heavy wrist cuffs connected to heavy ankle cuffs via chains through a thick O-ring', 'muzzle gag', 'latex bodysuit', 'o-ring gag', 'heavy wrist cuffs', 'slave collar with leash', 'straightjacket', 'gas mask', 'latex bodysuit', 'gimp mask'];
		let toy = ""; let color = "";
        if (index <= 2) { toy = light[Math.floor(Math.random()*light.length)]; color = "blue"; } else { toy = heavy[Math.floor(Math.random()*heavy.length)]; color = "red"; }
		if (Math.floor(Math.random()*2) == 0) {
			fChatLibInstance.sendMessage("/me forms a [b][color="+color+"]"+color+"[/color][/b] grid in front of "+data.character+"...", channel);
			fChatLibInstance.sendMessage("/me ... where a [b][color="+color+"]"+toy+"[/color][/b] materializes before them!", channel);
		} else {
			fChatLibInstance.sendMessage("/me opens a hole in the floor and out pops a [b][color="+color+"]"+toy+"[/color][/b], then begins hovering towards "+data.character+" slowly...", channel);
		}
	}
	
	cmdHandler.monsterize = function (args, data) {
		var mon = monsters[Math.floor(Math.random()*monsters.length)];
		fChatLibInstance.sendMessage("/me zaps "+data.character+" with a blue beam of light which transforms them into a/an [url=http://monstergirlencyclopedia.wikia.com/wiki/"+mon+"]"+mon+"[/url]!", channel);
	}
	
	cmdHandler.rps = function (args, data) {
		let result = [r+"rock"+ec, y+"paper"+ec, g+"scissors"+ec]; 
		let pick = result[Math.floor(Math.random() * 3)];
		fChatLibInstance.sendMessage(data.character + " has chosen " + pick + "!", channel);
	}
	
	cmdHandler.flip = function (args, data) {
		let result = [g+"heads"+ec, r+"tails"+ec];
		let pick = result[Math.floor(Math.random() * 2)];
		fChatLibInstance.sendMessage(data.character + " flips the coin and gets " + pick + "!", channel);
	}
	
	cmdHandler.bondagebutton = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " walks up to the bondage equipment and pushes a button...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - buttons));
		if (recamara == 0) {
			if (channel != "adh-c1ca2804565e31a32513") {
				fChatLibInstance.sendMessage(r+"The machine activates! " + data.character + " is now stripped nude and bound in heavy ropes![/color]", channel);
			} else {
				fChatLibInstance.sendMessage(r+"The machine activates on "+data.character+"! "+bbbondage+ec, channel);
			}
			buttons = 0;
		} else {
			buttons += 1;
			fChatLibInstance.sendMessage(g+"The machine clicks and nothing happens.[/color] (Used buttons: "+buttons+")", channel);
		}
	}
	
	cmdHandler.trigger = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " grabs the gun, spins the cylinder and points it at their head, then slowly pulls the trigger...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - misses));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(r+"The gun fires! " + data.character + " blows their brains out. Game over.[/color][icon]"+data.character+"[/icon][eicon]bloodies[/eicon]", channel);
			misses = 0;
		} else {
			misses += 1;
			fChatLibInstance.sendMessage(g+"The gun clicks and nothing happens.[/color] (Used chambers: "+misses+")", channel);
		}
	}
	cmdHandler.shoot = cmdHandler.trigger;
	cmdHandler.rr = cmdHandler.trigger;
	
	
	
	cmdHandler.couch = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " slowly sits on the couch and...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - cushions));
		if (recamara == 0) {
			let kenia = "[eicon]keniarolling[/eicon]";
			let milly = "[eicon]millyceiling[/eicon]";
			let temp = "[eicon]explosion[/eicon]";
			if (data.character == "Kenia Nya") { temp = kenia; }
			if (data.character == "Milly The Succubus") { temp = milly; }
			if (channel != "adh-c1ca2804565e31a32513") {
				fChatLibInstance.sendMessage(r+"The airbag goes off! " + data.character + " flies up in the air![/color] "+temp, channel);
			} else {
				fChatLibInstance.sendMessage(r+"The couch activates on "+data.character+"! "+bbcouch+ec+temp, channel);
			}
			cushions = 0;
		} else {
			cushions += 1;
			let kenia = "[eicon]couch1[/eicon][eicon]couch2[/eicon]";
			let milly = "[eicon]millycouch1[/eicon][eicon]millycouch2[/eicon]";
			let puppy = "[eicon]ScruffyCouch[/eicon]";
			let temp = "[eicon]couch[/eicon]";
			if (data.character == "Kenia Nya") { temp = kenia; }
			if (data.character == "Milly The Succubus") { temp = milly; }
			if (data.character == "Scruffy Puppy") { temp = puppy; }
			fChatLibInstance.sendMessage(g+"Nothing happens, the couch is very comfortable.[/color] "+temp+" (Used cushions: "+cushions+")", channel);
		}
	}
	
	cmdHandler.cookie = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " asked the bot for a cookie~[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - cookies));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(r+"But instead of a cookie, the bot sends them a HARD kick to the crotch! " + data.character + " flies up in the air a few inches because of it![/color]", channel);
			cookies = 0;
		} else {
			cookies += 1;
			fChatLibInstance.sendMessage(g+"The bot smiles and hands out a tasty cookie![/color] 🍪 (Cookies given: "+cookies+")", channel);
		}
	}
	
	cmdHandler.bdjoin = function (args, data) {
		if (players.length == 2) { fChatLibInstance.sendMessage("Can't join. This game is for two players only", channel); return 0; }
		if (players.length == 1 && players[0].name == data.character) { fChatLibInstance.sendMessage("You're already in", channel); return 0; }
		players.push({name: data.character, money: 0, modifier: 0});
		fChatLibInstance.sendMessage(data.character + " has joined the bondage dice game!", channel);
	}
	
	cmdHandler.bdend = function (args, data) {
		players = [];
		fChatLibInstance.sendMessage("Game finished.", channel);
	}
	
	cmdHandler.bdroll = function (args, data) {
		if (players.length < 2) { fChatLibInstance.sendMessage("You need 2 players", channel); return 0; }
		let multiplier = 1;
		let dice0 = Math.ceil(Math.random() * 20);
		let result0 = dice0 + players[0].modifier;
		let dice1 = Math.ceil(Math.random() * 20);
		let result1 = dice1 + players[1].modifier;
		let profit = 0;
		while (result0 == result1) {
			multiplier *= 2;
			fChatLibInstance.sendMessage(players[0].name+" and "+players[1].name+" had the same result of "+result0+", rerolling and multplying the result by "+multiplier+".", channel);
			dice0 = Math.ceil(Math.random() * 20);
			result0 = dice0 + players[0].modifier;
			dice1 = Math.ceil(Math.random() * 20);
			result1 = dice1 + players[1].modifier;
		}
		let msg1 = players[0].name+" rolled a "+dice0+"+("+players[0].modifier+")="+result0+", ";
		let msg2 = players[1].name+" rolled a "+dice1+"+("+players[1].modifier+")="+result1+", ";
		let winner = 1;
		if (result0 > result1) { winner = 0; }
		profit = Math.abs(result0 - result1) * multiplier;
		players[winner].money += profit;
		let msg3 = "the winner is "+players[winner].name+"! they win $"+profit+"! They now have $"+players[winner].money+" in total.";
		fChatLibInstance.sendMessage(msg1+msg2+msg3, channel);
	}
	
	cmdHandler.bdspend = function (args, data) {
		let cantidad = parseInt(args);
		if (isNaN(cantidad) || cantidad < 1) { fChatLibInstance.sendMessage("Money ammount should be a positive number (without the $ or the .00)", channel); return 0; }
		let n = -1;
		if (data.character == players[0].name) { n = 0; }
		if (data.character == players[1].name) { n = 1; }
		if (n == -1) { return 0; }
		if (players[n].money < cantidad) { fChatLibInstance.sendMessage("Not enough money, you have $"+players[n].money+".", channel); return 0; }
		players[n].money -= cantidad;
		fChatLibInstance.sendMessage(data.character+" spent $"+cantidad+", they now have $"+players[n].money+" left.", channel);
	}
	
	cmdHandler.bdaddmodifier = function (args, data) {
		let cantidad = parseInt(args);
		if (isNaN(cantidad)) { fChatLibInstance.sendMessage("Modifier should be a number.", channel); return 0; }
		let n = -1;
		if (data.character == players[0].name) { n = 0; }
		if (data.character == players[1].name) { n = 1; }
		if (n == -1) { return 0; }
		players[n].modifier += cantidad;
		fChatLibInstance.sendMessage(data.character+" has now a modifier of "+players[n].modifier+".", channel);
	}
	
	cmdHandler.bdmoney = function (args, data) {
		let n = -1;
		if (data.character == players[0].name) { n = 0; }
		if (data.character == players[1].name) { n = 1; }
		if (n == -1) { return 0; }
		fChatLibInstance.sendMessage(data.character+" has $"+players[n].money+".", channel);
	}
	
	cmdHandler.bdaddmoney = function (args, data) {
		let cantidad = parseInt(args);
		if (isNaN(cantidad)) { fChatLibInstance.sendMessage("Money ammount should be a number.", channel); return 0; }
		let n = -1;
		if (data.character == players[0].name) { n = 0; }
		if (data.character == players[1].name) { n = 1; }
		if (n == -1) { return 0; }
		players[n].money += cantidad;
		fChatLibInstance.sendMessage(data.character+" has now $"+players[n].money+".", channel);
	}
	
	cmdHandler.kinktionary = function (args, data) {
		let indices1 = Object.keys(kinks.kinks);
		let random_i = Math.floor(Math.random() * 17);
		let random_group = kinks.kinks[indices1[random_i]].group;
		let random_kink_list = kinks.kinks[indices1[random_i]].items;
		console.log(random_group);
		let random_k = Math.floor(Math.random() * random_kink_list.length);
		random_kink = random_kink_list[random_k].name;
		let random_kink_description = random_kink_list[random_k].description;
		console.log(random_kink);
		console.log(random_kink_description);
		random_group = random_group.replace(/&amp;/g,"&");
		random_group = random_group.replace(/&#039;/g,"'");
		random_group = random_group.replace(/&rsquo;/g,"'");
		random_group = random_group.replace(/&quot;/g,'"');
		random_kink_description = random_kink_description.replace(/&amp;/g,"&");
		random_kink_description = random_kink_description.replace(/&#039;/g,"'");
		random_kink_description = random_kink_description.replace(/&rsquo;/g,"'");
		random_kink_description = random_kink_description.replace(/&quot;/g,'"');
		fChatLibInstance.sendMessage(y+"Group: [color=cyan]"+random_group+"[/color], Description: [/color]"+random_kink_description, channel);
	}
	
	cmdHandler.kinktionaryanswer = function (args, data) {
		let temp = random_kink;
		fChatLibInstance.sendMessage("The answer was: "+temp, channel);
		random_kink = "";
	}
	
	fChatLibInstance.addMessageListener(function(parent, data) {
		if (random_kink == "") { return 0; }
		if (data && data.message && data.message.length > 2) {
			if (data.message.toLowerCase() == random_kink.toLowerCase()) {
				fChatLibInstance.sendMessage(g+data.character+" has guessed correctly![/color]", channel);
				random_kink = "";
			} else {
				//fChatLibInstance.sendMessage(data.character+" is wrong!", channel);
			}
		}
	});
	
	return cmdHandler;
};