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
items.push({id: 5,	name: "Boxers",						slot: "armor",		Gold: 10,	defsex: 1, defass: 1, atksex: -1	});
items.push({id: 29,	name: "Male swimsuit",				slot: "armor",		Gold: 10,	defsex: 1, defass: 1, atksex: -1	});
items.push({id: 1,	name: "Crotchless lingerie",		slot: "armor",		Gold: 10,	deftits: 1, defass: 1, atkass: -1	});
items.push({id: 12,	name: "Behindless lingerie",		slot: "armor",		Gold: 10,	deftits: 1, defsex: 1, atksex: -1	});
items.push({id: 6,	name: "Unisex thong",				slot: "armor",		Gold: 10,	defsex: 1, defass: 1, atksex: -1	});
items.push({id: 10,	name: "Bondage suit",				slot: "armor",		Gold: 10,	deftits: -1, defsex: -2, defass: -2, atkfingers: 2, atkfeet: 2, atklips: 1	});
items.push({id: 13,	name: "Shibari harness",			slot: "armor",		Gold: 10,	deftits: -1, defsex: -1, defass: -1	});
items.push({id: 18, name: "Barbarian outfit with animal head helmet", slot: "armor", Gold: 10, atkfingers: 1, atksex: 1, atktits: 1, deftits: -1, defsex: -1});
items.push({id: 22,	name: "Oversized shirt and panties",slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atktits: -1 	});
items.push({id: 23,	name: "Wrestling singlet",			slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atksex: -1 	});
items.push({id: 24,	name: "Sun dress",					slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atktits: -1 	});
items.push({id: 26,	name: "Lace bra and panties",		slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atkass: -1 	});
items.push({id: 8,	name: "Leotard",					slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atksex: -1 	});
items.push({id: 11,	name: "Yoga outfit",				slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atksex: -1 	});
items.push({id: 17,	name: "School uniform",				slot: "armor",		Gold: 20,	deftits: 1, defsex: 1, defass: 1, atktits: -1 	});
items.push({id: 2,	name: "Small bikini",				slot: "armor",		Gold: 20,	deftits: 1, defsex: 2, defass: 1, atksex: -1, atkass: -1	});
items.push({id: 3,	name: "Thin spandex unitard",		slot: "armor",		Gold: 20,	defsex: 2, defass: 2, atksex: -1, atkass: -1	});
items.push({id: 7,	name: "Spats",						slot: "armor",		Gold: 20,	defsex: 2, defass: 2, atksex: -1, atkass: -1	});
items.push({id: 32,	name: "Stripper outfit",			slot: "armor",		Gold: 20,	deflips: -1, deftits: -1, defsex: -1, defass: -1, atklips: 1, atkfingers: 1, atktits: 1, atksex: 1, atkfeet: 1, atkass: 1 	});
items.push({id: 31,	name: "Formal business suit",		slot: "armor",		Gold: 30,	deftits: 1, defsex: 1, defass: 1 	});
items.push({id: 25,	name: "Leather pants and jacket",	slot: "armor",		Gold: 30,	deftits: 2, defsex: 2, defass: 2, atktits: -1, atksex: -1, atkass: -1 	});
items.push({id: 19,	name: "Bunny outfit",				slot: "armor",		Gold: 30,	deftits: 1, defsex: 1, defass: 3, atkass: -2 	 	});
items.push({id: 20,	name: "Cat outfit",					slot: "armor",		Gold: 30,	deftits: 1, defsex: 3, defass: 1, atksex: -2 	 	});
items.push({id: 27,	name: "Maid uniform",				slot: "armor",		Gold: 30,	deftits: 3, defsex: 1, defass: 1, atktits: -2 	 	});
items.push({id: 4,	name: "Mistress suit",				slot: "armor",		Gold: 30,	deftits: 2, defsex: 2, defass: 2, atktits: -1, atksex: -1, atkass: -1 	 	});
items.push({id: 34,	name: "Hentai Wrestling Gear",		slot: "armor",		Gold: 30,	deftits: 2, defsex: 2, defass: 2, atktits: -1, atksex: -1, atkass: -1 	 	});
items.push({id: 9,	name: "Luchador mask and speedos",	slot: "armor",		Gold: 30,	deflips: 2, defsex: 2, defass: 2, atklips: -1, atksex: -1, atkass: -1 	 	});
items.push({id: 30,	name: "Traditional gown",			slot: "armor",		Gold: 30,	deftits: 3, defsex: 3, defass: 3, atktits: -2, atksex: -2, atkass: -2 	 	});
items.push({id: 21,	name: "Slutty Cosplay",				slot: "armor",		Gold: 30,	deflips: -3, deftits: -4, defsex: -4, defass: -4, atkfingers: 3, atklips: 3, atktits: 3, atksex: 3, atkass: 3, atkfeet: 3	});
items.push({id: 36,	name: "Nurse outfit",				slot: "armor",		Gold: 30,	deflips: -3, deftits: -4, defsex: -4, defass: -4, atkfingers: 3, atklips: 3, atktits: 3, atksex: 3, atkass: 3, atkfeet: 3	});
items.push({id: 28,	name: "Succubus outfit",			slot: "armor",		Gold: 30,	deflips: -3, deftits: 2, defsex: 2, defass: -3, atktits: -2, atksex: -2, atkass: 3, atkfeet: 3, atklips: 3	});
items.push({id: 38,	name: "Incubus outfit",				slot: "armor",		Gold: 30,	deflips: -3, deftits: 2, defsex: 2, defass: -3, atktits: -2, atksex: -2, atkass: 3, atkfeet: 3, atklips: 3	});
items.push({id: 33,	name: "Ring girl costume",			slot: "armor",		Gold: 30,	deflips: -2, deftits: -2, defsex: -2, atktits: 3, atklips: 3, atkass: 3		});
items.push({id: 16,	name: "Full-body bondage suit",		slot: "armor",		Gold: 40,	deflips: -3, deftits: -3, defsex: -3, defass: -3, atkfingers: -3, atklips: -3, atktits: -3, atksex: -3, atkass: -3, atkfeet: -3	});
items.push({id: 35,	name: "Roper",						slot: "armor",		Gold: 70,	atkfingers: 5, atklips: 5, atksex: 5, defsex: -2, defass: -2, deflips: -2, deftits: -2, flavor: "[url=http://mgewiki.com/w/Roper]I'm a monstergirl now![/url]"	});
items.push({id: 37,	name: "Yakumo Gown",				slot: "armor",		Gold: 80,	atkass: -2, atktits: -2, atkfeet: -2, atkfingers: -2, atklips: -2, atksex: -2, defsex: 5, defass: 5, deflips: 5, deftits: 5});
items.push({id: 39,	name: "Spartan speedo and cape",	slot: "armor",		Gold: 80,	atkass: -2, atktits: -2, atkfeet: -2, atkfingers: -2, atklips: -2, atksex: -2, defsex: 5, defass: 5, deflips: 5, deftits: 5});



