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
var cookies2 = 0;
var buttons = 0;
var awoos = 0;
var purrs = 0;
var teas = 0;
var boops = 0;
var spins = 0;
var twerks = 0;
var g = "[color=green]"; var y = "[color=yellow]"; var r = "[color=red]"; var ec = "[/color]"; var b = "[color=blue]";

var graves = [];
var rings = [];
var trapped = "";

var bbcouch = "A spring-loaded boxing glove fires up from under the cushion, smashing into their crotch! It pushes them a couple inches off the cushion before retreating, firing again as they fall, and again until they stop falling on the cushion."
var bbbondage = "A leg spreader snaps from the floor and pushes them off their feet, keeping their legs parted wide as they land into straps that hold their hips and hands still! Their crotch is now very exposed on the hard floor."
var bbcouch2 = "The couch snaps backwards where they sit to lie flat as a bed, and ropes spring out to bind their arms and legs apart. The footrest swings up and over the edge of the couch, smashing their crotch hard! It resets and waits for one minute before triggering and smashing again, repeating until they escape or are set free!"
var bbcookies = "The bot smiles and hands out a basket! As she thrusts it at them, the bottom of the basket gives out, revealing it's actually full of metal chunks that fly towards their hips. The cold, hard weights smash at high speeds into their crotch, pushing them down to the floor to pin their groin under a small mountain of metal!"

var murraystuff = ["[color=red]Bill Murray walked into the room dressed as a zombie as a prank, but [user] shot and killed him in a panic![/color]", "[color=orange]Slimer came careening through the room with Dr. Venkman giving chase, but wasn't able to bust the ghost before [user] got slimed![/color]", "[color=yellow][user] spoke up against Frank Cross's [i]Scrooge[/i] commercial and was fired as a result. On Christmas Eve![/color]", "[color=green][user] was about to forfeit to the Monstars for lacking a 5th player, but Bill Murray showed up just in time to save the day![/color]", "[color=cyan]Pittsburgh weatherman Phil Connors was stuck reliving Groundhog Day over and over again. [user] was lucky enough to get to go bowling with him most of those days, though![/color]", "[color=blue][user] just landed a new job as an apprentice groundskeeper under Carl Spackler. Now go get that gopher![/color]"];

