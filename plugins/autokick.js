var fChat;
var channel;
var BFroom = "adh-5b5393f9514b3c25ab71";

module.exports = function (parent, chanName) {
    fChat = parent;
	
    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.kick = function (args, data) {
		if (fChat.roomMods[BFroom].indexOf(data.character) == -1) { return 0; }
		fChat.sendWS('CKU', { channel: channel, character: args });
	}
	
	//cmdHandler.showMods = function (args, data) {
		//fChat.sendMessage(fChat.roomMods["frontpage"].toString(), channel);
	//}
	
	fChat.addJoinListener(function (parent, data) {
		if (data.channel != channel) { return 0; }
		if (data.character.identity == parent.config.character) { return 0; }
		if (fChat.roomMods[BFroom].indexOf(data.character.identity) != -1) { return 0; }
		fChat.sendWS('CKU', { channel: channel, character: data.character.identity });
		fChat.sendPrivMessage(data.character.identity, "Sorry, this room is for mods of LSW only... for more info, contact [user]Kenia Nya[/user]");
	});
	
	return cmdHandler;
};