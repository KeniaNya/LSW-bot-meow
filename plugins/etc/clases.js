var r = [];

r.push({
	name: "Barbarian",
	desc: "A fierce warrior of primitive background who can enter a battle rage",
	hitDie: 12,
	primaryAbility: "strength",
	saves: ["strength","constitution"]
});

r.push({
	name: "Rogue",
	desc: "A scoundrel who uses stealth and trickery to overcome obstacles and enemies",
	hitDie: 8,
	primaryAbility: "dexterity",
	saves: ["dexterity","intelligence"]
});

r.push({
	name: "Sorcerer",
	desc: "A spellcaster who draws on inherent magic from a gift or bloodline",
	hitDie: 6,
	primaryAbility: "charisma",
	saves: ["constitution","charisma"]
});

r.push({
	name: "Wizard",
	desc: "A scholarly magic-user capable of manipulating the structures of reality",
	hitDie: 6,
	primaryAbility: "intelligence",
	saves: ["intelligence","wisdom"]
});

r.push({
	name: "Druid",
	desc: "A priet of the Old Faith, wielding the powers of nature and adopting animal forms",
	hitDie: 8,
	primaryAbility: "wisdom",
	saves: ["intelligence","wisdom"]
});

module.exports = r;