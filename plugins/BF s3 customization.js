var fchat;
var channel;

var redis = require("redis");
var client = redis.createClient(6379, "192.168.0.25", {db: 3});

//JSON.parse
var notregistered = "You're not registered (or come from season one or two), use !register to join the club~";
var bodyParts = ["fingers","lips","tits","sex","ass","feet"];
var trainError = "Wrong spelling of body parts or attack/defense. Use one of the following: lips, fingers, tits, sex, ass, feet. Example: !train attack on fingers";
var maxStat = 5;
var minStat = 3;

module.exports = function (parent, chanName){
	fchat = parent;
	channel = chanName;
	
	var cmd = {};
	client.on("error", function (err) { console.log("Redis error " + err); });
	
	cmd.stagename = function (args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(notregistered, data); return 0; }
			let pj = JSON.parse(chara.data);
			///////////////////////////////////////////////////////////
			pj.stagename = args;
			send("Stage name changed!", data);
			///////////////////////////////////////////////////////////
			client.hmset(data.character, {data: JSON.stringify(pj)});
		});
	}
	
	cmd.train = function (args, data) {
		
		let a = checkTraining(args, data); if (a == false) { return 0; }
		
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(notregistered, data); return 0; }
			let pj = JSON.parse(chara.data);
			
			if (pj.stats[a.type][a.part] >= minStat) {
				if (pj.statpoints[a.type] > 0 && pj.stats[a.type][a.part] < maxStat) {
					pj.stats[a.type][a.part] += 1;
					pj.statpoints[a.type] -= 1;
					send("Training successful! You now have " + pj.stats[a.type][a.part] + " points in " + a.type + " on " + a.part + ", and "+pj.statpoints[a.type]+" "+a.type+" stat points left.", data);
					client.hmset(data.character, {data: JSON.stringify(pj)});
					return 0;
				} else { send("Not enough stat points or you have maxed out that part (Max without items: "+maxStat+").", data); return 0;}
			} else {
				if (pj.statpoints.extra > 0) {
					pj.stats[a.type][a.part] += 1;
					pj.statpoints.extra -= 1;
					send("Training successful! You now have " + pj.stats[a.type][a.part] + " points in " + a.type + " on " + a.part + ", and "+pj.statpoints.extra+" extra stat points left.", data);
					client.hmset(data.character, {data: JSON.stringify(pj)});
					return 0;
				} else { send("Not enough extra stat points or that part is not below the minimum (Min without items: "+minStat+").", data); return 0;}
			}
		});
	}
	
	cmd.indulge = function (args, data) {
		
		let a = checkTraining(args, data); if (a == false) { return 0; }
		
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(notregistered, data); return 0; }
			let pj = JSON.parse(chara.data);
			
			if (pj.stats[a.type][a.part] > minStat) {
				pj.stats[a.type][a.part] -= 1;
				pj.statpoints[a.type] += 1;
				send("Indulging successful! You now have " + pj.stats[a.type][a.part] + " points in " + a.type + " on " + a.part + ", and "+pj.statpoints[a.type]+" "+a.type+" stat points left.", data);
				client.hmset(data.character, {data: JSON.stringify(pj)});
				return 0;
			} else {
				if (pj.stats[a.type][a.part] == -10) { send("Lol, you can't get a stat lower than -10. Ask [icon]Kenia Nya[/icon] if she allows it XD", data); return 0; }
				pj.stats[a.type][a.part] -= 1;
				pj.statpoints.extra += 1;
				send("Indulging successful! You now have " + pj.stats[a.type][a.part] + " points in " + a.type + " on " + a.part + ", and "+pj.statpoints.extra+" extra stat points left.", data);
				client.hmset(data.character, {data: JSON.stringify(pj)});
				return 0;
			}
		});
	}
	
	//domsub, weights, colors, rename
	
	
	return cmd;
}

function checkTraining(args, data) {
	args = args.split(" on ");
	if (args[0] != "attack" && args[0] != "defense") { send(trainError, data); return false; }
	if (bodyParts.indexOf(args[1]) == -1) { send(trainError, data); return false; }
	return {type: args[0], part: args[1]};
}

function isBodyPart(part) {
	if (bodyParts.indexOf(part) == -1) { return false; }
	return true;
}


function send(message, data) {
	if (data.publico) {
		fchat.sendMessage(message, channel);
	}
	else {
		fchat.sendPrivMessage(data.character, message);
	}
}