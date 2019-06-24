/*
Welcome to the shop!

Items from 0   to  99 - Outfits
Items from 100 to 199 - Sextoys
Items from 200 to 299 - Accessories

*/

var items = [];

// ***** OUTFITS *****

items.push({id: 0,	name: "Nude",						slot: "armor",		Gold: 0,	flavor: "All exposed" });
items.push({id: 1,	name: "Light lower clothes front",	slot: "armor",		Gold: 10,	defsex: 1 });
items.push({id: 2,	name: "Medium lower clothes front",	slot: "armor",		Gold: 20,	defsex: 2 });
items.push({id: 3,	name: "Heavy lower clothes front",	slot: "armor",		Gold: 30,	defsex: 3 });
items.push({id: 4,	name: "Light lower clothes back",	slot: "armor",		Gold: 10,	defass: 1 });
items.push({id: 5,	name: "Medium lower clothes back",	slot: "armor",		Gold: 20,	defass: 2 });
items.push({id: 6,	name: "Heavy lower clothes back",	slot: "armor",		Gold: 30,	defass: 3 });
items.push({id: 7,	name: "Light lower clothes",		slot: "armor",		Gold: 20,	defsex: 1, defass: 1	});
items.push({id: 8,	name: "Medium lower clothes",		slot: "armor",		Gold: 40,	defsex: 2, defass: 2	});
items.push({id: 9,	name: "Heavy lower clothes",		slot: "armor",		Gold: 60,	defsex: 3, defass: 3	});

items.push({id: 16,	name: "Light upper and front clothes",		slot: "armor",		Gold: 20,	defsex: 1, deftits: 1	});
items.push({id: 17,	name: "Medium upper and front clothes",		slot: "armor",		Gold: 40,	defsex: 2, deftits: 2	});
items.push({id: 18,	name: "Heavy upper and front clothes",		slot: "armor",		Gold: 60,	defsex: 3, deftits: 3	});

items.push({id: 10,	name: "Light upper clothes",		slot: "armor",		Gold: 10,	deftits: 1	});
items.push({id: 11,	name: "Medium upper clothes",		slot: "armor",		Gold: 20,	deftits: 2	});
items.push({id: 12,	name: "Heavy upper clothes",		slot: "armor",		Gold: 30,	deftits: 3	});
items.push({id: 13,	name: "Light full outfit",			slot: "armor",		Gold: 30,	deftits: 1, defsex: 1, defass: 1	});
items.push({id: 14,	name: "Medium full outfit",			slot: "armor",		Gold: 60,	deftits: 2, defsex: 2, defass: 2	});
items.push({id: 15,	name: "Heavy full outfit",			slot: "armor",		Gold: 90,	deftits: 3, defsex: 3, defass: 3	});

// ***** SEXTOYS *****

items.push({id: 100,	name: "Hand",			slot: "weapon",		Gold: 0,	flavor: "Starter weapon"	});
items.push({id: 101,	name: "Light hand sextoy",	slot: "weapon",		Gold: 10,	atkfingers: 1	});
items.push({id: 102,	name: "Medium hand sextoy",	slot: "weapon",		Gold: 20,	atkfingers: 2	});
items.push({id: 103,	name: "Heavy hand sextoy",	slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 104,	name: "Light feet sextoy",	slot: "weapon",		Gold: 10,	atkfeet: 1	});
items.push({id: 105,	name: "Medium feet sextoy",	slot: "weapon",		Gold: 20,	atkfeet: 2	});
items.push({id: 106,	name: "Heavy feet sextoy",	slot: "weapon",		Gold: 30,	atkfeet: 3	});
items.push({id: 107,	name: "Light chest sextoy",	slot: "weapon",		Gold: 10,	atktits: 1	});
items.push({id: 108,	name: "Medium chest sextoy",slot: "weapon",		Gold: 20,	atktits: 2	});
items.push({id: 109,	name: "Heavy chest sextoy",	slot: "weapon",		Gold: 30,	atktits: 3	});
items.push({id: 110,	name: "Light lips sextoy",	slot: "weapon",		Gold: 10,	atklips: 1	});
items.push({id: 111,	name: "Medium lips sextoy",	slot: "weapon",		Gold: 20,	atklips: 2	});
items.push({id: 112,	name: "Heavy lips sextoy",	slot: "weapon",		Gold: 30,	atklips: 3	});
items.push({id: 113,	name: "Light sex sextoy",	slot: "weapon",		Gold: 10,	atksex: 1	});
items.push({id: 114,	name: "Medium sex sextoy",	slot: "weapon",		Gold: 20,	atksex: 2	});
items.push({id: 115,	name: "Heavy sex sextoy",	slot: "weapon",		Gold: 30,	atksex: 3	});
items.push({id: 116,	name: "Light ass sextoy",	slot: "weapon",		Gold: 10,	atkass: 1	});
items.push({id: 117,	name: "Medium ass sextoy",	slot: "weapon",		Gold: 20,	atkass: 2	});
items.push({id: 118,	name: "Heavy ass sextoy",	slot: "weapon",		Gold: 30,	atkass: 3	});

