var fs = require('fs');
var fChatLibInstance;
var channel;

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.meow = function (args, data) {
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } //checar si el usuario es DM
		let header = fs.readFileSync('./plugins/etc/room_title.txt', 'utf8');
		fChatLibInstance.sendDescription(header+args, channel);
	}
	
	return cmdHandler; // CDS {"description": "This is the channel for RP offers and announcements.", "channel": "Looking for RP"}
};