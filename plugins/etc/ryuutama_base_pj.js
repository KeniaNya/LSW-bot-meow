//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	Esqueleto para pj de ryuutama
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var Personaje = {
	STR: 4, //suben de 2 en 2
	DEX: 4,
	INT: 4,
	SPI: 4,
	
	HP: 8, //FUE*2 (no suben)
	MP: 8, //SPI*2
	Condition: 8, //FUE+SPI (hay que tirarlo todos los dias)
	FP: 0, INI: 0,
	LOAD: 0, //FUE+2+lvl+bonus (si sube)
	XP: 0, LVL: 1,
	Changes: { STR: 0, DEX: 0, INT: 0, SPI: 0, HP: 0, MP: 0 },
	
	//Hojas Cortas, Hojas, Armas de Asta, Hachas y Arcos, si usas un arma no entrenada, tu HP baja en 1 (pag 31)
	trainedWeapons: [], twNumber: 1,
	favoriteObject: "",
	GOLD: 1000,
	bonusDMG: 0, bonusCON: 0, bonusINI: 0, bonusLOAD: 0,
	spellBook: [], knownSpells: 0,
	seasonMagic: "",
	
	Owner: "", Name: "", Nickname: "None yet", Eicon: "",
	Age: 0, Sex: "None yet",
	Color: "None yet", Looks: "None yet",
	Home: "None yet", Reason: "None yet",
	Personality: "None yet",
	
	Editable: ["seasonMagic","Name","Nickname","Eicon","Age","Sex","Color","Looks","Home","Reason","Personality","favoriteObject"],
	
	Habilities: [], //habilidad, caracteristicas, efectos
	Weapons: [],
	Armor: [],
	Shield: [],
	Clothes: [],
	
	Conditions: [],
	
	Class: "", Archetype: "", Class2: "", Archetype2: "",
	Terrain: ["None yet"],
	Inventory: [],
	
	creationStage: "Class"
	
}

module.exports = Personaje;