// ***** ACCESSORIES *****

items.push({id: 200,	name: "Wristbands",			slot: "item",		Gold: 0, 	flavor: "Standard uniform"	});
items.push({id: 201,	name: "Light lips item",	slot: "item",		Gold: 10,	deflips: 1, deffingers: 1	});
items.push({id: 202,	name: "Medium lips item",	slot: "item",		Gold: 20,	deflips: 2, deffingers: 2	});
items.push({id: 203,	name: "Heavy lips item",	slot: "item",		Gold: 30,	deflips: 3, deffingers: 3	});
items.push({id: 204,	name: "Light feet item",	slot: "item",		Gold: 10,	deffeet: 1, deffingers: 1 });
items.push({id: 205,	name: "Medium feet item",	slot: "item",		Gold: 20,	deffeet: 2, deffingers: 2	});
items.push({id: 206,	name: "Heavy feet item",	slot: "item",		Gold: 30,	deffeet: 3, deffingers: 3	});
items.push({id: 207,	name: "Light lips and feet item",	slot: "item",		Gold: 20,	deffeet: 1, deflips: 1, deffingers: 1	});
items.push({id: 208,	name: "Medium lips and feet item",	slot: "item",		Gold: 40,	deffeet: 2, deflips: 2, deffingers: 2	});
items.push({id: 209,	name: "Heavy lips and feet item",	slot: "item",		Gold: 60,	deffeet: 3, deflips: 3, deffingers: 3	});

// ***** HANDICAPS *****

items.push({id: 300,	name: "None",				slot: "flavor",		Gold: 0,	flavor: "Nothing equiped"		});
items.push({id: 301,	name: "Tramp stamp",		slot: "flavor",		Gold: 1, 	defass: -1, flavor: "It says 'Butt Slut'"		});
items.push({id: 302,	name: "Nasal hooks",		slot: "flavor",		Gold: 1,	deflips: -1		});
items.push({id: 303,	name: "Nipple clamps",		slot: "flavor",		Gold: 1,	deftits: -1		});
items.push({id: 304,	name: "Crotch tattoo female",slot: "flavor",		Gold: 1,	defsex: -1, flavor: "It says 'Cum Dump', female intended"	});
items.push({id: 305,	name: "Crotch tattoo male",	slot: "flavor",		Gold: 1,	defsex: -1, flavor: "It says 'Sissy', male intended"		});
items.push({id: 318,	name: "Vibrating underwear",slot: "flavor",		Gold: 2, 	defsex: -2, flavor: "Bzzz~"		});
items.push({id: 306,	name: "Leash, collar and bullet vibrator inside the pussy! (turned on)",	slot: "flavor",		Gold: 2,	deflips: -2, defass: -2, defsex: -2	}); //eran -1 todas
items.push({id: 307,	name: "Anal spreader",		slot: "flavor",		Gold: 2,	defass: -3		});
items.push({id: 308,	name: "Labial speculum",	slot: "flavor",		Gold: 2,	defsex: -2, flavor: "Female intended"		});
items.push({id: 309,	name: "Cock cage",			slot: "flavor",		Gold: 2,	defsex: -2, flavor: "Male intended"		});
items.push({id: 310,	name: "Spreader bar",		slot: "flavor",		Gold: 2,	defsex: -1, defass: -1		});
items.push({id: 317,	name: "Sounding rod",		slot: "flavor",		Gold: 3,	defsex: -3		});
items.push({id: 311,	name: "Blindfold",			slot: "flavor",		Gold: 3,	deflips: -1, deftits: -1, defsex: -1, defass: -1		});
items.push({id: 312,	name: "Bondage mittens",	slot: "flavor",		Gold: 3,	atkfingers: -3		});
items.push({id: 313,	name: "Ballet Slave-Heels",	slot: "flavor",		Gold: 3,	atkfeet: -3		});
items.push({id: 314,	name: "Breast rope-ties",	slot: "flavor",		Gold: 3,	deftits: -3		});
items.push({id: 315,	name: "Breast milker",		slot: "flavor",		Gold: 4,	atktits: -3, deftits: -3, flavor: "Intended for those that lactate"		});
items.push({id: 316,	name: "Cock milker",		slot: "flavor",		Gold: 4,	atksex: -3, defsex: -3, flavor: "Intended for males/shemales/herms"		});
items.push({id: 319,	name: "Crotchless panties",	slot: "flavor",		Gold: 10,	defsex: -3, defass: 3, flavor: "Don't touch my butt!"		});
items.push({id: 320,	name: "Buttless panties",	slot: "flavor",		Gold: 10,	defsex: 3, defass: -3, flavor: "Uhm... what are you looking at?"		});
items.push({id: 321,	name: "Sensitivity enhancing cream for feet or paws",	slot: "flavor",		Gold: 3,	deffeet: -3		});