// ***** SEXTOYS *****

items.push({id: 100,	name: "Hand",			slot: "weapon",		Gold: 0,	flavor: "Starter weapon"	});
items.push({id: 121,	name: "Tube float",		slot: "weapon",		Gold: 0,	flavor: "For pool parties"	});
items.push({id: 114,	name: "Glittery Pom-Poms",			slot: "weapon",		Gold: 0,	flavor: "The deadliest weapon in a cheerleader's arsenal; used for both distraction and cheerleading"	});
items.push({id: 106,	name: "Tennis shoes",	slot: "weapon",		Gold: 10,	atkfeet: 1	});
items.push({id: 101,	name: "Egg vibrator",	slot: "weapon",		Gold: 10,	atkfingers: 1	});
items.push({id: 107,	name: "Socks",			slot: "weapon",		Gold: 10,	atkfeet: 1	});
items.push({id: 113,	name: "Whip",			slot: "weapon",		Gold: 10,	atkfingers: 1	});
items.push({id: 120,	name: "Butt plug",			slot: "weapon",		Gold: 10,	defass: 1	});
items.push({id: 108,	name: "Double-ended dildo", slot: "weapon", Gold: 10,	atkass: 3, defass: -2 });
items.push({id: 125,	name: "Twisty Nipple Boosters",		slot: "weapon",		Gold: 10,	atkfingers: 1, flavor: "Takes time to get them attached and suctioning away. Boy do these things suck!"	});
items.push({id: 116,	name: "Slutty lingerie",slot: "weapon",		Gold: 20,	atksex: 1, atkass: 3, defsex: -1, defass: -1	});
items.push({id: 102,	name: "Strap-on",		slot: "weapon",		Gold: 20,	atksex: 2	});
items.push({id: 105,	name: "Cock ring",		slot: "weapon",		Gold: 20,	atksex: 2	});
items.push({id: 112,	name: "Feather gloves",	slot: "weapon",		Gold: 20,	atkfingers: 2	});
items.push({id: 115,	name: "Boxing gloves",	slot: "weapon",		Gold: 20,	atkfingers: 2	});
items.push({id: 103,	name: "Dildo",			slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 122,	name: "Onahole",		slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 123,	name: "Horse dildo",	slot: "weapon",		Gold: 30,	atksex: 3	});
items.push({id: 109,	name: "Crop/Paddle",	slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 110,	name: "Anal beads",		slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 111,	name: "Aphrodisiac coconut scent",		slot: "weapon",		Gold: 30,	atktits: 3	});
items.push({id: 104,	name: "Long stockings",	slot: "weapon",		Gold: 30,	atkfeet: 3	});
items.push({id: 117,	name: "Massage oil",	slot: "weapon",		Gold: 30,	atkfingers: 3	});
items.push({id: 118,	name: "Cute choker",	slot: "weapon",		Gold: 30,	atklips: 3	});
items.push({id: 119,	name: "Garter",			slot: "weapon",		Gold: 30,	atkass: 3	});
items.push({id: 124,	name: "Demon-cursed stockings and heels",	slot: "weapon",		Gold: 40,	deftits: -2, defass: -2, defsex: -2, atkfeet: 5, atksex: 4	});



