//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	Armas
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var r = [];

r.push({
	Name: "Light blades",
	Desc: "Precise but weak, single handed",
	ATK: "DEX + INT + 1",
	DMG: "INT - 1"
});

r.push({
	Name: "Swords",
	Desc: "A weapon with a good balance, single handed",
	ATK: "DEX + STR",
	DMG: "STR"
});

r.push({
	Name: "Polearms",
	Desc: "Powerful and versatile weapon, two handed",
	ATK: "DEX + STR",
	DMG: "STR + 1"
});

r.push({
	Name: "Axes",
	Desc: "Less precise but powerful, two handed",
	ATK: "STR + STR - 1",
	DMG: "STR"
});

r.push({
	Name: "Bows",
	Desc: "Ranged weapon, two handed",
	ATK: "INT + DEX - 2",
	DMG: "DEX"
});

r.push({
	Name: "Unarmed",
	Desc: "Unarmed or improvised weapons, both hands",
	ATK: "DEX + STR",
	DMG: "STR - 2"
});

module.exports = r;