/*
Welcome to the shop!

Items from 0   to  99 - Outfits
Items from 100 to 199 - Sextoys
Items from 200 to 299 - Accessories

*/

var items = [];

// ***** OUTFITS *****

items.push({id: 0,	name: "Nude",						slot: "armor",		Gold: 0, 	flavor: "Just you and your body" });
items.push({id: 14,	name: "Skirt",						slot: "armor",		Gold: 0, 	flavor: "If you don't want to enter the ring nude. Intended for females" });
items.push({id: 15,	name: "Tank top",					slot: "armor",		Gold: 0, 	flavor: "If you don't want to enter the ring nude. Intended for males" });
items.push({id: 5,	name: "Boxers",						slot: "armor",		Gold: 10,	defsex: 1, defass: 1	});
items.push({id: 1,	name: "Crotchless lingerie",		slot: "armor",		Gold: 10,	deftits: 1, defass: 1	});
items.push({id: 12,	name: "Behindless lingerie",		slot: "armor",		Gold: 10,	deftits: 1, defsex: 1	});
items.push({id: 6,	name: "Unisex thong",				slot: "armor",		Gold: 10,	defsex: 1, defass: 1	});
items.push({id: 10,	name: "Bondage suit",				slot: "armor",		Gold: 10,	deftits: -1, defsex: -1, defass: -1, atkfingers: 2, atkfeet: 2, atklips: 1	});
items.push({id: 13,	name: "Shibari harness",			slot: "armor",		Gold: 10,	deftits: -1, defsex: -1, defass: -1	});
items.push({id: 8,	name: "Leotard",					slot: "armor",		Gold: 15,	deftits: 1, defsex: 1, defass: 1 	});
items.push({id: 11,	name: "Yoga outfit",				slot: "armor",		Gold: 15,	deftits: 1, defsex: 1, defass: 1 	});
items.push({id: 17,	name: "School uniform",				slot: "armor",		Gold: 15,	deftits: 1, defsex: 1, defass: 1 	});
items.push({id: 2,	name: "Small bikini",				slot: "armor",		Gold: 20,	deftits: 1, defsex: 2, defass: 1	});
items.push({id: 3,	name: "Thin spandex unitard",		slot: "armor",		Gold: 20,	defsex: 2, defass: 2	});
items.push({id: 7,	name: "Spats",						slot: "armor",		Gold: 20,	defsex: 2, defass: 2	});
items.push({id: 4,	name: "Mistress suit",				slot: "armor",		Gold: 30,	deftits: 2, defsex: 2, defass: 2 	});
items.push({id: 9,	name: "Luchador mask and speedos",	slot: "armor",		Gold: 30,	deflips: 2, defsex: 2, defass: 2 	});
items.push({id: 16,	name: "Full-body bondage suit",		slot: "armor",		Gold: 40,	deflips: -3, deftits: -3, defsex: -3, defass: -3, atkfingers: -3, atklips: -3, atktits: -3, atksex: -3, atkass: -3, atkfeet: -3	});


// ***** SEXTOYS *****

items.push({id: 100,	name: "Hand",			slot: "weapon",		Gold: 0,	flavor: "Starter weapon"	});
items.push({id: 106,	name: "Tennis shoes",	slot: "weapon",		Gold: 10,	atkfeet: 1	});
items.push({id: 101,	name: "Egg vibrator",	slot: "weapon",		Gold: 10,	atkfingers: 1	});
items.push({id: 107,	name: "Socks",			slot: "weapon",		Gold: 10,	atkfeet: 1	});
items.push({id: 102,	name: "Strap-on",		slot: "weapon",		Gold: 20,	atksex: 2	});
items.push({id: 105,	name: "Cock ring",		slot: "weapon",		Gold: 20,	atksex: 2	});
items.push({id: 103,	name: "Dildo",			slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 104,	name: "Long stockings",	slot: "weapon",		Gold: 40,	atkfeet: 4	});

// ***** ACCESSORIES *****

