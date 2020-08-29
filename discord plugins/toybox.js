var g = "**"; var y = "**"; var r = "**"; var ec = "**";
var jsonfile = require('jsonfile');
var myRooms = [];

module.exports = function (bot, rooms) {
	myRooms = rooms;
    var cmdHandler = {};
    
	cmdHandler.toybox = function (args, user, channel) {
		if (!inMyRoom(channel)) { return 0; }
		let items = [];
		if (args == "" || args === undefined) {
			let items1 = jsonfile.readFileSync("./plugins/etc/light_items.json");
			let items2 = jsonfile.readFileSync("./plugins/etc/medium_items.json");
			let items3 = jsonfile.readFileSync("./plugins/etc/hard_items.json");
			let items4 = jsonfile.readFileSync("./plugins/etc/accs_items.json");
			items = items1.concat(items2,items3,items4);
		} else {
			args = args.toLowerCase();
		}
		if (args == "light") {  items = jsonfile.readFileSync("./plugins/etc/light_items.json"); }
		if (args == "medium") { items = jsonfile.readFileSync("./plugins/etc/medium_items.json"); }
		if (args == "hard") { items = jsonfile.readFileSync("./plugins/etc/hard_items.json"); }
		if (args == "accessories") { items = jsonfile.readFileSync("./plugins/etc/accs_items.json"); }
		if (items.length == 0) { bot.envia(r+"You have to add the toy level."+ec+" Options: accessories, light, medium or hard (or leave empty for all of them)", channel); return 0; }
		let item = items[Math.floor(Math.random()*items.length)];
		let picture = url(item);
		item = quitaBBcode(item);
		bot.envia(g+user+ec+" opens the magic toxboy! And they find this: **"+item +"**\n"+picture, channel);
		
	}
	
	return cmdHandler;
};

function inMyRoom(channel) {
	for (let i = 0; i < myRooms.length; i++) {
		if (channel == myRooms[i]) { return true; }
	}
	return false;
}

function quitaBBcode(texto) {
	let pasa = true; let nuevo = "";
	for (let i = 0; i < texto.length; i++) {
		if (texto[i] == "[") { pasa = false; continue; }
		if (texto[i] == "]") { pasa = true; continue; }
		if (pasa) { nuevo += texto[i]; }
	}
	return nuevo;
}

function url(texto) {
	return texto.split("=")[1].split("]")[0];
	
}