// ***** ACCESSORIES *****

items.push({id: 200,	name: "Wristbands",					slot: "item",		Gold: 0, 	flavor: "Standard uniform"	});
items.push({id: 220,	name: "Swimming cap",				slot: "item",		Gold: 0, 	flavor: "To protect the ears from water"	});
items.push({id: 211,	name: "Headband",					slot: "item",		Gold: 10, 	atkfingers: 1	});
items.push({id: 210,	name: "Bowtie",						slot: "item",		Gold: 10, 	atklips: 1		});
items.push({id: 201,	name: "Ring gag",					slot: "item",		Gold: 10, 	atklips: 2, deflips: -1		});
items.push({id: 204,	name: "Fresh mints",				slot: "item",		Gold: 10,	atklips: 1		});
items.push({id: 206,	name: "Ankle jewelry",				slot: "item",		Gold: 10,	atkfeet: 1		});
items.push({id: 202,	name: "Nipple piercing",			slot: "item",		Gold: 10,	atktits: 2, deftits: -1		});
items.push({id: 208,	name: "Tongue piercing",			slot: "item",		Gold: 10,	atklips: 2, deflips: -1		});
items.push({id: 214,	name: "Cheap prostitute perfume",	slot: "item",		Gold: 10,	atktits: 2, defsex: -1		});
items.push({id: 225,	name: "Expensive pedicure",			slot: "item",		Gold: 20,	atkfeet: 2	});
items.push({id: 226,	name: "White bunny bobtail",		slot: "item",		Gold: 20,	defsex: -2, atkass: 4		});
items.push({id: 227,	name: "Concubine's anklet",			slot: "item",		Gold: 20,	atkfeet: 4, defsex: -2		});
items.push({id: 228,	name: "Womb brand",					slot: "item",		Gold: 20,	defsex: -3, defass: -1, atksex: 3, atktits: 3		});
items.push({id: 209,	name: "Pack of condoms",			slot: "item",		Gold: 20,	defsex: 1, defass: 1		});
items.push({id: 205,	name: "Cock piercing",				slot: "item",		Gold: 20,	atksex: 3, defsex: -1		});
items.push({id: 203,	name: "Clit piercing",				slot: "item",		Gold: 20,	atksex: 3, defsex: -1		});
items.push({id: 207,	name: "Butt lubricant",				slot: "item",		Gold: 20,	atkass: 3, defass: -1		});
items.push({id: 212,	name: "Aphrodisiac laced lipstick",	slot: "item",		Gold: 20,	atklips: 3, deflips: -1		});
items.push({id: 213,	name: "Nipple pasties",				slot: "item",		Gold: 20,	atktits: 3, deftits: -1		});
items.push({id: 216,	name: "Love balm",					slot: "item",		Gold: 20,	atkfingers: 3, defsex: -1		});
items.push({id: 215,	name: "Succubus' tail ribbon",		slot: "item",		Gold: 20,	atkass: 4, defass: -2, flavor: "Only for succubi"	});
items.push({id: 224,	name: "Spellcards",					slot: "item",		Gold: 20,	atkass: 4, defass: -2, flavor: "For magic users"	});
items.push({id: 223,	name: "Bridal Gauntlet",			slot: "item",		Gold: 20,	atkfingers: 4, deftits: -2, flavor: "[url=https://gelbooru.com/index.php?page=post&s=view&id=4233166]Image reference[/url]"	});
items.push({id: 217,	name: "Viagra",						slot: "item",		Gold: 20,	defsex: 1, atksex: 1		});
items.push({id: 218,	name: "The Pill",					slot: "item",		Gold: 20,	defsex: 1, atksex: 1		});
items.push({id: 219,	name: "Symbol of purity",			slot: "item",		Gold: 20,	deflips: 2, deftits: 2, defsex: 2, defass: 2, atklips: -1, atkfingers: -1, atktits: -1, atksex: -1, atkass: -1, atkfeet: -1		});
items.push({id: 229,	name: "Symbol of perversion",		slot: "item",		Gold: 20,	deflips: -1, deftits: -1, defsex: -1, defass: -1, atklips: 1, atkfingers: 1, atktits: 1, atksex: 1, atkass: 1, atkfeet: 1		});
items.push({id: 230,	name: "School backpack",			slot: "item",		Gold: 20,	atklips: 1, atktits: -2, atksex: 2, atkass: 1	});
items.push({id: 221,	name: "Outercourse for dummies",	slot: "item",		Gold: 30,	atkfingers: 1, atktits: 1, atkfeet: 1		});
items.push({id: 222,	name: "Intercourse for dummies",	slot: "item",		Gold: 30,	atklips: 1, atksex: 1, atkass: 1		});


