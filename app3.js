var test = {wave:"Hello!"};
var test2 = "test";
console.log([test2].wave);


//var redis = require("redis");
//var jsonfile = require('jsonfile');
//var client = redis.createClient(6379, "192.168.0.18", {db: 0});
//var wait = require('wait.for');
//var saveDir = process.cwd()+"/saves";
//var saveFile = "/base_de_datos.js";

//wait.launchFiber(leer);

//process.exit();

//function leer() {
	//var base_de_datos = jsonfile.readFileSync(saveDir+saveFile);
	//console.log(base_de_datos.length);
	//for (var i = 0; i < base_de_datos.length; i++)	{
		//console.log("escribiendo item " + i);
		//client.hmset(base_de_datos[i].name, base_de_datos[i]);
	//}
//}



//rename
/*
client.hgetall("Slut Boy Chris", function(err, chara) {
	if (chara == null) { console.log("Not found..."); return 0; }
	console.log(chara);
	client.hmset("Incubus Kioros", chara);
	console.log("Done!");
});
*/


/*
client.send_command("scan", ["0", "count", "10000"], function(err, reply) {
	if (reply == null) { console.log("Error! "+err); return 0; }
	//console.log(reply[1].join(", "));
	let users = reply[1];
	let factions = {};
	for (let i = 0; i < users.length; i++) {
		client.hgetall(users[i], function (err, chara) {
			if (chara == null) { console.log("Error at "+users[i]); return 0; }
			if (chara.faction !== undefined && chara.faction != "None yet!" && chara.faction != "undefined") {
				if (factions[chara.faction] === undefined) { factions[chara.faction] = []; }
				factions[chara.faction].push(chara.name);
			}
			if (i == (users.length - 1)) {
				let message = "";
				for (let faction in factions) {
					message += faction + " (" + factions[faction].toString() + ")\n";
				}
				console.log(message);
			}
		});
	}
});
*/