items.push({id: 200,	name: "Wristbands",			slot: "item",		Gold: 0, 	flavor: "Standard uniform"	});
items.push({id: 201,	name: "Ring gag",			slot: "item",		Gold: 10, 	atklips: 2, deflips: -1		});
items.push({id: 204,	name: "Fresh mints",		slot: "item",		Gold: 10,	atklips: 1		});
items.push({id: 206,	name: "Ankle jewelry",		slot: "item",		Gold: 10,	atkfeet: 1		});
items.push({id: 202,	name: "Nipple piercing",	slot: "item",		Gold: 10,	atktits: 2, deftits: -1		});
items.push({id: 208,	name: "Tongue piercing",	slot: "item",		Gold: 10,	atklips: 2, deflips: -1		});
items.push({id: 205,	name: "Cock piercing",		slot: "item",		Gold: 20,	atksex: 3, defsex: -1		});
items.push({id: 203,	name: "Clit piercing",		slot: "item",		Gold: 20,	atksex: 3, defsex: -1		});
items.push({id: 207,	name: "Butt lubricant",		slot: "item",		Gold: 20,	atkass: 3, defass: -1		});

// ***** HANDICAPS *****

items.push({id: 300,	name: "None",				slot: "flavor",		Gold: 0,	flavor: "Nothing equiped"		});
items.push({id: 301,	name: "Tramp stamp",		slot: "flavor",		Gold: 1, 	defass: -1, flavor: "It says 'Butt Slut'"		});
items.push({id: 302,	name: "Nasal hooks",		slot: "flavor",		Gold: 1,	deflips: -1		});
items.push({id: 303,	name: "Nipple clamps",		slot: "flavor",		Gold: 1,	deftits: -1		});
items.push({id: 304,	name: "Crotch tatoo female",slot: "flavor",		Gold: 1,	defsex: -1, flavor: "It says 'Cum Dump', female intended"	});
items.push({id: 305,	name: "Crotch tatoo male",	slot: "flavor",		Gold: 1,	defsex: -1, flavor: "It says 'Sissy', male intended"		});
items.push({id: 306,	name: "Leash and collar",	slot: "flavor",		Gold: 2,	deflips: -1, defass: -1, defsex: -1,	});
items.push({id: 307,	name: "Anal spreader",		slot: "flavor",		Gold: 2,	defass: -2		});
items.push({id: 308,	name: "Labial speculum",	slot: "flavor",		Gold: 2,	defsex: -2, flavor: "Female intended"		});
items.push({id: 309,	name: "Cock cage",			slot: "flavor",		Gold: 2,	defsex: -2, flavor: "Male intended"		});
items.push({id: 310,	name: "Spreader bar",		slot: "flavor",		Gold: 2,	defsex: -1, defass: -1		});
items.push({id: 317,	name: "Sounding rod",		slot: "flavor",		Gold: 3,	defsex: -3		});//sounding rod
items.push({id: 311,	name: "Blindfold",			slot: "flavor",		Gold: 3,	deflips: -1, deftits: -1, defsex: -1, defass: -1		});
items.push({id: 312,	name: "Bondage mittens",	slot: "flavor",		Gold: 3,	atkfingers: -3		});
items.push({id: 313,	name: "Ballet Slave-Heels",	slot: "flavor",		Gold: 3,	atkfeet: -3		});
items.push({id: 314,	name: "Breast rope-ties",	slot: "flavor",		Gold: 3,	deftits: -3		});
items.push({id: 315,	name: "Breast milker",		slot: "flavor",		Gold: 4,	atktits: -3, deftits: -3, flavor: "Intended for those that lactate"		});
items.push({id: 316,	name: "Cock milker",		slot: "flavor",		Gold: 4,	atksex: -3, defsex: -3, flavor: "Intended for males/shemales/herms"		});


module.exports = items;

/*
IDEAS
items.push({id: 5,	name: "Boxers",						slot: "armor",		Gold: 10,	stats: {defsex: 1, defass: 1}	}); asi ya no hay que recortar el objeto por la mitad XD
*/