// ***** HANDICAPS *****

items.push({id: 300,	name: "None",				slot: "flavor",		Gold: 0,	flavor: "Nothing equiped"		});
items.push({id: 301,	name: "Tramp stamp",		slot: "flavor",		Gold: 1, 	defass: -1, flavor: "It says 'Butt Slut'"		});
items.push({id: 302,	name: "Nasal hooks",		slot: "flavor",		Gold: 1,	deflips: -1		});
items.push({id: 303,	name: "Nipple clamps",		slot: "flavor",		Gold: 1,	deftits: -1		});
items.push({id: 304,	name: "Crotch tattoo female",slot: "flavor",		Gold: 1,	defsex: -1, flavor: "It says 'Cum Dump', female intended"	});
items.push({id: 305,	name: "Crotch tattoo male",	slot: "flavor",		Gold: 1,	defsex: -1, flavor: "It says 'Sissy', male intended"		});
items.push({id: 318,	name: "Vibrating underwear",slot: "flavor",		Gold: 2, 	defsex: -2, flavor: "Bzzz~"		});
items.push({id: 306,	name: "Leash and collar",	slot: "flavor",		Gold: 2,	deflips: -1, defass: -1, defsex: -1	});
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
items.push({id: 319,	name: "Mecha horde mask",	slot: "flavor",		Gold: 4,	defsex: -1, deftits: -1, defass: -1, deflips: -1, atklips: 4, flavor: "Keeps user's mouth open but makes them more sensitive~"		});