var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1", {db: 0});

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	users = fChatLibInstance.onlineUsers;
	
	cmdHandler.purr = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " starts to purr...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - purrs));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(g+"The bot gives double ear scritches to " + data.character + "! They are the boss cat now~[/color]", channel);
			purrs = 0;
		} else {
			purrs += 1;
			fChatLibInstance.sendMessage(y+"The bot gives them nice ear scritches~[/color] (Purrs: "+purrs+")", channel);
		}
	}
	
	
	cmdHandler.cars = function(args, data) {
		fChatLibInstance.sendMessage("🚗🚗🚗🚗🚗", channel);
	}
	
	cmdHandler.billmurray = function (args, data) {
		let message = murraystuff[Math.floor(Math.random() * murraystuff.length)];
		message = message.split("[user]").join("[user]"+data.character+"[/user]");
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.nohomo = function (args, data) {
		fChatLibInstance.sendMessage("[icon]Bot Announcer[/icon] [color=yellow][user]"+data.character+"[/user] has negated the last gay thing that happened to them![/color]", channel);
	}
	
	
	cmdHandler.pinkbutton = function (args, data) {
		fChatLibInstance.sendMessage(y+data.character+" notices a weird pink button and decides to press it... only to suddenly see how the bot suddenly strips and traps them in a hanging bondage harness! The bot then shows a pervert smile and starts to fuck the trapped one out of nowhere![/color]", channel);
		fChatLibInstance.sendMessage("!fuck to "+data.character, channel);
		trapped = data.character;
	}
	
	cmdHandler.greenbutton = function (args, data) {
		if (trapped == "") { fChatLibInstance.sendMessage(g+data.character+" pushes a green button but nothing happens..."+ec, channel); return 0; }
		fChatLibInstance.sendMessage(g+data.character+" pushes a green button and "+trapped+" is released from the fuck machine!"+ec, channel);
		trapped = "";
	}
	
	cmdHandler.redbutton = function (args, data) {
		if (trapped == "") { fChatLibInstance.sendMessage(r+data.character+" pushes a red button but nothing happens..."+ec, channel); return 0; }
		fChatLibInstance.sendMessage(r+data.character+" pushes a red button and makes the bot keep on fucking "+trapped+" some more!"+ec, channel);
		fChatLibInstance.sendMessage("!fuck to "+trapped, channel);
	}
	
	cmdHandler.bluebutton = function (args, data) {
		if (trapped == "") { fChatLibInstance.sendMessage(b+data.character+" pushes a blue button but nothing happens..."+ec, channel); return 0; }
		fChatLibInstance.sendMessage(b+data.character+" pushes a blue button and makes the bot ass fuck "+trapped+" nice and deep!"+ec, channel);
		fChatLibInstance.sendMessage("!assfuck to "+trapped, channel);
	}
	
	cmdHandler.whitebutton = function (args, data) {
		if (trapped == "") { fChatLibInstance.sendMessage(data.character+" pushes a white button but nothing happens...", channel); return 0; }
		fChatLibInstance.sendMessage(data.character+" pushes a white button and makes the bot facefuck "+trapped+" all the way!", channel);
		fChatLibInstance.sendMessage("!facefuck to "+trapped, channel);
	}
	
	cmdHandler.twerk = function (args, data) {
		fChatLibInstance.sendMessage(g + data.character + " starts wiggling their butt like crazy...![/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - twerks));
		if (recamara == 0) {
			let people = ["Mary Aasimar","Lydia Cadell"];
			let selectedPeople = people[Math.floor(Math.random() * people.length)];
			fChatLibInstance.sendMessage(r+"[user]"+selectedPeople+"[/user] suddenly appears and gives "+data.character+" a hard cockspank!"+ec, channel);
			twerks = 0;
		} else {
			twerks += 1;
		}
	}
	
	
	cmdHandler.propose = function (args, data) {
		let temp = args;
		args = args.split('to ')[1];
		if (args === undefined) { args = temp; }
		fChatLibInstance.sendMessage(data.character+" gets down on their knee in front of "+args+" and opens a small case with a shiny ring! they slowly put it on their finger and say 'would you marry me?' (they have 5 minutes to reply with !accept or !decline)", channel);
		let ring = {person1: data.character, person2: args};
		
		ring.timer = setTimeout(
	
			function ringTimeout() {
				fChatLibInstance.sendMessage(rings[0].person2+" didn't reply to "+rings[0].person1+". What a sad story...", channel);
				clearTimeout(rings[0].timer);
				let removed = rings.splice(0, 1);
				removed = 0;
			}
			,300000);
		
		rings.push(ring);
	}
	
	cmdHandler.accept = function (args, data) {
		for (let i = 0; i < rings.length; i++) {
			if (rings[i].person2 == data.character) {
				fChatLibInstance.sendMessage(rings[i].person2+" said Yes!, they are now engaged with "+rings[i].person1+"! I just hope they will invite us to the wedding~! What a happy story!", channel);
				clearTimeout(rings[i].timer);
				let removed = rings.splice(i, 1);
				removed = 0;
			}
		}
	}
	
	cmdHandler.decline = function (args, data) {
		for (let i = 0; i < rings.length; i++) {
			if (rings[i].person2 == data.character) {
				fChatLibInstance.sendMessage(rings[i].person2+" said No... and they made "+rings[i].person1+" really sad...", channel);
				clearTimeout(rings[i].timer);
				let removed = rings.splice(i, 1);
				removed = 0;
			}
		}
	}
	
	
	
	cmdHandler.gravekeeper = function (args, data) {
		client.send_command("scan", ["0", "count", "10000"], function(err, reply) {
			if (reply == null) { console.log("Error! "+err); return 0; }
			//console.log(reply[1].join(", "));
			let userList = reply[1];
			let looking = [];
			for (let i = 0; i < userList.length; i++) {
				
				client.hgetall(userList[i], function (err, chara) {
					if (chara == null) { console.log("Error at "+userList[i]); return 0; }
					if (users[userList[i]] != undefined) {
						if (users[userList[i]].status != "offline" && users[userList[i]].status != undefined) {
							looking.push(userList[i]);
						}
					}
					if (i == (userList.length - 1)) {
						if (looking.length == 0) { fChatLibInstance.sendMessage("OMG I CAN'T BELIEVE THIS HAPPENED! IT'S A MIRACLE! PLEASE NOTIFY KENIA NYA WITH A SCREENSHOT, HAHAHA", channel); return 0; }
						
						let random1 = looking[Math.floor(Math.random()*looking.length)];
						let random2 = looking[Math.floor(Math.random()*looking.length)];
						
						let message = "[eicon]skull[/eicon] [user]"+data.character+"[/user][color=red], thou hast awoken me from my ancient slumber! Now amuseth me so I might returneth from whence I came. Giveth oral sex to [user]"+random1+"[/user] or receiveth anal sex from [user]"+random2+"[/user] to appeaseth me, or ye shall be dragged into the tentacle tomb forevermore! You have 30 seconds to decide![/color] (Use !gravekeeper_A or !gravekeeper_B to choose your destiny)";
						
						fChatLibInstance.sendMessage(message, channel);
						
						let grave = {name: data.character, A: random1, B: random2};
						
						grave.timer = setTimeout(
	
	function graveFailed() {
		fChatLibInstance.sendMessage("[eicon]skull[/eicon] [color=red] [user]"+graves[0].name+"[/user] [b]YOU HAVE FAILED! NOW SUFFER THE TENTACLES![/b][/color]", channel);
		clearTimeout(graves[0].timer);
		let removed = graves.splice(0, 1);
		removed = 0;
	}
	
						, 30000);
						
						graves.push(grave);
						
					}
				});
			}
		});
	}
	
	
	
	cmdHandler.gravekeeper_A = function(args, data) {
		for (let i = 0; i < graves.length; i++) {
			if (graves[i].name == data.character) {
				let selected = graves[i].A;
				fChatLibInstance.sendMessage("[eicon]skull[/eicon] [color=red] [user]"+data.character+"[/user] has chosen [user]"+selected+"[/user] to give oral sex to![/color]", channel);
				clearTimeout(graves[i].timer);
				let removed = graves.splice(i, 1);
				removed = 0;
			}
		}
	}
	
	cmdHandler.gravekeeper_B = function(args, data) {
		for (let i = 0; i < graves.length; i++) {
			if (graves[i].name == data.character) {
				let selected = graves[i].B;
				fChatLibInstance.sendMessage("[eicon]skull[/eicon] [color=red] [user]"+data.character+"[/user] has chosen [user]"+selected+"[/user] to receive anal sex from![/color]", channel);
				clearTimeout(graves[i].timer);
				let removed = graves.splice(i, 1);
				removed = 0;
			}
		}
	}
	
	
	
	
	
	
	
	
	cmdHandler.bartest = function (args, data) {
		let number = parseInt(args);
		if (number < 0 || number > 100 || isNaN(number)) { return 0; }
		let total = 100;
		let p = Math.round(1000 * number / total);
		let eicon = function(name) { return "[eicon]"+name+"[/eicon]"; }
		let e1 = eicon("d_0");
		let e2 = eicon("m_0");
		let e3 = eicon("m_0");
		//let e4 = eicon("m_0");
		let e4 = eicon("d_f_0");
		
		//parte 1
		if (p > 0) { e1 = eicon("d_1"); }
		if (p > 125) { e1 = eicon("d_2"); }
		if (p > 250) { e1 = eicon("d_3"); }
		//parte 2
		if (p > 250) { e2 = eicon("d_m_1"); }
		if (p > 375) { e2 = eicon("d_m_2"); }
		if (p > 500) { e2 = eicon("m_3"); }
		//parte 3
		if (p > 500) { e3 = eicon("d_m_1"); }
		if (p > 625) { e3 = eicon("d_m_2"); }
		if (p > 750) { e3 = eicon("m_3"); }
		//parte 4
		//if (p > 60) { e4 = eicon("d_m_1"); }
		//if (p > 70) { e4 = eicon("d_m_2"); }
		//if (p > 80) { e4 = eicon("m_3"); }
		//parte 5
		if (p > 750) { e4 = eicon("d_f_1"); }
		if (p > 875) { e4 = eicon("d_f_2"); }
		
		fChatLibInstance.sendMessage(e1+e2+e3+e4, channel);
	}
	
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
	
	cmdHandler.bondageattack = function (args, data) {
		if (!fChatLibInstance.roomMods[channel].includes(data.character)) { return 0; }
		fChatLibInstance.sendMessage(y + data.character + " walks up to the bondage equipment and pushes a button...[/color]", channel);
		fChatLibInstance.sendMessage(r+"The machine activates! " + args + " is now stripped nude and bound in heavy ropes![/color]", channel);
	}
	
	cmdHandler.fish = function (args, data) {
		fChatLibInstance.sendMessage("/me [color=green]goes fishing and returns with a nice salmon, then she cooks it and serves it to "+data.character+" in a nice dish with some vegetables on the side. 'Provecho!'[/color]", channel);
	}
	
	cmdHandler.spin = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " starts to spin...![/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - spins));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(r+"They spin way too fast! " + data.character + " is now helicopter flying out of the room![/color]", channel);
			spins = 0;
		} else {
			spins += 1;
			fChatLibInstance.sendMessage(g+"They spin and spin and spin~ But nothing else happens![/color] (Spin power: "+spins+")", channel);
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
	
	cmdHandler.awoo = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " starts to awoo...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - awoos));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(r+"The bot puts a muzzle on " + data.character + "'s snout! That'll keep them quiet~[/color]", channel);
			awoos = 0;
		} else {
			awoos += 1;
			fChatLibInstance.sendMessage(g+"And they get away with it~[/color] (Awoos: "+awoos+")", channel);
		}
	}
	
	cmdHandler.puppy = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " calls the boopin puppy...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - boops));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(r+"The puppy gives " + data.character + "'s nose a [eicon]kittyboop[/eicon]! Knocking them uncounsious![/color]", channel);
			boops = 0;
		} else {
			boops += 1;
			fChatLibInstance.sendMessage(g+"The puppy just loads one in the chamber [eicon]boopingfinger[/eicon] "+data.character+" is safe for now...[/color] (Failed boops: "+boops+")", channel);
		}
	}
	
	cmdHandler.tea = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " request a cup of tea and the bot promptly prepares it and rushes at them...[/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - teas));
		if (recamara == 0) {
			fChatLibInstance.sendMessage(r+"The bot trips and spills the hot tea all over " + data.character + "![/color] [url=https://m.youtube.com/watch?v=GaS4PDRGjiY]like this~[/url]", channel);
			teas = 0;
		} else {
			teas += 1;
			fChatLibInstance.sendMessage(g+"The bot delivers the tea, it's pretty good~![/color] (Cups served so far: "+teas+")", channel);
		}
	}
	
	
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
				if (Math.floor(Math.random() * 2) == 0) {
					fChatLibInstance.sendMessage(r+"The couch activates on "+data.character+"! "+bbcouch+ec+temp, channel);
				} else {
					fChatLibInstance.sendMessage(r+"The couch activates on "+data.character+"! "+bbcouch2+ec+temp, channel);
				}
			}
			cushions = 0;
		} else {
			cushions += 1;
			let kenia = "[eicon]couch1[/eicon][eicon]couch2[/eicon]";
			let milly = "[eicon]millycouch1[/eicon][eicon]millycouch2[/eicon]";
			let puppy = "[eicon]ScruffyCouch[/eicon]";
			let kristine = "[eicon]kristinetable1[/eicon]";
			let temp = "[eicon]couch[/eicon]";
			if (data.character == "Kenia Nya") { temp = kenia; }
			if (data.character == "Milly The Succubus") { temp = milly; }
			if (data.character == "Scruffy Puppy") { temp = puppy; }
			if (data.character == "Kristine Flink") { temp = kristine; }
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
	
	cmdHandler.cookies = function (args, data) {
		fChatLibInstance.sendMessage(y + data.character + " asked the bot for a lot of cookies~!!![/color]", channel);
		let recamara = Math.floor(Math.random() * (6 - cookies2));
		if (recamara == 0) {
			
			if (channel != "adh-c1ca2804565e31a32513") {
				fChatLibInstance.sendMessage(r+"And they get a MOUNTAIN of cookies! Ending up crushed beneath them~[/color]\n🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪", channel);
			} else {
				fChatLibInstance.sendMessage(r+bbcookies+"[/color]", channel);
			}
			
			cookies2 = 0;
		} else {
			cookies2 += 1;
			fChatLibInstance.sendMessage(g+"The bot smiles and hands out a basket of cookies![/color] 🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 (Baskets given: "+cookies2+")", channel);
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