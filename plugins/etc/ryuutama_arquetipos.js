//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	Arquetipos para ryuutama
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var r = [];

r.push({
	Name: "Offense",
	Desc: "Expert in combat and phisical strength",
	Habilities: [
		{Hability: "Endurance", Effects: "+4 to HP", Stats: "-"},
		{Hability: "Power", Effects: "+1 to DMG", Stats: "-"},
		{Hability: "Weapon specialist", Effects: "1 additional trained weapon", Stats: "-"}
	],
	Bonus: {HP: 4, bonusDMG: 1, twNumber: 1}
});

r.push({
	Name: "Technic",
	Desc: "Great capacity of concentration",
	Habilities: [
		{Hability: "Precision", Effects: "+1 to Concentration rolls", Stats: "-"},
		{Hability: "Swiftness", Effects: "+1 to Initiative rolls", Stats: "-"},
		{Hability: "Pockets", Effects: "+3 to Load capacity", Stats: "-"}
	],
	Bonus: {bonusCON: 1, bonusINI: 1, bonusLOAD: 3}
});

r.push({
	Name: "Magic",
	Desc: "Able to manipulate the mystic energy",
	Habilities: [
		{Hability: "Will", Effects: "+4 to MP", Stats: "-"},
		{Hability: "Spellbook", Effects: "2 Enchantments per level", Stats: "-"},
		{Hability: "Season sorcerer", Effects: "Can use Season Magic", Stats: "-"}
	],
	Bonus: {MP: 4, knownSpells: 2, seasonMagic: "Yes"}
});

module.exports = r;