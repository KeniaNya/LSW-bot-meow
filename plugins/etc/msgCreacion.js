var classes = require('./ryuutama_classes.js');
var Class = "Welcome to Ryuutama! ... First, choose a class:\n";
for (let i in classes) {
	Class += "► [b]"+classes[i].Name+"[/b], "+classes[i].Desc+"\n";
	for (let j in classes[i].Habilities) {
		let h = classes[i].Habilities[j];
		Class += h.Hability+" ("+h.Stats+"): "+h.Effects+"\n";
	}
}

var arquetipos = require('./ryuutama_arquetipos.js');
var Type = "Choose an archetype:\n";
for (let i in arquetipos) {
	Type += "► [b]"+arquetipos[i].Name+"[/b], "+arquetipos[i].Desc+"\n";
	for (let j in arquetipos[i].Habilities) {
		let h = arquetipos[i].Habilities[j];
		Type += h.Hability+" ("+h.Stats+"): "+h.Effects+"\n";
	}
}

var Charas = "Characteristics:\n"
Charas += "Strength (STR): Represents physical power, stamina, and endurance. (Hitpoints, Carrying capacity, STR based weapons...)\n";
Charas += "Dexterity (DEX): Represents speed, nimbleness, and lightness of foot. (Initiative, DEX based weapons...)\n";
Charas += "Intelligence (INT): Represents power of judgment, thought, and memory. (Initiative, Social, Craft, Magic...)\n";
Charas += "Spirit (SPI): Represents focus, bravery and strength of conviction. (Magicpoints, Will, Concentration...)\n";
Charas += "Choose one array of values: 6,6,6,6 / 4,6,6,8 / 4,4,8,8 (You can have all stats on 6, two in 6 one in 4 OR two in 4 and two in 8)\n";
Charas += "Example: If you want a STR of 8, DEX of 4, INT of 6, and SPI of 6, you type: 8,4,6,6";

var weapons = require('./ryuutama_weapons.js');
var Weapon = "Chose your trained weapon (or weapons if you have the Offense archetype):\n";
for (let i in weapons) {
	Weapon += "► [b]"+weapons[i].Name+"[/b], "+weapons[i].Desc+", ATK: ["+weapons[i].ATK+"], DMG: ["+weapons[i].DMG+"]\n";
}


var Favorite = "Choose for your character a small item that they would have an emotional bond with. This should be something the character would have on them at all times. This item is only to add ﬂavor and background to your character, and has no mechanical effects or rules of its own. With consent from your GM, you may choose a piece of travel gear or weapon as your character’s Favorite object, but this is strongly discouraged...";
var Name = "Pick your name...";
var Age = "Pick your age...";
var Sex = "Choose a sex...";
var Color = "Choose your favorite color...";
var Looks = "Type a short description of your character's look...";
var Home = "Type a short description of your character's home...";
var Reason = "What's the reason your character wants to travel?";
var Personality = "Type a short description of your character's personality...";
var Done = "You're done!";

var creacion = { //Class, Type, Charas, Weapon, Favorite, Name, Age, Sex, Color, Look, Home, Reason, Personality
	Class: Class, Type: Type, Charas: Charas, Weapon: Weapon, Favorite: Favorite,
	Name: Name, Age: Age, Sex: Sex, Color: Color, Looks: Looks, Home: Home, Reason: Reason, Personality: Personality,
	Done: Done
}

module.exports = creacion;