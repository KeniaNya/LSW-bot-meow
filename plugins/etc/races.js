var r = [];

r.push({
	name: "Dragonborn",
	desc: "Dragonborn look very much like dragons standing erect in humanoid form, though they lack wings or a tail.",
	stats: {strength:2,charisma:1},
	traits: ["Draconic ancestry","Breath weapon","Damage resistance"]
});

r.push({
	name: "Dwarf",
	desc: "Bold and hardy, dwarves are known as skilled warriors, miners and workers of stone and metal.",
	stats: {constitution:2},
	traits: ["Darkvision","Dwarven resilience","Dwarven combat training","Stonecunning"]
});

r.push({
	name: "Elf",
	desc: "Elves are a magical people of otherwordly grace, living in the world but not entirely part of it.",
	stats: {dexterity:2},
	traits: ["Darkvision","Keen senses","Fey ancestry","Trance"]
});

r.push({
	name: "Human",
	desc: "Humans are the most adaptable and ambitious people among the common races.",
	stats: {strength:1,dexterity:1,constitution:1,intelligence:1,wisdom:1,charisma:1},
	traits: ["Extra language"]
});

r.push({
	name: "Half-orc",
	desc: "Half-orcs' grayish pigmentation, sloping foreheads, jutting jaws, prominent teeth, and towering builds make their orcish heritage plain for all to see.",
	stats: {strength:2,constitution:1},
	traits: ["Darkvision","Menacing","Rentless endurance","Savage attacks"]
});

r.push({
	name: "Tiefling",
	desc: "To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.",
	stats: {charisma:2,intelligence:1},
	traits: ["Darkvision","Hellish resistance","Infernal legacy"]
});

r.push({
	name: "Gnome",
	desc: "A gnome's energy and enthusiasm for living shines through every inch of her tiny body.",
	stats: {intelligence:2},
	traits: ["Darkvision","Gnome cunning"]
});

r.push({
	name: "Halfling",
	desc: "The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.",
	stats: {dexterity:2},
	traits: ["Lucky","Brave","Halfing nimbleness"]
});

module.exports = r;