// ***** ADDICTIONS *****
items.push({id: 400,	name: "Normal",			slot: "addiction",	Gold: 0,	flavor: "No preference"		});
items.push({id: 401,	name: "Tit addict",		slot: "addiction",	Gold: 0,	addtits: 1, addsex: -1, flavor: "Recieve more pleasure from tit attacks and not so much from sex" });
items.push({id: 402,	name: "Sex addict",		slot: "addiction",	Gold: 0,	addsex: 1, addfingers: -1, flavor: "Recieve more pleasure from sex attacks and not so much from fingers" });
items.push({id: 403,	name: "Finger addict",	slot: "addiction",	Gold: 0,	addfingers: 1, addlips: -1, flavor: "Recieve more pleasure from finger attacks and not so much from lips" });
items.push({id: 404,	name: "Kiss addict",	slot: "addiction",	Gold: 0,	addlips: 1, addfeet: -1, flavor: "Recieve more pleasure from lip attacks and not so much from feet" });
items.push({id: 405,	name: "Foot addict",	slot: "addiction",	Gold: 0,	addfeet: 1, addtits: -1, flavor: "Recieve more pleasure from foot attacks and not so much from tits" });
items.push({id: 406,	name: "Tit addict 2",	slot: "addiction",	Gold: 0,	addtits: 1, addass: -1, flavor: "Recieve more pleasure from tit attacks and not so much from ass" });
items.push({id: 407,	name: "Ass addict",		slot: "addiction",	Gold: 0,	addass: 1, addsex: -1, flavor: "Recieve more pleasure from ass attacks and not so much from sex" });
items.push({id: 409,	name: "Ass addict 2",	slot: "addiction",	Gold: 0,	addass: 1, addfeet: -1, flavor: "Recieve more pleasure from ass attacks and not so much from feet" });
items.push({id: 408,	name: "Outercourse addict",		slot: "addiction",	Gold: 0,	addfingers: 1, addsex: -1, flavor: "Recieve more pleasure from finger/hands attacks and not so much from sex" });

items.push({id: 450,	name: "Loser-slut addict",		slot: "addiction",	Gold: 0,	addsex: 3, addfingers: 3, addtits: 3, addlips: 3, addfeet: 3, addass: 3, flavor: "The ultimate addiction~ You recieve more pleasure from every source~ Only for loser-sluts~" });

