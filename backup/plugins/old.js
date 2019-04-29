var fChatLibInstance;
var channel;
var message = "Hello, we moved to a new room!\n";
message += "Main room: [session=Lewd Sexual Wrestling - The sexfight club!]ADH-5b5393f9514b3c25ab71[/session]\n";
message += "Secondary room: [session=Lewd Sexual Wrestling - The sexfight club! 2]ADH-ab26b5c3fd556ff4384b[/session]\n";
message += "Commands in the old rooms are going to be disabled."

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	
    //fChatLibInstance.addMessageListener(function(parent, data) {
	//	fChatLibInstance.sendMessage(message, data.channel);
    //});
	
	fChatLibInstance.addJoinListener(function(parent, data){
		if (data.channel == "ADH-044c011d79866e3759d4" || data.channel == "ADH-287f677e8b191ebd332f") {
			fChatLibInstance.sendMessage(message, data.channel);
		}
    });
	
	return cmdHandler;
};