var items = [];

// ***** OUTFITS *****

items.push({id: 0,	name: "Adventurer clothes",		slot: "armor",		Gold: 0,	flavor: "Nothing special" });
items.push({id: 1,	name: "Leather armor",			slot: "armor",		Gold: 10,	defense: 1, flavor: "Basic armor for basic protection needs" });

// ***** SEXTOYS *****

items.push({id: 100,	name: "Hand",			slot: "weapon",		Gold: 0,	flavor: "Starter weapon"	});
items.push({id: 101,	name: "Dagger",			slot: "weapon",		Gold: 10,	strength: 1, flavor: "Pocket size"	});

// ***** ACCESSORIES *****

items.push({id: 200,	name: "Headband",			slot: "item",		Gold: 0, 	flavor: "Makes you look cool"	});
items.push({id: 201,	name: "Agility gloves",		slot: "item",		Gold: 10,	agility: 1, flavor: "Now with extra grip"	});


// ***** AMULETS *****

items.push({id: 300,	name: "Red scarf",				slot: "flavor",		Gold: 0,	flavor: "No main protagonist can live without one"		});
items.push({id: 301,	name: "Vitality amulet",		slot: "flavor",		Gold: 10, 	vitality: 1, flavor: "You can hear a faint slow hearthbeat..."		});

// ***** CONSUMABLES *****
items.push({id: 500,	name: "Light Health Potion",	slot: "consumable",	Gold: 10,	hp: 20,				flavor: "Basic consumable item"		});
items.push({id: 501,	name: "Medium Health Potion",	slot: "consumable",	Gold: 30,	hp: 30,				flavor: "Medium consumable item"		});


module.exports = items;