//items.push({id: 319,	name: "Mecha horde mask",	slot: "flavor",		Gold: 4,	defsex: -1, deftits: -1, defass: -1, deflips: -1, atklips: 4, flavor: "Keeps user's mouth open but makes them more sensitive~"		});

// ***** ADDICTIONS ***** NO LONGER USED...
items.push({id: 400,	name: "Normal",			slot: "addiction",	Gold: 0,	flavor: "No preference"		});

// ***** CONSUMABLES *****
items.push({id: 500,	name: "Light Health Potion",	slot: "consumable",	Gold: 10,	hp: 20,				flavor: "Basic consumable item"		});
items.push({id: 501,	name: "Medium Health Potion",	slot: "consumable",	Gold: 30,	hp: 30,				flavor: "Medium consumable item"		});

items.push({id: 509,	name: "Pheromone spray",		slot: "consumable",	Gold: 25,	hp: -20, HP: -20,	flavor: "Deals 20 LP to your opponent and you"		});
items.push({id: 510,	name: "Lust orb",				slot: "consumable",	Gold: 50,	hp: -10, HP: -20,	flavor: "Deals 20 LP to your opponent but 10 LP to you"		});

//items.push({id: 550,	name: "Small finger buff",		slot: "consumable",	Gold: 30,	atkfingers: 10,		flavor: "The attack on fingers gets increased for 3 turns"		});

// ***** BONDAGE *****
items.push({id: 600,	name: "Mouth Bondage",			slot: "bondage",	Gold: 50, turns: 6,	atklips: -10,		flavor: "The attack on lips gets severely decreased for 3 turns"	});
items.push({id: 601,	name: "Mouth aphrodisiac",		slot: "bondage",	Gold: 50, turns: 6,	deflips: -10,		flavor: "The defense on lips gets severely decreased for 3 turns"	});
items.push({id: 602,	name: "Fingers Bondage",		slot: "bondage",	Gold: 50, turns: 6,	atkfingers: -10,	flavor: "The attack on fingers gets severely decreased for 3 turns"	});
items.push({id: 603,	name: "Tits Bondage",			slot: "bondage",	Gold: 50, turns: 6,	atktits: -10,		flavor: "The attack on tits gets severely decreased for 3 turns"	});
items.push({id: 604,	name: "Tits aphrodisiac",		slot: "bondage",	Gold: 50, turns: 6,	deftits: -10,		flavor: "The defense on tits gets severely decreased for 3 turns"	});
items.push({id: 605,	name: "Sex Bondage",			slot: "bondage",	Gold: 50, turns: 6,	atksex: -10,		flavor: "The attack on sex gets severely decreased for 3 turns"	});
items.push({id: 606,	name: "Sex aphrodisiac",		slot: "bondage",	Gold: 50, turns: 6,	defsex: -10,		flavor: "The defense on sex gets severely decreased for 3 turns"	});
items.push({id: 607,	name: "Ass Bondage",			slot: "bondage",	Gold: 50, turns: 6,	atkass: -10,		flavor: "The attack on ass gets severely decreased for 3 turns"	});
items.push({id: 608,	name: "Ass aphrodisiac",		slot: "bondage",	Gold: 50, turns: 6,	defass: -10,		flavor: "The defense on ass gets severely decreased for 3 turns"	});
items.push({id: 609,	name: "Feet Bondage",			slot: "bondage",	Gold: 50, turns: 6,	atkfeet: -10,		flavor: "The attack on feet gets severely decreased for 3 turns"	});
items.push({id: 610,	name: "Feet aphrodisiac",		slot: "bondage",	Gold: 50, turns: 6,	deffeet: -10,		flavor: "The defense on feet gets severely decreased for 3 turns"	});

