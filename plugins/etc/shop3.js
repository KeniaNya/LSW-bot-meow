var items = [];

// HEAD, TOP, BOTTOM, FEET, HANDS

items.push({id: 0,	name: "Barelips",				slot: "lips",	price: 0,	flavor: "Exposed lips" });
items.push({id: 1,	name: "Defensive lips item",	slot: "lips",	price: 20,	deflips: 1, atklips: -1 });
items.push({id: 2,	name: "Offensive lips item",	slot: "lips",	price: 20,	deflips: -1, atklips: 1 });

items.push({id: 100,name: "Topless",				slot: "tits",	price: 0,	flavor: "Exposed chest"	});
items.push({id: 101,name: "Defensive tits item",	slot: "tits",	price: 20,	deftits: 1, atktits: -1 });
items.push({id: 102,name: "Offensive tits item",	slot: "tits",	price: 20,	deftits: -1, atktits: 1 });

items.push({id: 200,name: "Bare crotch",			slot: "sex",	price: 0,	flavor: "Exposed crotch"	});
items.push({id: 201,name: "Defensive sex item",		slot: "sex",	price: 20,	defsex: 1, atksex: -1 });
items.push({id: 202,name: "Offensive sex item",		slot: "sex",	price: 20,	defsex: -1, atksex: 1 });

items.push({id: 250,name: "Bare ass",				slot: "ass",	price: 0,	flavor: "Exposed ass"	});
items.push({id: 251,name: "Defensive ass item",		slot: "ass",	price: 20,	defass: 1, atkass: -1 });
items.push({id: 252,name: "Offensive ass item",		slot: "ass",	price: 20,	defass: -1, atkass: 1 });

items.push({id: 300,name: "Barefoot",				slot: "feet",	price: 0,	flavor: "Exposed feet"	});
items.push({id: 301,name: "Defensive feet item",	slot: "feet",	price: 20,	deffeet: 1, atkfeet: -1 });
items.push({id: 302,name: "Offensive feet item",	slot: "feet",	price: 20,	deffeet: -1, atkfeet: 1 });

items.push({id: 400,name: "Hands",					slot: "fingers",	price: 0,	flavor: "Empty hands"	});
items.push({id: 401,name: "Defensive fingers item",	slot: "fingers",	price: 20,	deffingers: 1, atkfingers: -1 });
items.push({id: 402,name: "Offensive fingers item",	slot: "fingers",	price: 20,	deffingers: -1, atkfingers: 1 });


// ***** HANDICAPS *****

items.push({id: 500,	name: "None",				slot: "other",		price: 0,	flavor: "Nothing equiped"		});
items.push({id: 501,	name: "Tramp stamp",		slot: "other",		price: 1, 	defass: -1, flavor: "It says 'Butt Slut'"		});
items.push({id: 502,	name: "Nasal hooks",		slot: "other",		price: 1,	deflips: -1		});
items.push({id: 503,	name: "Nipple clamps",		slot: "other",		price: 1,	deftits: -1		});
items.push({id: 504,	name: "Crotch tattoo female",slot: "other",		price: 1,	defsex: -1, flavor: "It says 'Cum Dump', female intended"	});
items.push({id: 505,	name: "Crotch tattoo male",	slot: "other",		price: 1,	defsex: -1, flavor: "It says 'Sissy', male intended"		});
items.push({id: 518,	name: "Vibrating underwear",slot: "other",		price: 2, 	defsex: -2, flavor: "Bzzz~"		});
items.push({id: 506,	name: "Leash, collar and bullet vibrator inside the pussy! (turned on)",	slot: "other",		price: 2,	deflips: -2, defass: -2, defsex: -2	}); //eran -1 todas
items.push({id: 507,	name: "Anal spreader",		slot: "other",		price: 2,	defass: -3		});
items.push({id: 508,	name: "Labial speculum",	slot: "other",		price: 2,	defsex: -2, flavor: "Female intended"		});
items.push({id: 509,	name: "Cock cage",			slot: "other",		price: 2,	defsex: -2, flavor: "Male intended"		});
items.push({id: 510,	name: "Spreader bar",		slot: "other",		price: 2,	defsex: -1, defass: -1		});
items.push({id: 517,	name: "Sounding rod",		slot: "other",		price: 3,	defsex: -3		});
items.push({id: 511,	name: "Blindfold",			slot: "other",		price: 3,	deflips: -1, deftits: -1, defsex: -1, defass: -1		});
items.push({id: 512,	name: "Bondage mittens",	slot: "other",		price: 3,	atkfingers: -3		});
items.push({id: 513,	name: "Ballet Slave-Heels",	slot: "other",		price: 3,	atkfeet: -3		});
items.push({id: 514,	name: "Breast rope-ties",	slot: "other",		price: 3,	deftits: -3		});
items.push({id: 515,	name: "Breast milker",		slot: "other",		price: 4,	atktits: -3, deftits: -3, flavor: "Intended for those that lactate"		});
items.push({id: 516,	name: "Cock milker",		slot: "other",		price: 4,	atksex: -3, defsex: -3, flavor: "Intended for males/shemales/herms"		});
items.push({id: 519,	name: "Crotchless panties",	slot: "other",		price: 10,	defsex: -3, defass: 3, flavor: "Don't touch my butt!"		});
items.push({id: 520,	name: "Buttless panties",	slot: "other",		price: 10,	defsex: 3, defass: -3, flavor: "Uhm... what are you looking at?"		});
items.push({id: 521,	name: "Sensitivity enhancing cream for feet or paws",	slot: "other",		price: 3,	deffeet: -3		});
items.push({id: 522,	name: "Huge sensitive cock",	slot: "other",		price: 3,	atksex: 3, defsex: -3		});
items.push({id: 523,	name: "Tarah's slutty ass",	slot: "other",		price: 5,	defass: -10		});

// ** CLASSES **
items.push({id: 801,	name: "Strawweight",	slot: "class",	price: -1,
			deflips: -2, deffingers: -2, deftits: -2, defsex: -2, defass: -2, deffeet:-2, speed: 30});

items.push({id: 802,	name: "Lightweight",	slot: "class",	price: -1,
			deflips: -1, deffingers: -1, deftits: -1, defsex: -1, defass: -1, deffeet:-1, speed: 15});

items.push({id: 803,	name: "Middleweight",	slot: "class",	price: -1, speed: 0});

items.push({id: 804,	name: "Heavyweight",	slot: "class",	price: -1,
			deflips: 1, deffingers: 1, deftits: 1, defsex: 1, defass: 1, deffeet:1, HP: 15});

items.push({id: 805,	name: "Super heavyweight",	slot: "class",	price: -1,
			deflips: 2, deffingers: 2, deftits: 2, defsex: 2, defass: 2, deffeet:2, HP: 30});



module.exports = items;