var fChatLibInstance;
var channel;
var g = "[color=green][b]"; var y = "[color=yellow][b]"; var r = "[color=red][b]"; var ec = "[/b][/color]";
var jsonfile = require('jsonfile');

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.toybox = function (args, data) {
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
		if (items.length == 0) { fChatLibInstance.sendMessage(r+"You have to add the toy level."+ec+" Options: accessories, light, medium or hard (or leave empty for all of them)", channel); return 0; }
		let item = items[Math.floor(Math.random()*items.length)];
		fChatLibInstance.sendMessage(g+data.character+ec+" opens the magic toxboy!", channel);
		fChatLibInstance.sendMessage("And they find this: "+y+item+ec+"!", channel);
	}
	return cmdHandler;
};