// ** ENDGAME **

items.push({id: 700,	name: "Ultimate clothes",				slot: "armor",		Gold: 300,	deftits: 4, defsex: 4, defass: 4	});
items.push({id: 701,	name: "Ultimate hand sextoy",			slot: "weapon",		Gold: 100,	atkfingers: 4	});
items.push({id: 702,	name: "Ultimate feet sextoy",			slot: "weapon",		Gold: 100,	atkfeet: 4	});
items.push({id: 703,	name: "Ultimate chest sextoy",			slot: "weapon",		Gold: 100,	atktits: 4	});
items.push({id: 704,	name: "Ultimate lips sextoy",			slot: "weapon",		Gold: 100,	atklips: 4	});
items.push({id: 705,	name: "Ultimate sex sextoy",			slot: "weapon",		Gold: 100,	atksex: 4	});
items.push({id: 706,	name: "Ultimate ass sextoy",			slot: "weapon",		Gold: 100,	atkass: 4	});
items.push({id: 707,	name: "Ultimate lips and feet item",	slot: "item",		Gold: 300,	deffeet: 4, deflips: 4, deffingers: 4	});
items.push({id: 708,	name: "God tier clothes",				slot: "armor",		Gold: 1000,	deftits: 5, defsex: 5, defass: 5	});
items.push({id: 709,	name: "God tier lips and feet item",	slot: "item",		Gold: 1000,	deffeet: 5, deflips: 5, deffingers: 5	});
items.push({id: 799,	name: "OP hand sextoy",					slot: "weapon",		Gold: 9999,	atkfingers: 20	});
items.push({id: 798,	name: "ErotiClaire's weak ass and waitress uniform",			slot: "weapon",		Gold: 0,	defass: -10, deflips: -10, deftits: -10, defsex: -10, deffingers: -10, deffeet: -10, flavor: "Use me hard~! I'm definitely a waitress~"	});
items.push({id: 797,	name: "Adaria's nose and mouth hook",	slot: "weapon",		Gold: 0,	defass: -10, deflips: -20, deftits: -10, defsex: -10, flavor: "It also gives an addiction to ass of +10, please sit on her face~"	});

// ** CLASSES **
items.push({id: 801,	name: "Strawweight",	slot: "class",	Gold: -1,
			deflips: -2, deffingers: -2, deftits: -2, defsex: -2, defass: -2, deffeet:-2, atkfeet: 1, atkfingers: 1, HP: 20});

items.push({id: 802,	name: "Lightweight",	slot: "class",	Gold: -1,
			deflips: -1, deffingers: -1, deftits: -1, defsex: -1, defass: -1, deffeet:-1, atkfingers: 1, HP: 10});

items.push({id: 803,	name: "Middleweight",	slot: "class",	Gold: -1, stripchance: 10});

items.push({id: 804,	name: "Heavyweight",	slot: "class",	Gold: -1,
			deflips: 1, deffingers: 1, deftits: 1, defsex: 1, defass: 1, deffeet:1, atkass: 1, HP: -10});

items.push({id: 805,	name: "Super heavyweight",	slot: "class",	Gold: -1,
			deflips: 2, deffingers: 2, deftits: 2, defsex: 2, defass: 2, deffeet:2, atkass: 1, atktits: 1, HP: -20});


//***SPECIAL***
items.push({id: 900,	name: "OP hand sextoy meow meow",	slot: "weapon",		Gold: 0,	atkfingers: 20, atksex: 20, atktits: 20, atklips: 20	});
items.push({id: 901,	name: "[url=https://static.f-list.net/images/charimage/14401711.jpg]Waitress outfit[/url]",			slot: "armor",		Gold: 0,	defass: -10, deftits: -10, defsex: -10, flavor: "I'm now the official LSW waitress."	});
items.push({id: 902,	name: "Ballgag, couple of vibrators inside the pussy and nipple clamps",							slot: "weapon",		Gold: 0,	deflips: -10, deffingers: -10, deffeet: -10, flavor: "[b]Do you want a drink?[/b]"	});
items.push({id: 903,	name: "Drinks tray",																				slot: "item",		Gold: 0,	defass: -10, deftits: -10, defsex: -10, flavor: "With a couple of glasses and bottles of different kinds"	});
items.push({id: 904,	name: "Special collar and shibari harness",															slot: "flavor",		Gold: 0,	deflips: -10, deffingers: -10, deffeet: -10, flavor: "Text: [color=yellow][b]Kenia's waitress, the object of desire[/b][/color]"	});







module.exports = items;