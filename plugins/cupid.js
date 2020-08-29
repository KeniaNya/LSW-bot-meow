var fChatLibInstance;
var users;
var channel;
var g = "[b][color=green]"; var y = "[b][color=yellow]"; var r = "[b][color=red]"; var ec = "[/color][/b]";

var client = redis.createClient(6379, "192.168.0.12", {db: 10});

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;
	users = fChatLibInstance.onlineUsers;
	
    var cmdHandler = {};
    channel = chanName;
	
	cmdHandler.register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			let message = r+"You're already registered."+ec;
			if (reply == 0) {
				let nuevo = {};
				nuevo.name = data.character;
				nuevo.gender = users[data.character].gender;
				nuevo.ad = "None yet!";
				client.hmset(data.character, nuevo);
				message = g+"Welcome "+data.character+"! You can now start looking for your ideal roleplay date!"+ec+"\nuse -ad to set your roleplay ad and -next to see other people! (you can add a gender to specify people of that gender only, like this: -next female shemale herm)";
			}
			fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}
	
	cmdHandler.ad = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) {
				fChatLibInstance.sendPrivMessage(data.character, r+"You're not registered yet! use -register to join~"+ec); return 0;
			}
			chara.ad = "\n[icon]"+data.character+"[/icon]\n"+args;
			client.hmset(data.character, chara);
			fChatLibInstance.sendPrivMessage(data.character, g+"Ad set! it'll look like this:"+ec);
			fChatLibInstance.sendPrivMessage(data.character, chara.ad);
		});
	}
	
	//guardar cada genero en una base de datos diferente!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
	cmdHandler.next = function (args, data) { //cambiar esto
		client.dbsize(function (err, dbsize) {
			if (dbsize < 2) { fChatLibInstance.sendPrivMessage(data.character, y+"Sorry, you're the only one at the moment, please tell more people to join~"+ec); return 0; }
			let flag = true;
			let n = 0;
			while (flag) {
				client.randomkey(function (err, item) {
					if (item.gender != args) { return 0; }
					flag = false;
					fChatLibInstance.sendPrivMessage(data.character, item.ad);
				}
				n++; if (n == 1000) { flag = false; fChatLibInstance.sendPrivMessage(data.character, r+"Couldn't find anyone with the specified gender."+ec);} // no encontrado
			}
		});
	}
	
	fChatLibInstance.addPrivateMessageListener(function(parent, data) {
		if (data && data.message && data.message.length > 2 && data.message[0] == '-') {
			let opts = {
				command: String(data.message.split(' ')[0]).replace('-', '').trim().toLowerCase(),
				argument: data.message.substring(String(data.message.split(' ')[0]).length).trim()
			};
			let newData = data;
			newData.publico = false;
			if (typeof cmdHandler[opts.command] === 'function') {
				cmdHandler[opts.command](opts.argument, newData);
			} else {
				//meow
			}
		}
	});
	
	
	return cmdHandler;
};