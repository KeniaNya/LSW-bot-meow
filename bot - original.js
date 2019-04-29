var Discord = require('discord.io');
var auth = { token: "NDk1OTMzNzk2NzQzMzgwOTky.DpJSGg.3AEmMM7GDf6G_z-WkL6eR8OEym0" };

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected, logged in as: '+bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
				console.log("userID: "+userID);
				console.log("channelID: "+channelID);
				console.log("message: "+message);
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong! ' + args
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});