var fChatLibInstance;
var channel;
var redis = require("redis");
var client = redis.createClient(6379, "127.0.0.1", {db: 2});

//{{{{{ XP and stuff XD
var totalXP = [0,100,500,1200,2200,3500,5000,6700,8500,10500,12600,14900,17300,19800,22500,25300,28200,31200,34300,37500,40800,44200,47700,51300,55000,58800,62600,66500,70500,74600,78800,83000,87300,91700,96200,100700,105300,110000,114700,119500,124400,129300,134300,139400,144500,149700,155000,160300,165700,171100,176600,182200,187800,193500,199200,205000,210800,216700,222700,228700,234800,240900,247100,253300,259600,265900,272300,278700,285200,291700,298300,304900,311600,318300,325100,331900,338800,345700,352700,359700,366800,373900,381100,388300,395500,402800,410100,417500,424900,432400,439900,447500,455100,462700,470400,478100,485900,493700,501600,509500,517400,525400,533400,541500,549600,557700,565900,574100,582400,590700,599000,607400,615800,624300,632800,641300,649900,658500,667100,675800,684500,693300,702100,710900,719800,728700,737600,746600,755600,764700,773800,782900,792100,801300,810500,819800,829100,838400,847800,857200,866600,876100,885600,895200,904800,914400,924100,933800,943500,953300,963100,972900,982800,992700,1002600,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999,9999999];
var level = [1,4,7,10,13,15,17,18,20,21,23,24,25,27,28,29,30,31,32,33,34,35,36,37,38,38,39,40,41,42,42,43,44,45,45,46,47,47,48,49,49,50,51,51,52,53,53,54,54,55,56,56,57,57,58,58,59,60,60,61,61,62,62,63,63,64,64,65,65,66,66,67,67,68,68,69,69,70,70,71,71,72,72,72,73,73,74,74,75,75,76,76,76,77,77,78,78,79,79,79,80,80,81,81,81,82,82,83,83,83,84,84,85,85,85,86,86,86,87,87,88,88,88,89,89,89,90,90,91,91,91,92,92,92,93,93,93,94,94,94,95,95,96,96,96,97,97,97,98,98,98,99,99,99,100,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999];
var xpForNext = [8,25,12,131,544,596,832,159,761,148,1224,725,276,2152,1889,1700,1591,1568,1637,1804,2075,2456,2953,3572,4319,519,1400,2421,3588,4907,707,2184,3825,5636,1136,3123,5292,592,2949,5500,600,3351,6308,1208,4377,7764,2464,6075,675,4516,8593,2993,7312,1612,6179,379,5200,10281,4281,9628,3528,9147,2947,8844,2544,8725,2325,8796,2296,9063,2463,9532,2832,10209,3409,11100,4200,12211,5211,13548,6448,15117,7917,717,9724,2424,11775,4375,14076,6576,16633,9033,1433,11852,4152,14939,7139,18300,10400,2500,14041,6041,17968,9868,1768,14087,5887,18604,10304,2004,15125,6725,20256,11756,3256,17203,8603,3,14372,5672,20469,11669,2869,18100,9200,300,15971,6971,23088,13988,4888,21457,12257,3057,20084,10784,1484,18975,9575,175,18136,8636,27073,17473,7873,26792,17092,7392,26799,16999,7199,27100,17200,7300,27701,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//}}}}}


// Transformation magic, status effects like charmed or paralized, AoE, Loadouts
// potions/alchemy, classes, summons, npcs?
// locations!!!
// Mana surge and mana restriction/drain
// Spells with status/spell requirements!
// Life drain (requires set up?)

//{{{{{ ////////////////////////// CONSTANTS
var red = "[color=red][b]"; //fire
var yellow = "[color=yellow][b]"; //spirit/holy
var green = "[color=green][b]"; //earth
var cyan = "[color=cyan][b]"; //air
var blue = "[color=blue][b]"; //water and MP
var pink = "[color=pink][b]"; //LP

var c = "[/b][/color]";

var neutral = 0;
var weak = -1;
var strong = 1;
var elements = {
	spirit: {spirit: neutral,	air: weak,		water: strong, 	fire: weak,		earth: strong},
	air:	{spirit: strong, 	air: neutral, 	water: strong, 	fire: weak,		earth: weak},
	water:	{spirit: weak,		air: weak,		water: neutral,	fire: strong,	earth: strong},
	fire:	{spirit: strong,	air: strong,	water: weak,	fire: neutral,	earth: weak},
	earth:	{spirit: weak,		air: strong,	water: weak,	fire: strong,	earth: neutral},
};

var elementList = ["spirit","air","water","fire","earth"];
var hitTypeList = ["auto","strong","normal"];
var effectsList = ["con","int","agi","mana","defense"];
var diceList = ["2","4","6","8","10","12"];
var forced20 = false;
var forced1 = false;

var spellPrototype = {
	element: "none",
	element2: "none",
	target: "none", //self or enemy
	type: "none",
	hitType: "none", //auto, strong, normal
	numberOfAttacks: 0,
	attackBonus: "none", //none if doesn't apply, like an effect spell, otherwise 'int'
	dice: 0,
	effects: {con: 0, int: 0, agi: 0, mana: 0, defense: 0, stun: 0}, //effects can be stat modifier, stun
	effectDuration: 0,
	manaCost: 0,
	name: "Unnamed Spell",
	description: "Does magic stuff"
}

var itemPrototype = {
	element: "none",
	element2: "none",
	effects: {con: 0, int: 0, agi: 0}, //effects can be stat modifiers or other
	pointsCost: 0,
	name: "Unnamed Item",
	description: "Gives magic to the wearer",
	location: "inventory"
}

var inCrafting = {};

var defaultSpells = [
	{
		"element": "spirit",
		"element2": "spirit",
		"target": "enemy",
		"hitType": "normal",
		"numberOfAttacks": 2,
		"attackBonus": "none",
		"dice": 2,
		"effects": {
			"con": 0,
			"int": 0,
			"agi": 0,
			"mana": 0,
			"stun": 0
		},
		"effectDuration": 1,
		"manaCost": 6,
		"pointsCost": 6,
		"name": "Basic spell",
		"description": "Does magic stuff~",
		"type": "damage"
	},
	{
		"element": "spirit",
		"element2": "spirit",
		"target": "enemy",
		"hitType": "normal",
		"numberOfAttacks": 2,
		"attackBonus": "none",
		"dice": 4,
		"effects": {
			"con": 0,
			"int": 0,
			"agi": 0,
			"mana": 0,
			"stun": 0
		},
		"effectDuration": 1,
		"manaCost": 10,
		"pointsCost": 10,
		"name": "Medium spell",
		"description": "Does magic stuff~",
		"type": "damage"
	},
	{
		"element": "spirit",
		"element2": "spirit",
		"target": "enemy",
		"hitType": "normal",
		"numberOfAttacks": 2,
		"attackBonus": "none",
		"dice": 6,
		"effects": {
			"con": 0,
			"int": 0,
			"agi": 0,
			"mana": 0,
			"stun": 0
		},
		"effectDuration": 1,
		"manaCost": 14,
		"pointsCost": 14,
		"name": "Strong spell",
		"description": "Does magic stuff~",
		"type": "damage"
	}
]
//}}}}}

module.exports = function (fChatLibInstance, channel) {

	//////////////////////////////////////////////////
	//                 BALANCE STUFF                //
	//////////////////////////////////////////////////
	//{{{
	var initialMana = 10; var castMana = 10; var passMana = 20;

	function calculatePointsCost(spell) { ////////////////////////////////// CALCULATE POINTS/MANA COST
		let cost = 0;
		spell.dice = parseInt(spell.dice);
		spell.numberOfAttacks = parseInt(spell.numberOfAttacks);

		if (spell.type == "damage") {
			if (spell.hitType == "auto")   { cost += (spell.numberOfAttacks * ((spell.dice + 1) / 1)) * (4/3); }
			if (spell.hitType == "strong") { cost += (spell.numberOfAttacks * ((spell.dice + 1) / 1)) + 4; }
			if (spell.hitType == "normal") { cost += (spell.numberOfAttacks * ((spell.dice + 1) / 1)); }
			 //1d4 - 2.5, 1d6 - 3.5, 1d8 - 4.5, 1d10 - 5.5,  1d12 - 6.5
			 //2d4 - 5,   2d6 - 7,   2d8 - 9,   2d10 - 11,   2d12 - 13
		}
		if (spell.type == "heal") {
			cost += (spell.numberOfAttacks * ((spell.dice + 1) / 1)) + 2;
		}

		cost += (spell.effects.con + spell.effects.int + spell.effects.agi + spell.effects.stun) * 4 * (spell.effectDuration / 5);
		cost += spell.effects.defense * 10 * (spell.effectDuration / 5);
		cost = Math.round(cost);
		return cost;
	}
	function calculateManaCost(spell) { return calculatePointsCost(spell); }
	function calculateItemPointsCost(item) {
		let cost = 0;
		cost += (item.effects.con + item.effects.int + item.effects.agi) * 1;
		return cost;
	}

	function recalculatePointsAndMana(chara) { ///////////////////////////// FUNCION PARA ARREGLAR TODOS LOS BALANCES!!!!
		chara.spellbook = JSON.parse(chara.spellbook);
		chara.inventory = JSON.parse(chara.inventory);
		chara.items = JSON.parse(chara.items);
		chara.stats = JSON.parse(chara.stats);

		chara.points = 6; ////////////////////////////////////////////////////////////////////////////////////////////
		for (let i = 0; i < chara.spellbook.length; i++) {
			if (chara.spellbook[i].type == "heal") { chara.spellbook[i].hitType = "strong"; chara.spellbook[i].attackBonus = "int"; }
			if (chara.spellbook[i].type == "buff" || chara.spellbook[i].type == "debuff") {
				if (chara.spellbook[i].effects.defense == null) { chara.spellbook[i].effects.defense = 0; }
			}
			if (chara.spellbook[i].hitType == "ranged") { chara.spellbook[i].hitType = "strong"; }
			if (chara.spellbook[i].hitType == "melee") { chara.spellbook[i].hitType = "normal"; }
			if (chara.spellbook[i].effectDuration < 5) { chara.spellbook[i].effectDuration = 5; }
			if (chara.spellbook[i].effects.defense == undefined) { chara.spellbook[i].effects.defense = 0; }
			chara.spellbook[i].manaCost = calculateManaCost(chara.spellbook[i]);
		}
		chara.spells = "[]";
		for (let i = 0; i < chara.inventory.length; i++) {
			chara.inventory[i].pointsCost = calculateItemPointsCost(chara.inventory[i]);
		}

		chara.stats.int = 10;	chara.stats.agi = 10;	chara.stats.con = 10; chara.stats.defense = 0;

		for (let i = 0; i < chara.items.length; i++) {
			chara.items[i].pointsCost = calculateItemPointsCost(chara.items[i]);
			chara.points -= chara.items[i].pointsCost;

			chara.stats.int += parseInt(chara.items[i].effects.int);
			chara.stats.agi += parseInt(chara.items[i].effects.agi);
			chara.stats.con += parseInt(chara.items[i].effects.con);
		}

		chara.spellbook = JSON.stringify(chara.spellbook);
		chara.inventory = JSON.stringify(chara.inventory);
		chara.items = JSON.stringify(chara.items);
		chara.stats = JSON.stringify(chara.stats);
		return chara;
	}

	function generate_otherStats(stats) { ////////////////////////////////// OTHER STATS //////////////////////////////////
		let reply = {};
		reply.lustPoints	= (10 + Math.floor( ( parseInt(stats.con) - 10 ) / 2 )) * 5;
		reply.spellDC		=  10 + Math.floor( ( parseInt(stats.int) - 10 ) / 2 );
		reply.reflexSave 	=       Math.floor( ( parseInt(stats.agi) - 10 ) / 2 );
		reply.attackBonus	=       Math.floor( ( parseInt(stats.int) - 10 ) / 2 );
		reply.AC			=  10 + Math.floor( ( parseInt(stats.agi) - 10 ) / 2 );
		return reply;
	}

	function prepareForBattle(chara, fix) { //////////////////////////////// PREPARE FOR BATTLE //////////////////////////////////
		chara = recalculatePointsAndMana(chara);
		chara.stats = JSON.parse(chara.stats);


		/////////////////////// Fix spell types XD
		if (fix) {
			chara.spellbook = JSON.parse(chara.spellbook);

			for (let i = 0; i < chara.spellbook.length; i++) {
				if (chara.spellbook[i].target == "self") {
					if (chara.spellbook[i].dice != "0") {
						chara.spellbook[i].type = "heal";
					} else {
						chara.spellbook[i].type = "buff";
					}
				} else {
					if (chara.spellbook[i].dice != "0") {
						chara.spellbook[i].type = "damage";
					} else {
						chara.spellbook[i].type = "debuff";
					}
				}
			}
			chara.spellbook = JSON.stringify(chara.spellbook);
			chara.stats = JSON.stringify(chara.stats);
			client.hmset(chara.name, chara);
			chara.stats = JSON.parse(chara.stats);
		}
		/////////////////////// Hahahaha derp

		let otherStats = generate_otherStats(chara.stats);
		chara.max_lp = otherStats.lustPoints;	chara.lp = otherStats.lustPoints;	chara.spellDC = otherStats.spellDC;
		chara.reflexSave = otherStats.reflexSave;	chara.attackBonus = otherStats.attackBonus;	chara.AC = otherStats.AC;

		chara.mana = initialMana; chara.missCount = 0; chara.activeDebuffs = []; chara.activeBuffs = [];
		chara.inventory = "Not needed yet"; chara.items = JSON.parse(chara.items); chara.spellbook = JSON.parse(chara.spellbook);
		return chara;
	}

	//}}}
	//////////////////////////////////////////////////
	//               UTILITY COMMANDS               //
	//       send, debug, force, private room       //
	//////////////////////////////////////////////////
	//{{{
	var cmdHandler = {};
	function send(data,message) { data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message); }
	cmdHandler.debugCrafting = function(args, data) { send(data, JSON.stringify(inCrafting)); }
	cmdHandler.force20 = function(args, data) { if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } forced20 = true; send(data, "ding"); }
	cmdHandler.force1 = function(args, data) { if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; } forced1 = true; send(data, "dong"); }
	cmdHandler.createprivateroommeow = function(args, data) { fChatLibInstance.sendCommand('CCR', { channel: "Private magical arena for "+data.character+" and "+args }); }
	cmdHandler.logprivaterooms = function(args, data) { fChatLibInstance.logPrivateRooms(); }
	//}}}
	//////////////////////////////////////////////////
	//                SPELL CREATION                //
	//////////////////////////////////////////////////
	//{{{

	function spellTypeDiceAndEffects(data, target, numberOfAttacks, dice, effects, effectDuration, hitType, type) { ///////////////////// spellTypeDiceAndEffects
		if (inCrafting[data.character] == null || inCrafting[data.character].craftingSpell == false) { send(data, red+"You're not crafting a spell."+c); return 0; }
		let tutorial = false;
		if (inCrafting[data.character].spell.type == "none") { tutorial = true; }
		inCrafting[data.character].spell.target = target;

		if (type == "damage" && inCrafting[data.character].spell.hitType == "none") {
			inCrafting[data.character].spell.hitType = hitType;
		}

		if (inCrafting[data.character].spell.hitType == "strong") { inCrafting[data.character].spell.attackBonus = "int"; } else { inCrafting[data.character].spell.attackBonus = "none"; }
		inCrafting[data.character].spell.numberOfAttacks = parseInt(numberOfAttacks);
		inCrafting[data.character].spell.dice = parseInt(dice);

		inCrafting[data.character].spell.effects.con = parseInt(effects.con);
		inCrafting[data.character].spell.effects.int = parseInt(effects.int);
		inCrafting[data.character].spell.effects.agi = parseInt(effects.agi);
		inCrafting[data.character].spell.effects.defense = parseInt(effects.defense);

		inCrafting[data.character].spell.effectDuration = parseInt(effectDuration);
		inCrafting[data.character].spell.type = type;
		inCrafting[data.character].spell.manaCost = calculateManaCost(inCrafting[data.character].spell);

		if (tutorial) {
			if (type == "damage") {
				send(data,
prettySpellCrafting(inCrafting[data.character].spell)+
cyan+"Do you want your spell to auto-hit "+c+"(like magic missle, mana cost x1.5)"+cyan+"? Be a strong attack "+c+"(you get your intelligence modifier as damage bonus, mana cost +4)"+cyan+"? Or a be a normal attack?"+c+"\n"+
"Options: "+green+"Auto"+c+", "+yellow+"Strong"+c+", "+red+"Normal"+c+"\n"+
yellow+"Examples: !hit auto, !hit strong, !hit normal"+c
				);
			} else {
				send(data,
prettySpellCrafting(inCrafting[data.character].spell)+
cyan+"Now we're on the last part, it's time to give your spell some flavor! Give it a name and a description~ (you can use bbcode and eicons for extra juice~)"+c+"\n"+
yellow+"Example: !name Magic missle, A small light orb that hits no matter what!"+c
				);
			}
		} else {
			send(data, prettySpellCrafting(inCrafting[data.character].spell));
		}
	}

	cmdHandler.createspell = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			inCrafting[data.character] = {spell: JSON.parse(JSON.stringify(spellPrototype)), craftingSpell: true, craftingItem: false};
			send(data,
`${prettySpellCrafting(spellPrototype)}${cyan}"Welcome to the spell workshop! First, choose your spell's element (or elements if you want a dual element spell, make sure to check the spell interaction diagram on [url=https://www.f-list.net/c/Bot%20Announcer%20Beta]my profile![/url])${c}
"Options: ${yellow}Spirit${c}, ${cyan}Air${c}, ${blue}Water${c}, ${red}Fire${c}, ${green}Earth${c}
${yellow}Examples: !element water, !elements fire and air ${c}(Note: You can change any of the choices you make during the spell creation so don't stress too much~ I'll tell you how once we finish~)`
			);
		});
	}

	cmdHandler.editspell = function (args, data) { editOrCopySpell(args, data, "edit"); }
	cmdHandler.copyspell = function (args, data) { editOrCopySpell(args, data, "copy"); }
	function editOrCopySpell(args, data, type) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			let selectedSpell = "";
			chara.spellbook = JSON.parse(chara.spellbook);

			for (let i = 0; i < chara.spellbook.length; i++) {
				if (removeBbcode(chara.spellbook[i].name) == removeBbcode(args)) {
					selectedSpell = chara.spellbook[i];
				}
			}

			if (selectedSpell == "") { send(data, red+"The spell "+args+" wasn't found on your spellbook!"); return 0; }

			if (type == "edit") { selectedSpell.oldName = selectedSpell.name; }
			inCrafting[data.character] = {spell: JSON.parse(JSON.stringify(selectedSpell)), craftingSpell: true, craftingItem: false};
			send(data, prettySpellCrafting(selectedSpell));
		});
	}

	cmdHandler.elements = function(args, data) { cmdHandler.element(args, data) }
	cmdHandler.element = function(args, data) {
		if (inCrafting[data.character] == null || (inCrafting[data.character].craftingSpell == false && inCrafting[data.character].craftingItem == false)) { send(data, red+"You're not in crafting."+c); return 0; }
		args = args.toLowerCase();
		let argsList = args.split(" and ");
		if (argsList.length > 2) { send(data, red+"Invalid number of elements."+c); return 0; }
		if (argsList.length == 1 && inCrafting[data.character].craftingItem == true) { send(data, red+"Invalid number of elements!"+c+" Items need to have two elements."); return 0; }
		if (argsList.length == 1) {
			if (elementList.indexOf(argsList[0]) == -1) { send(data, red+"Element not valid."+c); return 0; }
			argsList[1] = argsList[0]; //put the same value in element and element2
		}
		if (argsList.length == 2) {
			if (elementList.indexOf(argsList[0]) == -1) { send(data, red+"First element not valid."+c); return 0; }
			if (elementList.indexOf(argsList[1]) == -1) { send(data, red+"Second element not valid."+c); return 0; }
		}
		let tutorial = false;
		if (inCrafting[data.character].craftingSpell) {
			if (inCrafting[data.character].spell.element == "none") { tutorial = true; }
			inCrafting[data.character].spell.element = argsList[0];
			inCrafting[data.character].spell.element2 = argsList[1];
			inCrafting[data.character].spell.manaCost = calculateManaCost(inCrafting[data.character].spell);
			if (tutorial) {
				send(data,
	prettySpellCrafting(inCrafting[data.character].spell)+
	cyan+"Now to the fun part, will this spell be a damage/heal spell? Or a buff/debuff one?\n"+
	"If you want a damage/heal spell, choose your dice roll and how many "+c+"(1d2 costs 3 mana, 1d4 costs 5 mana, 1d6 costs 7 mana, 1d8 costs 9 mana and so on. Note: Numbers get rounded at the end, also healing spells have a base cost of 2 mana)\n"+
	yellow+"Example: !damage 2d6 (mana cost 14), !heal 3d8 (mana cost 30)"+c+"\n"+
	cyan+"But if you want a buff/debuff, choose what stat do you want to modify! "+c+"(you can modify more than 1, each modification costs 4 mana)"+cyan+" and how many turns should the buff/debuff last "+c+"(default duration is 5 turns and 5 more turns duplicate the mana cost. If you cast another buff/debuff on the same target, the first buff/debuff goes away)\n"+
	yellow+"Example: !debuff 3 to int (Mana cost 12), !buff 1 to agi and 1 to int (Mana cost 8), !buff 2 to agi for 10 turns (Mana cost 16)\n"+c+cyan+"You can also buff/debuff your or your opponent's defense, decreasing/increasing the LP taken by any spell"+c+" (Each point costs 10 mana)\n"+yellow+"Example: !debuff 2 to defense (Mana cost 20)"
				);
			} else {
				send(data, prettySpellCrafting(inCrafting[data.character].spell));
			}
		} else {
			if (inCrafting[data.character].item.element == "none") { tutorial = true; }
			inCrafting[data.character].item.element = argsList[0];
			inCrafting[data.character].item.element2 = argsList[1];
			if (tutorial) {
				send(data,
	prettyItemCrafting(inCrafting[data.character].item)+
	cyan+"Now to the important part, what effects should this item have? You can choose to make it improve your Constitution, Intellingence or Agility, (each stat increase costs 1 point, and you have 6 in total)"+c+"\n"+
	yellow+"Example: !effects 3 to int and 3 to agi (point cost 6), !effects 2 to con and 2 to agi and 2 to int (point cost 6)"+c
				);
			} else {
				send(data, prettyItemCrafting(inCrafting[data.character].item));
			}
		}
	}

	cmdHandler.damage = function(args, data) {
		args = args.toLowerCase();
		let argsList = args.split("d"); // 2d6 -> 2,6
		if (argsList.length != 2) { send(data, red+"Invalid dice roll."+c); return 0; }
		if (isNaN(argsList[0]) || isNaN(argsList[1])) { send(data, red+"Invalid dice roll."+c+" Example: !damage 1d6"); return 0; }
		if (diceList.indexOf(argsList[1]) == -1) { send(data, red+"Invalid dice size."+c+" Valid sizes: d2, d4, d6, d8, d10, d12"); return 0; }
		spellTypeDiceAndEffects(data, "enemy", argsList[0], argsList[1], {con: 0, int: 0, agi: 0, defense: 0, mana: 0}, 0, "normal", "damage");
	}

	cmdHandler.heal = function(args, data) {
		args = args.toLowerCase();
		let argsList = args.split("d"); // 2d6 -> 2,6
		if (argsList.length != 2) { send(data, red+"Invalid dice roll."+c); return 0; }
		if (isNaN(argsList[0]) || isNaN(argsList[1])) { send(data, red+"Invalid dice roll."+c+" Example: !heal 2d8"); return 0; }
		if (diceList.indexOf(argsList[1]) == -1) { send(data, red+"Invalid dice size."+c+" Valid sizes: d2, d4, d6, d8, d10, d12"); return 0; }
		spellTypeDiceAndEffects(data, "self", argsList[0], argsList[1], {con: 0, int: 0, agi: 0, defense: 0,mana: 0}, 0, "strong", "heal");
	}

	cmdHandler.debuff = function(args, data) {
		args = args.toLowerCase();
		let argsList = args.split(" for "); // 1 to int and 1 to con, 3 turns
		if (argsList.length > 2) { send(data, red+"Invalid list of elements..."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
		let statsList = argsList[0].split(" and "); //1 to int, 1 to con
		let effects = {con: 0, int: 0, agi: 0, defense: 0, mana: 0};
		for (let i = 0; i < statsList.length; i++) {
			let statPair = statsList[i].split(" to ");
			if (statPair.length != 2) { send(data, red+"Invalid list of elements..."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
			if (isNaN(statPair[0]) || statPair[0] < 1 || effectsList.indexOf(statPair[1]) == -1) { send(data, red+"Invalid list of elements..."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
			////////////////////////////////////////////////
			if (statPair[1] == "con") { send(data, red+"Sorry but you can't debuff constitution anymore..."+c); return 0; }
			////////////////////////////////////////////////
			effects[statPair[1]] = statPair[0];
		}
		let effectDuration = 5;
		if (argsList.length == 2) {
			let duration = argsList[1].split(" ")[0];
			if (isNaN(duration) || duration < 5) { send(data, red+"Invalid turn length."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
			effectDuration = duration;
		}
		spellTypeDiceAndEffects(data, "enemy", 0, 0, effects, effectDuration, "normal", "debuff");
	}

	cmdHandler.buff = function(args, data) {
		args = args.toLowerCase();
		let argsList = args.split(" for "); // 1 to int and 1 to con, 3 turns
		if (argsList.length > 2) { send(data, red+"Invalid list of elements..."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
		let statsList = argsList[0].split(" and "); //1 to int, 1 to con
		let effects = {con: 0, int: 0, agi: 0, defense: 0, mana: 0};
		for (let i = 0; i < statsList.length; i++) {
			let statPair = statsList[i].split(" to ");
			if (statPair.length != 2) { send(data, red+"Invalid list of elements..."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
			if (isNaN(statPair[0]) || statPair[0] < 1 || effectsList.indexOf(statPair[1]) == -1) { send(data, red+"Invalid list of elements..."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
			effects[statPair[1]] = statPair[0];
		}
		console.log(JSON.stringify(effects));
		let effectDuration = 5;
		if (argsList.length == 2) {
			let duration = argsList[1].split(" ")[0];
			if (isNaN(duration) || duration < 5) { send(data, red+"Invalid turn length."+c+" Example: !debuff 1 to int and 1 to con for 10 turns"); return 0; }
			effectDuration = duration;
		}
		spellTypeDiceAndEffects(data, "self", 0, 0, effects, effectDuration, "normal", "buff");
	}

	cmdHandler.hit = function(args, data) {
		if (inCrafting[data.character] == null || inCrafting[data.character].craftingSpell == false) { send(data, red+"You're not crafting a spell."+c); return 0; }
		if (inCrafting[data.character].spell.target == "self") { send(data, red+"You can't change the hit type of a self spell! Meow!"+c); return 0; }
		if (inCrafting[data.character].spell.type != "damage") { send(data, red+"You can't change the hit type of a heal, buff or debuff spell! Meow!"+c); return 0; }
		args = args.toLowerCase();
		if (hitTypeList.indexOf(args) == -1) { send(data, red+"Hit type not valid."+c+" Examples: !hit auto, !hit strong, !hit normal"); return 0; }
		let tutorial = false;
		if (inCrafting[data.character].spell.name == "Unnamed Spell") { tutorial = true; }
		inCrafting[data.character].spell.hitType = args;

		if (inCrafting[data.character].spell.hitType == "strong") { inCrafting[data.character].spell.attackBonus = "int"; } else { inCrafting[data.character].spell.attackBonus = "none"; }

		inCrafting[data.character].spell.manaCost = calculateManaCost(inCrafting[data.character].spell);
		if (tutorial) {
			send(data,
prettySpellCrafting(inCrafting[data.character].spell)+
cyan+"Now we're on the last part, it's time to give your spell some flavor! Give it a name and a description~ (you can use bbcode and eicons for extra juice~)"+c+"\n"+
yellow+"Example: !name Magic missle, A small light orb that hits no matter what!"+c
			);
		} else {
			send(data, prettySpellCrafting(inCrafting[data.character].spell));
		}
	}

	cmdHandler.name = function(args, data) {
		if (inCrafting[data.character] == null || (inCrafting[data.character].craftingSpell == false && inCrafting[data.character].craftingItem == false)) { send(data, red+"You're not in crafting."+c); return 0; }
		let tutorial = false;
		if (inCrafting[data.character].craftingSpell) {
			if (inCrafting[data.character].spell.name == "Unnamed Spell") { tutorial = true; }
			let i = args.indexOf(", ");
			if (i == -1) { send(data, red+"Make sure to put a comma ( , ) between the spell name and it's description"+c+" Example: !name Magic missle, A small light orb that hits no matter what!"); return 0; }
			inCrafting[data.character].spell.name = args.slice(0,i);
			inCrafting[data.character].spell.description = args.slice(i+2);
			if (tutorial) {
				send(data,
	prettySpellCrafting(inCrafting[data.character].spell)+
	cyan+"Yay! We're done! That was fun, wasn't it? Now, you can change any step of your spell using any of the previous commands "+c+"(!element, !elements, !damage, !heal, !buff, !debuff, !hit, !name)"+cyan+", and when you're happy about your choices, you can say !finishspell to, well, finish the spell creation!"+c
				);
			} else {
				send(data, prettySpellCrafting(inCrafting[data.character].spell));
			}
		} else {
			if (inCrafting[data.character].item.name == "Unnamed Item") { tutorial = true; }
			let i = args.indexOf(", ");
			if (i == -1) { send(data, red+"Make sure to put a comma ( , ) between the item name and it's description"+c+" Example: !name White robe, A robe that makes it's wearer smarter!"); return 0; }
			inCrafting[data.character].item.name = args.slice(0,i);
			inCrafting[data.character].item.description = args.slice(i+2);
			if (tutorial) {
				send(data,
	prettyItemCrafting(inCrafting[data.character].item)+
	cyan+"Yay! We're done! That was fun, wasn't it? Now, you can change any step of your item using any of the previous commands "+c+"(!elements, !effects, !name)"+cyan+", and when you're happy about your choices, you can say !finishitem to, well, finish the item creation!"+c
				);
			} else {
				send(data, prettyItemCrafting(inCrafting[data.character].item));
			}
		}
	}

	cmdHandler.finishspell = function(args, data) {
		if (inCrafting[data.character] == null || inCrafting[data.character].craftingSpell == false) { send(data, red+"You're not crafting a spell."+c); return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"What the heck?! How?! This is impossible, meow meow! If you see this, take a screenshot and send it to me, please~ [icon]Kenia Nya[/icon]"); return 0; }
			inCrafting[data.character].spell.pointsCost = calculatePointsCost(inCrafting[data.character].spell);
			if (inCrafting[data.character].spell.element == "" || inCrafting[data.character].spell.type == "none") { send(data, red+"You haven't finished making your spell!"+c+" Make sure you select an element and damage/heal or buff/debuff type!"); return 0; }
			let newSpell = JSON.parse( JSON.stringify(inCrafting[data.character].spell) );
			chara.spellbook = JSON.parse(chara.spellbook);


			for (let i = 0; i < chara.spellbook.length; i++) {
				if (newSpell.oldName == chara.spellbook[i].name) {
					chara.spellbook.splice(i, 1);
					i--;
				}
			}

			chara.spellbook.push(newSpell);

			chara.spellbook = JSON.stringify(chara.spellbook);
			inCrafting[data.character].craftingSpell = false;
			send(data, green+"Spell saved! You can check your !spellbook to view it"+c);
			client.hmset(data.character, chara);
		});
	}

	cmdHandler.deletespell = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }

			chara.spellbook = JSON.parse(chara.spellbook);

			for (let i = 0; i < chara.spellbook.length; i++) {
				if (removeBbcode(chara.spellbook[i].name) == removeBbcode(args)) {
					chara.spellbook.splice(i, 1);

					send(data, yellow+"The spell "+args+" has been deleted!"+c);

					chara.spellbook = JSON.stringify(chara.spellbook);
					client.hmset(data.character, chara);
					return 0;
				}
			}
			send(data, red+"The spell "+args+" wasn't found!");
		});
	}

	//}}}
	//////////////////////////////////////////////////
	//                SPELL DISPLAY                 //
	//////////////////////////////////////////////////
	//{{{

	function prettySpellCrafting(spell) {
		return prettySpell(spell, false)+"\n"+green+"Mana cost: "+calculatePointsCost(spell)+c+" (Note: you start with "+initialMana+" mana on your first turn, you get "+castMana+" mana if you cast a spell and "+passMana+" if you pass your turn. You get extra mana depending on the round count)\n\n";
	}

	function prettySpell(spell, oneLine) {
		let icons = {spirit: "⭐", air: "🌪️", water: "🌊", fire: "🔥", earth: "🌳", none: "❌"};
		let colors = {spirit: yellow, air: cyan, water: blue, fire: red, earth: green, none: "[color=white][b]"};
		let targetColors = {self: green, enemy: red, none: "[color=white][b]"};
		let hitTypeColors = {auto: green, strong: yellow, normal: red, none: "[color=white][b]"};
		let bonus = {none: "", int: "+Int"};
		let effects = "";
		if (spell.type == "buff") {
			if (spell.effects.con != 0) { effects += "+"+spell.effects.con+" to Constitution. "; }
			if (spell.effects.int != 0) { effects += "+"+spell.effects.int+" to Intelligence. "; }
			if (spell.effects.agi != 0) { effects += "+"+spell.effects.agi+" to Agility. "; }
			if (spell.effects.defense != 0) { effects += "+"+spell.effects.defense+" to Defense. "; }
		} else {
			if (spell.effects.con != 0) { effects += "-"+spell.effects.con+" to Constitution."+red+"CONSTITUTION DEBUFFS ARE DISABLED TEMPORALLY. IF YOU CAST IT, IT WONT DO ANYTHING."+c+" "; }
			if (spell.effects.int != 0) { effects += "-"+spell.effects.int+" to Intelligence. "; }
			if (spell.effects.agi != 0) { effects += "-"+spell.effects.agi+" to Agility. "; }
			if (spell.effects.defense != 0) { effects += "-"+spell.effects.defense+" to Defense. "; }
		}
		if (spell.effects.stun != 0) { effects += "Stuns the target. "; }
		if (effects == "") { effects = "No extra effect. "; }

		let damageOrHeal = "";
		let diceOrNoDice = "";
		if (spell.dice != 0) {
			if (spell.target == "enemy") { damageOrHeal = "Damage"; }
			if (spell.target == "self") { damageOrHeal = "Heal"; }
			diceOrNoDice = spell.numberOfAttacks+"d"+spell.dice+bonus[spell.attackBonus];
		} else {
			if (spell.target == "enemy") { diceOrNoDice = "Spell save DC 10+Int"; damageOrHeal = "Debuff"; }
			if (spell.target == "self") { diceOrNoDice = "No dice roll"; damageOrHeal = "Buff"; }
		}

		let message1 =
"\n"+icons[spell.element]+icons[spell.element2]+colors[spell.element]+spell.name+" ("+spell.manaCost+" Mana)"+c+icons[spell.element2]+icons[spell.element]+"\n"+
"[i]"+spell.description+"[/i]";
		let message2 =
"\n ═ Elements: "+colors[spell.element]+spell.element+c+"/"+colors[spell.element2]+spell.element2+c+
" ═ Target: "+targetColors[spell.target]+spell.target+c+
" ═ "+damageOrHeal+": "+diceOrNoDice+" ("+hitTypeColors[spell.hitType]+spell.hitType+c+")"
		if (effects != "No extra effect. ") { message2 +=
"\n ═ Effects: "+effects+"("+spell.effectDuration+" turns) ═";
		}
		if (oneLine) { return message1; }
		return message1+message2;
	}

	cmdHandler.spells = function(args, data) { cmdHandler.spellbook(args, data) }
	cmdHandler.spellbook = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			let hoja = "\n";
			hoja +="═══════════════════════════════════\n";
			hoja +="    ⭐ ⭐ [color="+chara.color1+"][b]"+chara.name+"'s Spellbook[/b][/color] ⭐ ⭐\n";
			hoja +="═══════════════════════════════════";
			hoja +=generar_spells(chara.spellbook, false);
			hoja +="\n(Note: you start with "+initialMana+" mana on your first turn, you get "+castMana+" mana if you cast a spell and "+passMana+" if you pass your turn. You get extra mana depending on the round count)";
			send(data, hoja);
			client.hmset(data.character, chara);
		});
	}

	cmdHandler.showspell = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			chara.spellbook = JSON.parse(chara.spellbook);
			let selectedSpell = [];
			for (let i = 0; i < chara.spellbook.length; i++) {
				if (removeBbcode(args) == removeBbcode(chara.spellbook[i].name)) {
					selectedSpell.push(chara.spellbook[i]);
				}
			}
			selectedSpell = JSON.stringify(selectedSpell);
			send(data, generar_spells(selectedSpell, false));
			chara.spellbook = JSON.stringify(chara.spellbook);
			client.hmset(data.character, chara);
		});
	}

	//}}}
	//////////////////////////////////////////////////
	//           ITEM CREATION AND DISPLAY          //
	//////////////////////////////////////////////////
	//{{{
	cmdHandler.createitem = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			//if (chara.points == 0) { send(data, red+"You don't have any more points to spend."+c); return 0; }

			inCrafting[data.character] = {item: JSON.parse(JSON.stringify(itemPrototype)), craftingItem: true, craftingSpell: false}; ////////////////////////////////////
			send(data,
prettyItemCrafting(itemPrototype)+
cyan+"Welcome to the item (clothes) workshop! First, choose your items's elements (you have to choose two)"+c+"\n"+
"Options: "+yellow+"Spirit"+c+", "+cyan+"Air"+c+", "+blue+"Water"+c+", "+red+"Fire"+c+", "+green+"Earth"+c+"\n"+
yellow+"Examples: !elements fire and air "+c+"(Note: You can change any of the choices you make during the item creation so don't stress too much~ I'll tell you how once we finish~)"
			);
		});
	}

	cmdHandler.edititem = function (args, data) { editOrCopyItem(args, data, "edit"); }
	cmdHandler.copyitem = function (args, data) { editOrCopyItem(args, data, "copy"); }
	function editOrCopyItem(args, data, type) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			let selectedItem = "";
			chara.inventory = JSON.parse(chara.inventory);
			chara.items = JSON.parse(chara.items);

			for (let i = 0; i < chara.inventory.length; i++) {
				if (removeBbcode(chara.inventory[i].name) == removeBbcode(args)) {
					selectedItem = chara.inventory[i];
					selectedItem.location = "inventory";
				}
			}

			for (let i = 0; i < chara.items.length; i++) {
				if (removeBbcode(chara.items[i].name) == removeBbcode(args)) {
					selectedItem = chara.items[i];
					selectedItem.location = "items";
				}
			}

			if (selectedItem == "") { send(data, red+"The item "+args+" wasn't found on your inventory or equipped items!"); return 0; }
			if (type == "edit") {selectedItem.oldName = selectedItem.name; }
			inCrafting[data.character] = {item: JSON.parse(JSON.stringify(selectedItem)), craftingSpell: false, craftingItem: true}; ////////////////////////////////////
			send(data, prettyItemCrafting(selectedItem));
		});
	}

	cmdHandler.effects = function(args, data) {
		if (inCrafting[data.character] == null || inCrafting[data.character].craftingItem == false) { send(data, red+"You're not crafting an item."+c); return 0; }
		args = args.toLowerCase();
		let statsList = args.split(" and "); //1 to int, 1 to con
		let effects = {con: 0, int: 0, agi: 0, mana: 0};
		for (let i = 0; i < statsList.length; i++) {
			let statPair = statsList[i].split(" to ");
			if (statPair.length != 2) { send(data, red+"Invalid list of elements..."+c+" Example: !effects 1 to int and 1 to con"); return 0; }
			if (isNaN(statPair[0]) || statPair[0] < 1 || effectsList.indexOf(statPair[1]) == -1) { send(data, red+"Invalid list of elements..."+c+" Example: !effects 1 to int and 1 to con"); return 0; }
			effects[statPair[1]] = statPair[0];
		}
		let tutorial = false;
		if (inCrafting[data.character].item.effects.con == 0 &&
			inCrafting[data.character].item.effects.int == 0 &&
			inCrafting[data.character].item.effects.agi == 0) { tutorial = true; }
		inCrafting[data.character].item.effects.con = parseInt(effects.con);
		inCrafting[data.character].item.effects.int = parseInt(effects.int);
		inCrafting[data.character].item.effects.agi = parseInt(effects.agi);

		if (tutorial) {
			send(data,
prettyItemCrafting(inCrafting[data.character].item)+
cyan+"Now we're on the last part, it's time to give your item some flavor! Give it a name and a description~ (you can use bbcode and eicons for extra juice~)"+c+"\n"+
yellow+"Example: !name White robe, A robe that makes it's wearer smarter!"+c
			);
		} else {
			send(data, prettyItemCrafting(inCrafting[data.character].item));
		}
	}

	cmdHandler.finishitem = function(args, data) {
		if (inCrafting[data.character] == null || inCrafting[data.character].craftingItem == false) { send(data, red+"You're not crafting an item."+c); return 0; }
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"What the heck?! How?! This is impossible, meow meow! If you see this, take a screenshot and send it to me, please~ [icon]Kenia Nya[/icon]"); return 0; }
			inCrafting[data.character].item.pointsCost = calculateItemPointsCost(inCrafting[data.character].item);
			if (inCrafting[data.character].item.element == "") { send(data, red+"You haven't finished making your item! Make sure you pick your elements!"); return 0; }
			let newItem = JSON.parse( JSON.stringify(inCrafting[data.character].item) );
			chara.inventory = JSON.parse(chara.inventory);
			chara.items = JSON.parse(chara.items);

			for (let i = 0; i < chara.inventory.length; i++) {
				if (newItem.oldName == chara.inventory[i].name) {
					chara.inventory.splice(i, 1);
					i--;
				}
			}
			for (let i = 0; i < chara.items.length; i++) {
				if (newItem.oldName == chara.items[i].name) {
					chara.items.splice(i, 1);
					i--;
				}
			}

			chara[newItem.location].push(newItem);
			chara.inventory = JSON.stringify(chara.inventory);
			chara.items = JSON.stringify(chara.items);
			inCrafting[data.character].craftingItem = false;
			send(data, green+"Item saved! You can use !card (if you had it equipped) or !inventory to view it."+c);
			client.hmset(data.character, chara);
		});
	}

	cmdHandler.deleteitem = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }

			chara.inventory = JSON.parse(chara.inventory);
			chara.items = JSON.parse(chara.items);
			chara.stats = JSON.parse(chara.stats);

			let found = false;
			for (let j = 0; j < chara.items.length; j++) {
				if (removeBbcode(chara.items[j].name) == removeBbcode(args)) {
					chara.points = parseInt(chara.points) + parseInt(chara.items[j].pointsCost);
					chara.stats.con = parseInt(chara.stats.con) - parseInt(chara.items[j].effects.con);
					chara.stats.agi = parseInt(chara.stats.agi) - parseInt(chara.items[j].effects.agi);
					chara.stats.int = parseInt(chara.stats.int) - parseInt(chara.items[j].effects.int);
					chara.items.splice(j, 1);
					j--;
					found = true;
				}
			}

			for (let i = 0; i < chara.inventory.length; i++) {
				if (removeBbcode(chara.inventory[i].name) == removeBbcode(args)) {
					chara.inventory.splice(i, 1);
					i--;
					found = true;
				}
			}
			if (!found) {
				send(data, red+"The item "+args+" wasn't found!");
			} else {
				chara.stats = JSON.stringify(chara.stats);
				chara.items = JSON.stringify(chara.items);
				chara.inventory = JSON.stringify(chara.inventory);
				client.hmset(data.character, chara);
				send(data, yellow+"The item "+args+" has been deleted!"+c);
			}
		});
	}

	cmdHandler.inventory = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			let hoja = "\n";
			hoja +="═══════════════════════════════════\n";
			hoja +="    ⭐ ⭐ [color="+chara.color1+"][b]"+chara.name+"'s Inventory[/b][/color] ⭐ ⭐\n";
			hoja +="═══════════════════════════════════";
			hoja +=generar_items(chara.inventory, false);
			send(data, hoja);
			client.hmset(data.character, chara);
		});
	}

	function prettyItemCrafting(item) {
		return prettyItem(item, false)+"\n"+green+"Points used: "+calculateItemPointsCost(item)+"/6"+c+"\n\n";
	}

	function prettyItem(item, oneLine) {
		let icons = {spirit: "⭐", air: "🌪️", water: "🌊", fire: "🔥", earth: "🌳", none: "❌"};
		let colors = {spirit: yellow, air: cyan, water: blue, fire: red, earth: green, none: "[color=white][b]"};
		let effects = "";
		if (item.effects.con != 0) { effects += "+"+item.effects.con+" to Constitution. "; }
		if (item.effects.int != 0) { effects += "+"+item.effects.int+" to Intelligence. "; }
		if (item.effects.agi != 0) { effects += "+"+item.effects.agi+" to Agility. "; }
		if (effects == "") { effects = "No extra effect. "; }

		let message1 =
"\n"+icons[item.element]+icons[item.element2]+colors[item.element]+item.name+c+icons[item.element2]+icons[item.element]+"\n"+
"[i]"+item.description+"[/i]";
		let message2 =
"\n ═ Elements: "+colors[item.element]+item.element+c+"/"+colors[item.element2]+item.element2+c+"\n"+
" ═ Effects: "+effects+" ═ Point cost: "+calculateItemPointsCost(item);
		if (oneLine) { return message1; }
		return message1+message2;
	}

	//}}}
	//////////////////////////////////////////////////
	//              CHARACTER CREATION              //
	//////////////////////////////////////////////////
	//{{{

	cmdHandler.register = function (args, data) {
		client.hexists(data.character, "name", function (err, reply) {
			let message = "You're already registered.";
			if (reply == 0) {
				let nuevo = {};
				nuevo.name = data.character;
				nuevo.stageName = data.character;
				nuevo.points = 6;
				nuevo.stats = JSON.stringify({con: 10, int: 10, agi: 10})

				nuevo.spells = "[]";
				nuevo.items = "[]";

				nuevo.spellbook = JSON.stringify(defaultSpells);
				nuevo.inventory = "[]";

				nuevo.wins = 0;
				nuevo.loses = 0;

				nuevo.color1 = "yellow";
				nuevo.color2 = "cyan";
				nuevo.class = "Mage";

				client.hmset(data.character, nuevo);
				message = green+data.character+" has joined! Please make sure to read the room's description and follow the rules and guidelines! Meow!"+c;
			}
			data.publico ? fChatLibInstance.sendMessage(message, channel) : fChatLibInstance.sendPrivMessage(data.character, message);
		});
	}

	cmdHandler.sheetcolors = function(args, data) {
		let arr = args.toLowerCase().split(' and ');
		let color1 = arr[0];
		let color2 = arr[1];
		let colores = ["red", "blue", "white", "yellow", "pink", "gray", "green", "orange", "purple", "black", "brown", "cyan"];

		if (colores.indexOf(color1) == -1 || colores.indexOf(color2) == -1) {
			send(data, red+"Wrong colors!"+c+", valid colors are: red, blue, white, yellow, pink, gray, green, orange, purple, black, brown and cyan."); return 0;
		}
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara.color1 = color1;
			chara.color2 = color2;
			client.hmset(data.character, chara);
			send(data, green+"Colors changed!"+c);
		});
	}

	cmdHandler.setclass = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara.class = args;
			client.hmset(data.character, chara);
			send(data, green+"Class changed!"+c);
		});
	}

	cmdHandler.stagename = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara.stageName = args;
			client.hmset(data.character, chara);
			send(data, green+"Stage name changed!"+c);
		});
	}

	cmdHandler.cardplus = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			let hoja = "\n";
			hoja +="══════════════════════════\n";
			hoja +="          ⭐ ⭐ [color="+chara.color1+"][b]Character card+[/b][/color] ⭐ ⭐\n";
			hoja +="══════════════════════════\n[color="+chara.color2+"]"; //
			hoja +="[icon]"+chara.name+"[/icon] [b]Name:[/b] "+chara.stageName+" [b]Level:[/b] "+level[chara.wins]+"\n";
			hoja +="[b]Wins/Losses:[/b] "+chara.wins+"/"+chara.loses+" | [b]Class:[/b] "+chara.class+" | [b]Points left:[/b] "+chara.points+"\n";
			chara.stats = JSON.parse(chara.stats);
			let otherStats = generate_otherStats(chara.stats);
			hoja +="[b]Constitution:[/b] "+chara.stats.con+" | [b]Intelligence:[/b] "+chara.stats.int+" | [b]Agility:[/b] "+chara.stats.agi+" | [b]Lust points:[/b] "+otherStats.lustPoints+" | [b]Armor Class:[/b] "+otherStats.AC+"\n";
			hoja +="[b]Spell Save DC:[/b] "+otherStats.spellDC+" | [b]Reflex saving throw:[/b] 1d20+"+otherStats.reflexSave+" | [b]Attack roll:[/b] 1d20+"+otherStats.attackBonus+"\n";
			hoja +="          [b]Active items:[/b][/color]" + generar_items(chara.items, false) + "\n";
			//hoja +="[color="+chara.color2+"]          [b]Active spells:[/b][/color]" + generar_spells(chara.spellbook);
			send(data, hoja);
			chara.stats = JSON.stringify(chara.stats);
			client.hmset(data.character, chara);
		});
	}

	cmdHandler.card = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			let hoja = "\n";
			hoja +="══════════════════════════\n";
			hoja +="          ⭐ ⭐ [color="+chara.color1+"][b]Character card[/b][/color] ⭐ ⭐\n";
			hoja +="══════════════════════════\n[color="+chara.color2+"]"; //
			hoja +="[icon]" + chara.name + "[/icon] [b]Name:[/b] " + chara.stageName + " [b]Level:[/b] "+level[chara.wins]+"\n";
			hoja +="[b]Wins/Losses:[/b] " + chara.wins + "/" + chara.loses + " | [b]Class:[/b] " + chara.class + "\n";
			hoja +="          [b]Active items:[/b][/color]" + generar_items(chara.items, true) + "\n";
			//hoja +="[color="+chara.color2+"]          [b]Active spells:[/b][/color]" + generar_spells(chara.spellbook);
			send(data, hoja);
			client.hmset(data.character, chara);
		});
	}

	function generar_spells(spells, oneLine) {
		let message = "";
		spells = JSON.parse(spells);

		spells.sort(function(a, b){return a.manaCost-b.manaCost});

		for (let i = 0; i < spells.length; i++) {
			message += prettySpell(spells[i], oneLine);
		}
		return message;
	}

	function generar_items(items, oneLine) {
		let message = "";
		items = JSON.parse(items);

		items.sort(function(a, b){return a.pointsCost-b.pointsCost});

		for (let i = 0; i < items.length; i++) {
			message += prettyItem(items[i], oneLine);
		}
		return message;
	}

	cmdHandler.equip = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			chara.inventory = JSON.parse(chara.inventory);
			chara.items = JSON.parse(chara.items);
			chara.stats = JSON.parse(chara.stats);

			let found = false;

			for (let i = 0; i < chara.inventory.length; i++) {
				if (removeBbcode(args) == removeBbcode(chara.inventory[i].name)) {
					if (chara.inventory[i].pointsCost > chara.points) { send(data, red+"You don't have enough available points to equip this item!"+c+" You currently have "+cyan+chara.points+" points"+c+" and this item needs at least "+cyan+chara.inventory[i].pointsCost+" points"+c+" to be equipped!"); return 0; }
					found = true;
					chara.points = parseInt(chara.points) - parseInt(chara.inventory[i].pointsCost);
					chara.stats.con += chara.inventory[i].effects.con;
					chara.stats.int += chara.inventory[i].effects.int;
					chara.stats.agi += chara.inventory[i].effects.agi;
					chara.items.push( JSON.parse( JSON.stringify( chara.inventory[i] ) ) );
					chara.inventory.splice(i, 1);
					break;
				}
			}
			if (!found) { send(data, red+"The item "+args+" wasn't found on your inventory!"+c+" Check your spelling, meow~"); return 0; }
			send(data, green+"The item "+args+" has been equipped!"+c+" You currently have "+cyan+chara.points+" points."+c);

			chara.stats = JSON.stringify(chara.stats);
			chara.items = JSON.stringify(chara.items);
			chara.inventory = JSON.stringify(chara.inventory);
			client.hmset(data.character, chara);
		});
	}

	cmdHandler.unequip = function(args, data) {
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }
			chara = recalculatePointsAndMana(chara);
			chara.inventory = JSON.parse(chara.inventory);
			chara.items = JSON.parse(chara.items);

			let found = false;

			for (let i = 0; i < chara.items.length; i++) {
				if (removeBbcode(args) == removeBbcode(chara.items[i].name)) {
					found = true;
					chara.points = parseInt(chara.points) + parseInt(chara.items[i].pointsCost);
					chara.stats.con -= chara.items[i].effects.con;
					chara.stats.int -= chara.items[i].effects.int;
					chara.stats.agi -= chara.items[i].effects.agi;
					chara.inventory.push( JSON.parse( JSON.stringify( chara.items[i] ) ) );
					chara.items.splice(i, 1);
					break;
				}
			}

			if (!found) { send(data, red+"The item "+args+" wasn't found on your inventory!"+c+" Check your spelling, meow~"); return 0; }
			send(data, yellow+"The item "+args+" has been unequipped!"+c+" You currently have "+cyan+chara.points+" points."+c);

			chara.items = JSON.stringify(chara.items);
			chara.inventory = JSON.stringify(chara.inventory);
			client.hmset(data.character, chara);
		});
	}

	//}}}
	//////////////////////////////////////////////////
	//                     BATTLE                   //
	//////////////////////////////////////////////////
	//{{{

	//////////////////////////////////////////////////////////////// Battle Logic ////////////////////////////////////////////////////////////////
	function battleLogic(data, battle, spellName, target, normal) {

		//////////////////////// Pre-attack stuff (attacker, defendant, spellCasted, mana, initial text)
		//{{{
		if (normal) { battle.characters = JSON.parse(battle.characters); }

		//////////////////////// Check for battle started and turn
		if (battle.started == "false") { send(data, yellow+"The battle hasn't started yet!"+c+status(battle)); return 0; }
		if (battle.characters[battle.turn].name != data.character) { send(data, red+"It's not your turn!"+c); return 0; }

		//////////////////////// Check for prepared spell
		let spellCasted = ""; let attacker = battle.characters[battle.turn];
		let defendant = ""; let ko = ""; let critical = false; let fumble = false;

		for (let i = 0; i < attacker.spellbook.length; i++) {
			if (removeBbcode(spellName) == removeBbcode(attacker.spellbook[i].name)) {
				spellCasted = attacker.spellbook[i];
			}
		}
		if (spellCasted == "") { send(data, red+"The spell "+spellName+" wasn't found in your spellbook!"+c); return 0; }

		//////////////////////// Pick up defendant
		if (battle.characters.length == 2 && target == "") {
			if (spellCasted.type == "damage" || spellCasted.type == "debuff") {
				if (battle.turn == 0) { defendant = battle.characters[1]; } else { defendant = battle.characters[0]; }
			} else {
				defendant = attacker;
			}
		} else {
			if (target == "") { send(data, red+"You have to write your target's name."+c+" Example: !cast Magic missle to Kenia Nya"); return 0; }
			for (let i = 0; i < battle.characters.length; i++) {
				if (battle.characters[i].name == target) {
					defendant = battle.characters[i];
				}
			}
			if (defendant == "") { send(data, red+target+" wasn't found on the current battle!"+c+" Check your spelling."); return 0; }
		}


		//////////////////////// Check if enough mana and decrease it
		if (spellCasted.manaCost > attacker.mana) { send(data, red+"You don't have enough mana to cast that spell!"+c+" You can !pass your turn and recover some mana or pick another spell."); return 0; }

		attacker.mana = parseInt(attacker.mana) - parseInt(spellCasted.manaCost);
		let colors = {spirit: yellow, air: cyan, water: blue, fire: red, earth: green, none: "[color=white][b]"};
		let flavorText = cyan+attacker.name+c+" uses "+blue+spellCasted.manaCost+" mana"+c+" to cast "+colors[spellCasted.element]+spellCasted.name+c+" "+c+"[i]("+spellCasted.description+")[/i]"+green+" at "+cyan+defendant.name+c+" ";
		//}}}

		//////////////////////// Spell types (damage, debuff, heal, buff)
		//{{{
		//////////////////////// Damage type of spell
		if (spellCasted.type == "damage") {
			// from 1 to 16 mana: +2, from 17 to 32: +1
			let secretBonus = 0;
			if (spellCasted.manaCost > 32) { secretBonus = 2; }
			if (spellCasted.manaCost > 16) { secretBonus = 1; }

			//////////////////////// 1d20+attacker.attackBonus
			let attackDiceRoll = Math.ceil(Math.random() * (20 - parseInt(attacker.missCount) - secretBonus)) + parseInt(attacker.missCount) + secretBonus;
			if (!normal || spellCasted.hitType == "auto") { attackDiceRoll = 19; }

			if (forced20) { attackDiceRoll = 20; forced20 = false; }
			if (forced1) { attackDiceRoll = 1; forced1 = false; }

			if (attackDiceRoll == 20) { critical = true; flavorText += "[color=yellow](Critical hit!)[/color] "; }
			if (attackDiceRoll == 1) { fumble = true; flavorText += "[color=yellow](Fumble!)[/color] "; }

			let element = elementModifier(spellCasted, defendant);

			attackDiceRoll += parseInt(attacker.attackBonus);

			if (attackDiceRoll >= defendant.AC || spellCasted.hitType == "auto" || critical) {
				attacker.missCount = 0;
				let damageDiceRoll = 0;
				damageDiceRoll += element.modifier;
				let n = 1;
				if (critical) { n = 2; }
				for (let i = 0; i < (parseInt(spellCasted.numberOfAttacks) * n); i++) {
					let individualDice = Math.ceil(Math.random() * parseInt(spellCasted.dice));
					console.log("individualDice "+individualDice);
					damageDiceRoll += individualDice;
				}
				console.log("damageDiceRoll "+damageDiceRoll);
				let attackBonus = "";
				if (spellCasted.attackBonus == "int") {
					attackBonus = "+"+attacker.attackBonus;
					damageDiceRoll += parseInt(attacker.attackBonus);

					console.log("damageDiceRoll + attacker.attackBonus"+damageDiceRoll);
				}

				damageDiceRoll -= parseInt(defendant.stats.defense);
				console.log("damageDiceRoll - defendant.stats.defense: "+damageDiceRoll);

				if (damageDiceRoll <= 0) { damageDiceRoll = 1; }
				flavorText += "and they "+red+"hit!"+c+" Dealing "+pink+damageDiceRoll+" lust points!"+c+"\n"

				//////////////////////// Apply damage and show result
				defendant.lp = parseInt(defendant.lp) - damageDiceRoll;

				let defenseText = "";
				if (defendant.stats.defense > 0) {
					defenseText = "(-"+defendant.stats.defense+" for defense)";
				}
				if (defendant.stats.defense < 0) {
					defenseText = "(+"+(defendant.stats.defense * -1)+" for defense)";
				}


				if (defendant.lp <= 0) {
					defendant.lp = 0;
					flavorText += "[color=red]"+defendant.name+" can't resist anymore and passes out![/color]";
					ko = defendant.name;
				}

				if (spellCasted.hitType == "auto") {
					flavorText += c+"[sup](Elemental interaction: "+element.modifierText+", Damage dice: "+spellCasted.numberOfAttacks+"d"+spellCasted.dice+attackBonus+element.modifierText2+defenseText+" = "+damageDiceRoll+")[/sup]"+green;
				} else {
					flavorText += c+"[sup](Attack dice: 1d20+"+attacker.attackBonus+" = "+attackDiceRoll+", Defendant's AC: "+defendant.AC+", Elemental interaction: "+element.modifierText+", Damage dice: "+(parseInt(spellCasted.numberOfAttacks) * n)+"d"+spellCasted.dice+attackBonus+element.modifierText2+defenseText+" = "+damageDiceRoll+")[/sup]"+green;
				}

			} else {
				attacker.missCount = parseInt(attacker.missCount) + 1;
				if (!fumble) { flavorText += "but they "+red+"miss!"+c+"\n" }
				else {
					flavorText += "but their spell "+red+"explodes"+c+" on their face! (They lose "+pink+"1d"+spellCasted.dice+" LP"+c+")\n";
					attacker.lp = parseInt(attacker.lp) - Math.ceil(Math.random() * spellCasted.dice);
					}
				flavorText += c+"[sup](Attack dice: 1d20+"+attacker.attackBonus+" = "+attackDiceRoll+", Defendant's AC: "+defendant.AC+")[/sup]"+green;
			}
		}

		//////////////////////// Debuff type of spell
		if (spellCasted.type == "debuff") {
			if (defendant.activeDebuffs.length != 0) { defendant = removeDebuff(defendant, 0); }

			let saveDiceRoll = Math.ceil(Math.random() * (20 - parseInt(attacker.missCount)));
			if (!normal) { saveDiceRoll = 2; }
			if (forced20) { attackDiceRoll = 20; forced20 = false; }
			if (forced1) { attackDiceRoll = 1; forced1 = false; }
			if (saveDiceRoll == 20) {
				critical = true;
				flavorText += "[color=yellow](Critical success!)[/color] But they "+yellow+"reflect"+c+" the spell to their owner! ";
				defendant = attacker;
			}
			if (saveDiceRoll == 1) { fumble = true; flavorText += "[color=yellow](Fumble!)[/color] "; }
			saveDiceRoll += parseInt(defendant.reflexSave);

			let element = elementModifier(spellCasted, defendant);

			if (saveDiceRoll < (parseInt(attacker.spellDC)+element.modifier) || fumble || critical) {
				if (!critical) { attacker.missCount = 0; } else { attacker.missCount = parseInt(attacker.missCount) + 1; }
				//////////////////////// Apply debuff and show result
				if (!critical) { flavorText += "and they "+red+"hit!"+c+" "; }
				flavorText += yellow+defendant.name+c+" gets "+red;
				let effect = {con: 0, int: 0, agi: 0, defense: 0, duration: 0};
				effect.duration = parseInt(spellCasted.effectDuration);
				if (fumble || critical) { effect.duration += 1; }

				/*
				if (spellCasted.effects.con != "0") {
					defendant.stats.con = parseInt(defendant.stats.con) - parseInt(spellCasted.effects.con);
					effect.con = parseInt(spellCasted.effects.con);
					flavorText += "-"+parseInt(spellCasted.effects.con)+" to Constitution, ";
					defendant.lp = parseInt(defendant.lp) - Math.floor(effect.con * 4);
				}
				*/
				if (spellCasted.effects.int != "0") {
					defendant.stats.int = parseInt(defendant.stats.int) - parseInt(spellCasted.effects.int);
					effect.int = parseInt(spellCasted.effects.int);
					flavorText += "-"+parseInt(spellCasted.effects.int)+" to Intelligence, ";
				}
				if (spellCasted.effects.agi != "0") {
					defendant.stats.agi = parseInt(defendant.stats.agi) - parseInt(spellCasted.effects.agi);
					effect.agi = parseInt(spellCasted.effects.agi);
					flavorText += "-"+parseInt(spellCasted.effects.agi)+" to Agility, ";
				}
				if (spellCasted.effects.defense != "0") {
					defendant.stats.defense = parseInt(defendant.stats.defense) - parseInt(spellCasted.effects.defense);
					effect.defense = parseInt(spellCasted.effects.defense);
					flavorText += "-"+parseInt(spellCasted.effects.defense)+" to Defense, ";
				}


				if (!critical) { flavorText += c+"for "+effect.duration+" turns!"; } else { flavorText += "for "+(effect.duration-1)+" turns!"; }
				if (fumble) { flavorText += " (1 extra turn for fumbling)"; }
				flavorText += "\n";
				defendant.activeDebuffs.push(JSON.parse(JSON.stringify(effect)));

				if (defendant.lp <= 0) {
					defendant.lp = 0;
					flavorText += " [color=red]"+defendant.name+" can't resist anymore and passes out![/color]";
					ko = defendant.name;
				}

				let otherStats = generate_otherStats(defendant.stats);
				defendant.spellDC = otherStats.spellDC;
				defendant.reflexSave = otherStats.reflexSave;
				defendant.attackBonus = otherStats.attackBonus;
				defendant.AC = otherStats.AC;

			} else {
				attacker.missCount = parseInt(attacker.missCount) + 1;
				flavorText += "but they "+red+"miss!"+c+"\n"
			}
			flavorText += c+"[sup](Elemental interaction: "+element.modifierText+", Spell save dice: 1d20+"+defendant.reflexSave+" = "+saveDiceRoll+", Attacker's spell DC: "+attacker.spellDC+element.modifierText2+")[/sup]"+green;
		}

		//////////////////////// Heal type of spell
		if (spellCasted.type == "heal") {

			let damageDiceRoll = 0;
			for (let i = 0; i < parseInt(spellCasted.numberOfAttacks); i++) {
				let individualDice = Math.ceil(Math.random() * parseInt(spellCasted.dice));
				damageDiceRoll += individualDice;
			}
			let attackBonus = "";
			if (spellCasted.attackBonus == "int") {
				attackBonus = "+"+attacker.attackBonus;
				damageDiceRoll += parseInt(attacker.attackBonus);
			}

			//////////////////////// Heal
			if (parseInt(defendant.lp) + damageDiceRoll > parseInt(defendant.max_lp)) {
				defendant.lp = parseInt(defendant.max_lp);
			} else {
				defendant.lp = parseInt(defendant.lp) + damageDiceRoll;
			}


			flavorText += "and they heal for "+pink+damageDiceRoll+" lust points!"+c+"\n"
			flavorText += c+"[sup](Healing dice: "+spellCasted.numberOfAttacks+"d"+spellCasted.dice+attackBonus+" = "+damageDiceRoll+")[/sup]"+green;
		}

		//////////////////////// Buff type of spell
		if (spellCasted.type == "buff") {
			if (attacker.activeBuffs.length != 0) { attacker = removeBuff(attacker, 0); }

			flavorText += "and they get ";
			let effect = {con: 0, int: 0, agi: 0, defense: 0, duration: 0};
			effect.duration = parseInt(spellCasted.effectDuration) + 1; //This because the effect tick happens at the end of the turn

			if (spellCasted.effects.con != "0") {
				defendant.stats.con = parseInt(defendant.stats.con) + parseInt(spellCasted.effects.con);
				effect.con = parseInt(spellCasted.effects.con);
				flavorText += "+"+parseInt(spellCasted.effects.con)+" to Constitution, ";
				defendant.lp = parseInt(defendant.lp) + Math.floor(effect.con * 5 / 2);	//////////////////////////////////////////////////////////
				defendant.max_lp = parseInt(defendant.max_lp) + Math.floor(effect.con * 5 / 2);
			}
			if (spellCasted.effects.int != "0") {
				defendant.stats.int = parseInt(defendant.stats.int) + parseInt(spellCasted.effects.int);
				effect.int = parseInt(spellCasted.effects.int);
				flavorText += "+"+parseInt(spellCasted.effects.int)+" to Intelligence, ";
			}
			if (spellCasted.effects.agi != "0") {
				defendant.stats.agi = parseInt(defendant.stats.agi) + parseInt(spellCasted.effects.agi);
				effect.agi = parseInt(spellCasted.effects.agi);
				flavorText += "+"+parseInt(spellCasted.effects.agi)+" to Agility, ";
			}
			if (spellCasted.effects.defense != "0") {
				defendant.stats.defense = parseInt(defendant.stats.defense) + parseInt(spellCasted.effects.defense);
				effect.defense = parseInt(spellCasted.effects.defense);
				flavorText += "+"+parseInt(spellCasted.effects.defense)+" to Defense, ";
			}
			flavorText += "for "+(effect.duration-1)+" turns!";
			defendant.activeBuffs.push(JSON.parse(JSON.stringify(effect)));

			let otherStats = generate_otherStats(defendant.stats);
			defendant.spellDC = otherStats.spellDC;
			defendant.reflexSave = otherStats.reflexSave;
			defendant.attackBonus = otherStats.attackBonus;
			defendant.AC = otherStats.AC;

		}
		//}}}

		if (normal) { endOfTurn(data, battle, castMana, flavorText+" [color=cyan]Mana gain: "+castMana+"[/color]", ko); }
		else { send(data, green+flavorText+c); }
	}

	cmdHandler.pass = function(args, data) {
		let key = channel;
		client.hexists(key, "name", function (err, reply) {

			if (reply == 0) { send(data, green+"There's no battle going on"+c); return 0; }

			client.hgetall(key, function(err, battle) {
				battle.characters = JSON.parse(battle.characters);
				if (battle.started == "false") { send(data, yellow+"The battle hasn't started yet!"+c+status(battle)); return 0; }
				if (battle.characters[battle.turn].name != data.character) { send(data, red+"It's not your turn!"+c); return 0; }

				let flavorText = data.character+" has passed their turn! They gain twice the mana! [color=cyan]Mana gain: "+passMana+"[/color]";

				endOfTurn(data, battle, passMana, flavorText, "");
			});
		});
	}

	function endOfTurn(data, battle, manaGain, flavorText, ko) {
		let manaBonus = parseInt(battle.round) - 1;
		if (manaBonus > 0) { flavorText += "[color=cyan]+"+manaBonus+"[/color]"; }
		manaGain += manaBonus;

		let currentPlayer = battle.characters[battle.turn];
		currentPlayer.mana = manaGain + parseInt(currentPlayer.mana);

		for (let i = 0; i < currentPlayer.activeBuffs.length; i++) {
			currentPlayer.activeBuffs[i].duration = parseInt(currentPlayer.activeBuffs[i].duration) - 1;
			if (currentPlayer.activeBuffs[i].duration <= 0) {
				currentPlayer = removeBuff(currentPlayer, i);
				i--;
			}
		}
		for (let i = 0; i < currentPlayer.activeDebuffs.length; i++) {
			currentPlayer.activeDebuffs[i].duration = parseInt(currentPlayer.activeDebuffs[i].duration) - 1;
			if (currentPlayer.activeDebuffs[i].duration <= 0) {
				currentPlayer = removeDebuff(currentPlayer, i);
				i--;
			}
		}

		battle.turn = parseInt(battle.turn) + 1;
		if (battle.turn == battle.characters.length) { battle.turn = 0; }
		if (battle.turn == battle.roundIncrease) { battle.round = parseInt(battle.round) + 1; }

		let finishText = "";
		if (ko != "") {
			let teams = [];
			for (let i = 0; i < battle.characters.length; i++) {
				if (battle.characters[i].name == ko) {
					battle.characters.splice(i, 1); i--;
					if (battle.turn >= battle.characters.length) { battle.turn = 0; }

					// For two players only, meow!
					if (battle.characters.length == 1) {
						battle.started = false;
						finishText = battle.characters[0].name+" has won! Battle finished~";
						break;
					}

				} else {
					if (teams.indexOf(battle.characters[i].team) == -1) {
						if (battle.characters[i].team == "") {
							teams.push(battle.characters[i].name);
						} else {
							teams.push(battle.characters[i].team);
						}
					}
				}
			}
			if (teams.length == 1 && battle.characters.length > 1) {
				battle.started = false;
				if (battle.characters[i].team == "") {
					finishText = battle.characters[0].name+" has won! Battle finished~";
				} else {
					finishText = battle.characters[0].team+" has won! Battle finished~";
				}
			}
		}

		send(data, green+flavorText+c+status(battle)+"\n"+cyan+finishText+c);

		let key = channel;
		if (battle.started == "true") {
			battle.characters = JSON.stringify(battle.characters);
			client.hmset(key, battle);
		} else {
			client.del(key);
		}


	}
	//////////////////////////////////////////////////////////////// Battle Logic ////////////////////////////////////////////////////////////////

	cmdHandler.ready = function(args, data) {
		let key = channel;
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }

			chara = recalculatePointsAndMana(chara);
			if (chara.points < 0) { send(data, red+"You have more than 6 points in your items!"+c+" Please use !edititem to fix this. You can check your points using !cardplus (can do it in private)"); return 0; }

			if (JSON.parse(chara.spellbook).length == 0) { send(data, red+"You don't have any spells yet!"+c+" use !createspell to make some~!"); return 0; }

			//////////////////////////////////////////////// Check for team selection!
			let team = ""; if (args.indexOf("team ") != -1) { team = " [color=yellow]Team: "+args.slice(args.indexOf("team ")+5)+"[/color]"; }

			client.hexists(key, "name", function (err, reply) {
				if (reply == 0) { //no hay combate

					chara = prepareForBattle(chara, true);
					//if (team == "") { team = " [sub][color=yellow]No team "+chara.name+"[/color][/sub]");
					chara.team = team;
					let battle = {name: "Meow", round: 0, characters: [chara], started: "false"};

					send(data, green+data.character+" has entered the magical arena!"+c+status(battle));
					battle.characters = JSON.stringify(battle.characters);
					client.hmset(key, battle);

					return 0;

				}
				client.hgetall(key, function(err, battle) {
					if (battle.started == "true") { send(data, red+"A battle has already started!"+c); return 0; }

					battle.characters = JSON.parse(battle.characters);

					for (let i = 0; i < battle.characters.length; i++) {
						if (battle.characters[i].name == data.character) { send(data, red+"You're already inside the magical arena!"+c); return 0; }
					}

					chara = prepareForBattle(chara, true)
					chara.team = team;
					battle.characters.push(chara);
					send(data, green+data.character+" has entered the magical arena!"+c+status(battle));

					battle.characters = JSON.stringify(battle.characters);
					client.hmset(key, battle);
				});
			});
		});
	}

	cmdHandler.unready = function(args, data) {
		let key = channel;
		client.hgetall(data.character, function (err, chara) {
			if (chara == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!"); return 0; }

			client.hexists(key, "name", function (err, reply) {
				if (reply == 0) { send(data, green+"There's no battle going on"+c); return 0; }
				client.hgetall(key, function(err, battle) {
					battle.characters = JSON.parse(battle.characters);
					for (let i = 0; i < battle.characters.length; i++) {
						if (battle.characters[i].name == data.character) {
							battle.characters.splice(i, 1);
							if (battle.turn >= battle.characters.length) { battle.turn = 0; }
							if (battle.characters.length == 0) {
								client.del(key);
								send(data, red+"The arena has been cleared!"+c);
								return 0;
							} else {
								send(data, red+data.character+" has left the magical arena!"+c+status(battle));
							}
						}
					}

					battle.characters = JSON.stringify(battle.characters);
					client.hmset(key, battle);
				});
			});
		});
	}

	cmdHandler.endfight = function(args, data) {
		let key = channel;
		let oldKey = channel+" old";

		client.hexists(key, "name", function (err, reply) {

			if (reply == 0) { send(data, green+"There's no battle going on"+c); return 0; }

			client.hgetall(key, function(err, battle) {
				if (battle.started == "false") {
					client.del(key);
					send(data, red+"The arena has been cleared!"+c);
					return 0;
				}
				client.rename(key, oldKey);
				send(data, red+"The arena has been cleared! (Contact an admin if you want to undo this action)"+c);
				return 0;
			});
		});
	}

	cmdHandler.recoverfight = function(args, data) {
		let key = channel;
		let oldKey = channel+" old";
		if (fChatLibInstance.roomMods[channel].indexOf(data.character) == -1) { return 0; }
		client.hexists(oldKey, "name", function (err, reply) {
			if (reply == 0) { send(data, red+"There is no saved battle"+c); return 0; }
			client.rename(oldKey, key);
			//send(data, green+"The previous battle has been recovered!"+c); return 0;
			client.hgetall(key, function(err, battle) {
				battle.characters = JSON.parse(battle.characters);
				send(data, green+"The previous battle has been recovered!"+c+status(battle));
			});
		});

	}

	cmdHandler.begin = function(args, data) {
		let key = channel;
		client.hexists(key, "name", function (err, reply) {

			if (reply == 0) { send(data, green+"There's no battle going on"+c); return 0; }

			client.hgetall(key, function(err, battle) {
				if (battle.started == "true") { send(data, red+"The battle has already begun!"+c); return 0; }
				battle.characters = JSON.parse(battle.characters);
				if (battle.characters.length < 2) { send(data, red+"There aren't enough players! You need at least two!"+c); return 0; }

				battle.started = "true";
				let firstPlayer = Math.floor(Math.random() * battle.characters.length);
				battle.turn = firstPlayer;
				battle.round = 1;
				battle.roundIncrease = firstPlayer;

				send(data, cyan+"The magic battle has begun!"+c+status(battle));
				battle.characters = JSON.stringify(battle.characters);
				client.hmset(key, battle);

			});


		});
	}

	cmdHandler.status = function(args, data) {
		let key = channel;
		client.hexists(key, "name", function (err, reply) {
			if (reply == 0) { send(data, green+"There's no battle going on"+c); return 0; }

			client.hgetall(key, function(err, battle) {
				battle.characters = JSON.parse(battle.characters);
				if (battle.started == "false") { send(data, yellow+"The battle hasn't started yet!"+c+status(battle)); return 0; }
				send(data, green+"Current battle:"+c+status(battle));
			});
		});
	}

	function status(battle) {
		let message = "\n[color=cyan]═══════════════ ⭐ "+yellow+"Magical Arena - Round "+battle.round+" "+c+" ⭐ ═══════════════[/color]";
		for (let i = 0; i < battle.characters.length; i++) {
			let p = battle.characters[i];
			message += "\n[color=pink][b]LP:[/b][/color] "+hpBarL(p.lp,p.max_lp)+" [color=blue][b]MP: "+p.mana+"[/b][/color]   [icon]"+p.name+"[/icon] [color="+p.color2+"]"+p.stageName+"[/color]"+p.team;

			for (let j = 0; j < p.activeBuffs.length; j++) {
				message += " [color=green][sub](";
				if (p.activeBuffs[j].con != 0) { message += "+"+p.activeBuffs[j].con+" to con, "; }
				if (p.activeBuffs[j].int != 0) { message += "+"+p.activeBuffs[j].int+" to int, "; }
				if (p.activeBuffs[j].agi != 0) { message += "+"+p.activeBuffs[j].agi+" to agi, "; }
				if (p.activeBuffs[j].defense != 0) { message += "+"+p.activeBuffs[j].defense+" to defense, "; }
				message += p.activeBuffs[j].duration+" turn(s) left)[/sub][/color]";
			}
			for (let j = 0; j < p.activeDebuffs.length; j++) {
				message += " [color=red][sub](";
				//if (p.activeDebuffs[j].con != 0) { message += "-"+p.activeDebuffs[j].con+" to con, "; }
				if (p.activeDebuffs[j].int != 0) { message += "-"+p.activeDebuffs[j].int+" to int, "; }
				if (p.activeDebuffs[j].agi != 0) { message += "-"+p.activeDebuffs[j].agi+" to agi, "; }
				if (p.activeDebuffs[j].defense != 0) { message += "-"+p.activeDebuffs[j].defense+" to defense, "; }
				message += p.activeDebuffs[j].duration+" turn(s) left)[/sub][/color]";
			}
		}
		if (battle.started == "true") {
			message += "\n"+cyan+"► It's "+battle.characters[battle.turn].name+"'s turn!";
		}
		return message;
	}

	function hpBarL(size, maxsize) {
		var fill = Math.ceil(size*15/maxsize);
		if (fill >= 7) { var color = "[/color][color=pink]"; } else { var color = "[/color][color=red]"; }
		return "[color=black]"+"█".repeat(15-fill)+color+"█".repeat(fill)+"[/color]";
	}

	function mpBarL(size, maxsize) {
		var fill = Math.ceil(size*10/maxsize);
		var color = "[/color][color=blue]";
		return "[color=black]"+"█".repeat(10-fill)+color+"█".repeat(fill)+"[/color]";
	}

	cmdHandler.cast = function(args, data) {
		let key = channel;
		if (args == "") { send(data, red+"You have to type the name of your spell"+c); return 0; }
		// !cast spell name to target
		let argsList = args.split(" to ");
		let spellName = argsList[0];
		let target = "";
		if (argsList.length > 2) { send(data, red+"Invalid number of targets"+c+" Example: !cast Magic missle to Kenia Nya"); return 0; }
		if (argsList.length == 2) { target = getUser(argsList[1]); }

		client.hexists(key, "name", function (err, reply) {

			if (reply == 0) { //////////////////////////// OUT OF COMBAT CASTING ////////////////////////////
				client.hgetall(data.character, function (err, chara1) {
					if (chara1 == null) { send(data, red+"You're not registered."+c+" Use !register to join the Magical Arena!");return 0; }
					if (chara1.spells.length == 0) { send(data, red+"You don't have any prepared spells yet!"+c+" use !createspell to make some~ and !prepare to get them ready!"); return 0; }

					client.hgetall(target, function (err, chara2) {
						if (chara2 == null) { send(data, red+"Your target is not registered."+c+" Tell them to use !register to join the Magical Arena!"); return 0; }

						chara1 = prepareForBattle(chara1, true);
						chara2 = prepareForBattle(chara2, true);
						chara1.mana = 9999;

						let battle = {started: "true", turn: 0, characters: [chara1, chara2]};
						battleLogic(data, battle, spellName, target, false);
					});
				});
				return 0;
			}
			client.hgetall(key, function(err, battle) {
				battleLogic(data, battle, spellName, target, true)
			});
		});
	}

	function elementModifier(spellCasted, defendant) {

		let icons = {spirit: "⭐", air: "🌪️", water: "🌊", fire: "🔥", earth: "🌳", none: "❌"};
		//let colors = {spirit: yellow, air: cyan, water: blue, fire: red, earth: green, none: "[color=white][b]"};

		let modifier = 0;
		let modifierText = "[ ";
		let attackerElements = [spellCasted.element, spellCasted.element2];
		let defendantElements = [];

		if (defendant.items.length == 0) {
			modifierText += icons["none"]+"<"+icons[attackerElements[0]]+", "+icons["none"]+"<"+icons[attackerElements[1]]+", ";
			modifier = 2;
		}

		for (let i = 0; i < defendant.items.length; i++) {
			if (defendantElements.indexOf(defendant.items[i].element) == -1) { defendantElements.push(defendant.items[i].element); }
			if (defendantElements.indexOf(defendant.items[i].element2) == -1) { defendantElements.push(defendant.items[i].element2); }
		}

		console.log(JSON.stringify(attackerElements));
		console.log(JSON.stringify(defendantElements));

		for (let i = 0; i < defendantElements.length; i++) {
			modifier += elements[attackerElements[0]][defendantElements[i]];
			modifierText += icons[defendantElements[i]]+moreOrLess(elements[attackerElements[0]][defendantElements[i]])+icons[attackerElements[0]]+", ";
		}
		for (let i = 0; i < defendantElements.length; i++) {
			modifier += elements[attackerElements[1]][defendantElements[i]];
			modifierText += icons[defendantElements[i]]+moreOrLess(elements[attackerElements[1]][defendantElements[i]])+icons[attackerElements[1]]+", ";
		}

		console.log(modifier);

		if (modifier < 0) { modifier = -1; }
		if (modifier > 3) { modifier = 2; }

		let modifierText2 = "";
		if (modifier >= 0) { modifierText2 += "+"+modifier; }
		if (modifier < 0) { modifierText2 += modifier; }

		modifierText += modifierText2+" ]";
		return {modifier: modifier, modifierText: modifierText, modifierText2: modifierText2};
	}

	function moreOrLess(n) {
		if (n > 0) { return "<"; }
		if (n < 0) { return ">"; }
		if (n == 0) { return "="; }
	}

	function removeDebuff(currentPlayer, i) {

		//currentPlayer.stats.con = parseInt(currentPlayer.stats.con) - parseInt(currentPlayer.activeDebuffs[i].con);
		currentPlayer.stats.int = parseInt(currentPlayer.stats.int) + parseInt(currentPlayer.activeDebuffs[i].int);
		currentPlayer.stats.agi = parseInt(currentPlayer.stats.agi) + parseInt(currentPlayer.activeDebuffs[i].agi);
		currentPlayer.stats.defense = parseInt(currentPlayer.stats.defense) + parseInt(currentPlayer.activeDebuffs[i].defense);
		let otherStats = generate_otherStats(currentPlayer.stats);
		currentPlayer.spellDC = otherStats.spellDC;
		currentPlayer.reflexSave = otherStats.reflexSave;
		currentPlayer.attackBonus = otherStats.attackBonus;
		currentPlayer.AC = otherStats.AC;

		//currentPlayer.lp = parseInt(currentPlayer.lp) - Math.floor(parseInt(currentPlayer.activeDebuffs[i].con) * 4);
		//currentPlayer.max_lp = parseInt(currentPlayer.max_lp) - Math.floor(parseInt(currentPlayer.activeDebuffs[i].con) * 4);
		//if (currentPlayer.lp <= 0) { currentPlayer.lp = 1; }

		currentPlayer.activeDebuffs.splice(i, 1);

		return currentPlayer;
	}

	function removeBuff(currentPlayer, i) {

		currentPlayer.stats.con = parseInt(currentPlayer.stats.con) - parseInt(currentPlayer.activeBuffs[i].con);
		currentPlayer.stats.int = parseInt(currentPlayer.stats.int) - parseInt(currentPlayer.activeBuffs[i].int);
		currentPlayer.stats.agi = parseInt(currentPlayer.stats.agi) - parseInt(currentPlayer.activeBuffs[i].agi);
		currentPlayer.stats.defense = parseInt(currentPlayer.stats.defense) - parseInt(currentPlayer.activeBuffs[i].defense);
		let otherStats = generate_otherStats(currentPlayer.stats);
		currentPlayer.spellDC = otherStats.spellDC;
		currentPlayer.reflexSave = otherStats.reflexSave;
		currentPlayer.attackBonus = otherStats.attackBonus;
		currentPlayer.AC = otherStats.AC;
		currentPlayer.lp = parseInt(currentPlayer.lp) + Math.floor((parseInt(currentPlayer.activeBuffs[i].con) * 5 / 2)); ///////////////////////////////
		currentPlayer.activeBuffs.splice(i, 1);

		return currentPlayer;
	}

	//}}}
	//////////////////////////////////////////////////
	//                     OTHERS                   //
	//      removeBbcode, getUser, s, listener      //
	//////////////////////////////////////////////////
	//{{{
	function removeBbcode (args) {
		if (args == "" || args === undefined) { return args; }
		let pasa = true; let nuevo = "";
		for (let i = 0; i < args.length; i++) {
			if (args[i] == "[") { pasa = false; continue; }
			if (args[i] == "]") { pasa = true; continue; }
			if (pasa) { nuevo += args[i]; }
		}
		return nuevo.toLowerCase().trim();
	}

	function getUser (args) {
		if (args == "" || args === undefined) { return args; }
		let pasa = true; let nuevo = "";
		for (let i = 0; i < args.length; i++) {
			if (args[i] == "[") { pasa = false; continue; }
			if (args[i] == "]") { pasa = true; continue; }
			if (pasa) { nuevo += args[i]; }
		}
		let names = Object.keys(fChatLibInstance.onlineUsers);
		for (let i = 0; i < names.length; i++) {
			if (names[i].toLowerCase() == nuevo.toLowerCase()) { return names[i]; }
		} return args;
	}

	cmdHandler.s = function(args, data) { send({publico: true}, args);	} //echo or speak

	//Listener
	if (channel == "adh-3769ad21f5b2d22c46db") {
		fChatLibInstance.addPrivateMessageListener(function(parent, data) {
			if (data && data.message && data.message.length > 2 && data.message[0] == '!') {
				let opts = {
					command: String(data.message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
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
	}

	return cmdHandler;
	//}}}
};