// ***** CUSTOM ITEMS *****
items.push({id: 900,	name: "Shell",							slot: "armor",		Gold: 999, 	flavor: "My shell is my body!" });
items.push({id: 901,	name: "Kenia's Villainess Outfit",		slot: "armor",		Gold: 999,	deftits: 3, defsex: 3, defass: 3, deflips: 3 	});
items.push({id: 902,	name: "Kenia's Sexy Fingerless Gloves",	slot: "weapon",		Gold: 999,	atkfingers: 3 	});
items.push({id: 903,	name: "Kenia's Secret Scent",			slot: "item",		Gold: 999,	atktits: 3, atksex: 3 	});
items.push({id: 904,	name: "Kenia's Villainess Mask",		slot: "flavor",		Gold: 999,	atklips: 3 	});
items.push({id: 905,	name: "Dual XXXL Pink n' Green Wrestling Outfits with tailhole", slot: "armor", Gold: 999, deftits: 3, defsex: 3, defass: 3, atktits: -3, atksex: -3, atkass: 3, flavor: "…Think you can handle Double-Duty?" });
items.push({id: 906,	name: "Susie's sexy bikini",			slot: "armor",		Gold: 999,	deftits: -1, defsex: -1, defass: -1, atktits: 3, atksex: 3, atkass: 3	});
items.push({id: 907,	name: "Homerun's Pulsing Feeldoe",		slot: "weapon",		Gold: 999,	defass: -3, atksex: 3, flavor: "Strike 1, Strike 2, Strike 3, You're out!" });
items.push({id: 908,	name: "Experienced and Naked",			slot: "armor",		Gold: 999, 	atksex: 4, atkfingers: 3, defass: -2, defsex: -1, deftits: 1, deflips: 1, flavor: "Zeke's been sexfighting for a long time, and his experience shows in his bold nudity!" });
items.push({id: 909,	name: "'Iralith's wrath' bodysuit",		slot: "armor",		Gold: 999,	atklips: -2, atktits: 3, deftits: 2, atksex: -1, defsex: 2, atkass: 1, defass: 1, flavor: "[url=https://static.f-list.net/images/charimage/9812490.jpg]Feel my wrath~![/url]"	});
items.push({id: 910,	name: "Eve's Domme Leathers",			slot: "armor",		Gold: 999,	atkfingers: 1, atktits: -3, atksex: 1, defsex: 2, atkass: -3, deflips: 1, deftits: 2, defsex: 4, defass: 3, flavor: "Just the name is fine~"	});
items.push({id: 911,	name: "Kenia's Roper",					slot: "armor",		Gold: 999,	atkfingers: 5, atklips: 5, atksex: 5, defsex: 5, defass: 5, deflips: 5, deftits: 5, flavor: "[url=http://mgewiki.com/w/Roper]I'm a monstergirl now![/url]"	});
items.push({id: 912,	name: "Iralith's Tendrils",				slot: "armor",		Gold: 999,	defass: 2, defsex: 2, deftits: 1, atkfingers: 3, atklips: 2, atkfeet: -3, flavor: "[url=https://static.f-list.net/images/charimage/10715348.jpg]This[/url] or [url=https://static.f-list.net/images/charimage/10715358.png]this[/url] or [url=https://static.f-list.net/images/charimage/10715352.png]this[/url]"	});
items.push({id: 913,	name: "Feral Naya Form",				slot: "armor",		Gold: 70,	atkfingers: 5, atklips: 5, atksex: 5, defsex: -2, defass: -2, deflips: -2, deftits: -2 	 	});
items.push({id: 914,	name: "[url=https://static.f-list.net/images/charimage/10803955.jpg]Xyo's bitchsuit[/url]",					slot: "armor",		Gold: 0,	deflips: -4, deftits: -4, defsex: -4, defass: -4, atkfingers: -3, atklips: -3, atktits: -3, atksex: -3, atkass: -3, atkfeet: -3 	 	});
items.push({id: 915,	name: "Xyo's custom Leash and collar",	slot: "flavor",		Gold: 0,	deflips: -3, defass: -3, defsex: -3, deftits: -3	});
items.push({id: 916,	name: "Knotted tail rings",				slot: "item",		Gold: 20,	atkass: 4, defass: -2, flavor: "Only for cats"	});
items.push({id: 917,	name: "Fae Aspect",						slot: "armor",		Gold: 999,	atktits: 5, atkass: 5, atksex: 5, defsex: -2, defass: -2, deflips: -2, deftits: -2, flavor: "True [url=https://static.f-list.net/images/charimage/10902074.jpg]form[/url] revealed"	});
items.push({id: 918,	name: "[url=https://s22.postimg.cc/dfi1y657l/natasha_comm002_by_xdtopsu01-dccldgf.jpg]Lyanna's Black Rose Gear[/url]",		slot: "armor",		Gold: 999,	deftits: 2, defsex: 2, defass: 1, atkass: 1, atktits: 2, atksex: -2, atkfingers: 2, atkfeet: 2, flavor: "Ordered hand tailored by Lyanna, only the finest leather, silks, and velvet went into crafting this work of fine art"	});
items.push({id: 919,	name: "Just her own dick",				slot: "weapon",		Gold: 999,	atksex: 3	});
items.push({id: 920,	name: "Kenia's bitchsuit",					slot: "armor",		Gold: 0,	deflips: -4, deftits: -4, defsex: -4, defass: -4, atkfingers: -3, atklips: -3, atktits: -3, atksex: -3, atkass: -3, atkfeet: -3, flavor: "[url=https://i.pinimg.com/474x/e4/54/7c/e4547ce31b565e85a8ef852f669556fd.jpg]Appearance[/url]" 	 	});
items.push({id: 921,	name: "Kenia's custom Leash and collar",	slot: "flavor",		Gold: 0,	deflips: -3, defass: -3, defsex: -3, deftits: -3, flavor: "Property of Xyo"	});
items.push({id: 922,	name: "Eternal School Girl outfit",		slot: "armor",		Gold: 70,	atkfingers: 5, atklips: 5, atksex: 5, defsex: -2, defass: -2, deflips: -2, deftits: -2, flavor: "[color=pink]The outfit of a girl who confuses a school outfit.. with a fighter gi[/color]"	});
items.push({id: 923,	name: "Super Birdie Mask!!",			slot: "armor",		Gold: 70,	deflips: 1, deftits: -1, defsex: -1, defass: -3, atklips: 1, atkfingers: 1, atkfeet: 1, atksex: 2, atkass: 4, flavor: "It's a super birdie mask that unleashes her innate super nakie birdie powers, duhhhh!!! x3"	});
items.push({id: 924,	name: "Carrot",			slot: "weapon",		Gold: 30,	atkfingers: 3, flavor: "Just a carrot for ingesting... but can totally work for lewdness too~"	});
items.push({id: 925,	name: "Adaria's leotard",				slot: "armor",		Gold: 1,	deftits: -1, defsex: -4, defass: -4, flavor: "With a wedgie handle on the back~" 	});
items.push({id: 926,	name: "Cev's ribbons lvl 1",			slot: "weapon",		Gold: 10,	atkass: 1, flavor: "Tu sabras? la parte de ribbons x3" 	});
items.push({id: 927,	name: "Cev's heavy scent",			slot: "item",		Gold: 10,	atkass: 1, atksex: 1, atktits: 1, flavor: "Like sniffing perfume and sweat at the same time" 	});

items.push({id: 928,	name: "Matt's Martial Attire",		slot: "armor",		Gold: 30,	deftits: 2, defsex: 2, defass: 2, atktits: -1, atksex: -1, atkass: -1, flavor: "[url=https://static.f-list.net/images/charimage/11642957.jpg]Picture[/url]" 	 	});
items.push({id: 929,	name: "Matt's Feather Tattoo",			slot: "item",		Gold: 20,	atkfeet: 2, flavor: "[url=https://static.f-list.net/images/charimage/11642999.jpg]Picture[/url]"	});
items.push({id: 930,	name: "Aphrodisiac-laced Foot Tape",	slot: "weapon",		Gold: 30,	atkfeet: 3, flavor: "[url=https://solonfootandankle.com/wp-content/uploads/2017/02/14805063_S_tape_ankle_sprain_bandage.jpg]Picture[/url]"	});

items.push({id: 931,	name: "Super Saiyan 4 transformation",		slot: "armor",		Gold: 20,	atklips: 2, atktits: 2, atkfingers: 3, atksex: 3, atkass: 2, deflips: -2, deftits: -2, defsex: -3, defass: -2, flavor: "[url=https://static.f-list.net/images/charimage/11511516.jpg]Compresses a giant golden ape monster gal into ring-fighting size~[/url]" 	 	});

items.push({id: 932,	name: "Catwoman's Costume",			slot: "armor",		Gold: 40,	deftits: -3, defass: -3, atktits: 3, atkfeet: 3, atkass: 3, atkfingers: 1, flavor: "The Queen of Crimes Classic regalia" 	});
items.push({id: 933,	name: "Cat O'Nine Tails",			slot: "weapon",		Gold: 30,	atkfingers: 3, flavor: "The Catwomans signature weapon!" 	});
items.push({id: 934,	name: "Cat Bell Collar",			slot: "item",		Gold: 10,	deflips: -1, atktits: 1, atklips: 1, flavor: "This Kitty's been belled!" 	});


//Accessory: -1 defense on lips, +1 attack on tits, +1 attack on lips;  Cat Bell Collar:  This Kitty's been belled!

module.exports = items;

/*
IDEAS
items.push({id: 5,	name: "Boxers",						slot: "armor",		Gold: 10,	stats: {defsex: 1, defass: 1}	}); asi ya no hay que recortar el objeto por la mitad XD
*/