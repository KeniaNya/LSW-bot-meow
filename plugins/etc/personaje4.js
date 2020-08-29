//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var requireNew = require('require-new');


function Personaje (newChara) {
	var customObjectArray = [];
	var loadoutsArray = [];
	var changes = [];
	
	this.name = newChara.name;
	this.stageName = (newChara.stageName === undefined ? newChara.name : newChara.stageName);
	this.HP = parseInt(newChara.HP);
	this.sp = readStat(newChara.sp);
	this.alive = true;
	this.Gold = parseInt(newChara.Gold);
	if (newChara.faction !== undefined) { this.faction = newChara.faction; } else { this.faction = "None yet!"; }
	
	this.looking = (newChara.looking == undefined ? "no" : newChara.looking);
	
	this.domsub = (newChara.domsub === undefined ? "switch" : newChara.domsub);
	this.cwins = readStat(newChara.cwins));
	this.closes = readStat(newChara.closes));
	
	this.atklips = readStat(newChara.atklips);
	this.atkfingers = readStat(newChara.atkfingers);
	this.atktits = readStat(newChara.atktits);
	this.atksex = readStat(newChara.atksex);
	this.atkass = readStat(newChara.atkass);
	this.atkfeet = readStat(newChara.atkfeet);
	this.deflips = readStat(newChara.deflips);
	this.deffingers = readStat(newChara.deffingers);
	this.deftits = readStat(newChara.deftits);
	this.defsex  = readStat(newChara.defsex);
	this.defass = readStat(newChara.defass);
	this.deffeet = readStat(newChara.deffeet);
	this.batklips = readStat(newChara.atklips);
	this.batkfingers = readStat(newChara.atkfingers);
	this.batktits = readStat(newChara.atktits);
	this.batksex = readStat(newChara.atksex);
	this.batkass = readStat(newChara.atkass);
	this.batkfeet = readStat(newChara.atkfeet);
	this.bdeflips = readStat(newChara.deflips);
	this.bdeffingers = readStat(newChara.deffingers);
	this.bdeftits = readStat(newChara.deftits);
	this.bdefsex  = readStat(newChara.defsex);
	this.bdefass = readStat(newChara.defass);
	this.bdeffeet = readStat(newChara.deffeet);
	
	this.custom = (newChara.custom === undefined ? "" : newChara.custom);
	if (this.custom != "") {
		let customArray = this.custom.split("#meow#");
		for (let i = 0; i < customArray.length; i++) {
			customObjectArray[i] = JSON.parse(customArray[i].trim());
		}
	}
	this.loadouts = (newChara.loadouts === undefined ? "" : newChara.loadouts);
	if (this.loadouts != "") {
		let customArray = this.loadouts.split("#meow#");
		for (let i = 0; i < customArray.length; i++) {
			loadoutsArray[i] = JSON.parse(customArray[i].trim());
		}
	}
	
	this.weapon = buscaId(newChara.wornWeapon,customObjectArray);
	this.armor = buscaId(newChara.wornArmor,customObjectArray);
	this.item = buscaId(newChara.wornItem,customObjectArray);
	this.flavorr = (newChara.wornFlavor != undefined ? buscaId(newChara.wornFlavor,customObjectArray) : buscaId("300",customObjectArray));
	
	this.weight = (newChara.weight != undefined ? buscaId(newChara.weight,customObjectArray) : buscaId("803",customObjectArray));
	let ws = [801,802,803,804,805]; this.weights = [];
	for (let i = 0; i < ws.length; i++) { this.weights[i] = buscaId(ws[i],customObjectArray); }
	
	//this.maxHP = this.HP;
	
	this.color1 = newChara.color1;
	this.color2 = newChara.color2;
	this.lastpost = readStat(newChara.lastpost);
	
	this.lastmoneytransfer = readStat(newChara.lastmoneytransfer);
	this.transferedmoney = readStat(newChara.transferedmoney);
	
	this.addlips = readStat(newChara.addlips);
	this.addfingers = readStat(newChara.addfingers);
	this.addtits = readStat(newChara.addtits));
	this.addsex = readStat(newChara.addsex);
	this.addass = readStat(newChara.addass);
	this.addfeet = readStat(newChara.addfeet);
	this.addbody = readStat(newChara.addbody);
	this.addsight = readStat(newChara.addsight);
	
	
	this.calculateAddictions = function() {
		this.weaknesses = 0;
		this.resistances = 0;
		if (this.addlips > 0)		{ this.weaknesses += this.addlips; }	else { this.resistances -= this.addlips; }
		if (this.addfingers > 0)	{ this.weaknesses += this.addfingers; }	else { this.resistances -= this.addfingers; }
		if (this.addtits > 0)		{ this.weaknesses += this.addtits; }	else { this.resistances -= this.addtits; }
		if (this.addsex > 0)		{ this.weaknesses += this.addsex; }		else { this.resistances -= this.addsex; }
		if (this.addass > 0)		{ this.weaknesses += this.addass; }		else { this.resistances -= this.addass; }
		if (this.addfeet > 0)		{ this.weaknesses += this.addfeet; }	else { this.resistances -= this.addfeet; }
	}
	
	
	this.calculateAddictions();
	if (this.resistances > this.weaknesses) {
		this.addlips = 0;
		this.addfingers = 0;
		this.addtits = 0;
		this.addsex = 0;
		this.addass = 0;
		this.addfeet = 0;
		this.calculateAddictions();
	}
	
	this.wins = readStat(newChara.wins);
	this.loses = readStat(newChara.loses);
	
	let names = Object.keys(this.weapon);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.weapon[names[i]];
	};
	
	names = Object.keys(this.armor);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.armor[names[i]];
	};
	
	names = Object.keys(this.item);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.item[names[i]];
	};
	
	names = Object.keys(this.flavorr);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.flavorr[names[i]];
	};
	
	names = Object.keys(this.weight);
	names.splice(0,4);
	this.stripchance = 0;
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.weight[names[i]];
	};
	
	/* names = Object.keys(this.addiction);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.addiction[names[i]];
	}; */
	
	this.usedstatpoints = (this.atklips + this.atkfingers + this.atktits + this.atksex + this.atkass + this.atkfeet + this.deflips + this.deffingers + this.deftits + this.defsex + this.defass + this.deffeet);
	if (this.name == "ErotiClaire") { this.usedstatpoints = 0; }
	
	
	this.atkbody = Math.ceil((this.atktits + this.atkass + this.atksex) / 3);
	this.defsight = Math.ceil((this.deftits + this.defass + this.defsex) / 3);
	
	let itemList = parseStringToIntArray(newChara.ownedItems);
	for (let i = 0; i < itemList.length; i++) { if (itemList[i] >= 400 && itemList[i] < 500) { itemList.splice(i, 1); i--; } }
	this.equipment = [];														//ARREGLO DE OBJETOS
	for (let i = 0; i < itemList.length; i++) { this.equipment[i] = buscaId(itemList[i],customObjectArray); }
	
	
	
	this.stripMe = function() {
		let names = Object.keys(this.weapon);
		names.splice(0,4);
		for (let i = 0; i < names.length; i++) {
			this[names[i]] -= this.weapon[names[i]];
		};
		
		names = Object.keys(this.armor);
		names.splice(0,4);
		for (let i = 0; i < names.length; i++) {
			this[names[i]] -= this.armor[names[i]];
		};
		
		names = Object.keys(this.item);
		names.splice(0,4);
		for (let i = 0; i < names.length; i++) {
			this[names[i]] -= this.item[names[i]];
		};
	}
	
	this.dailyCheck = function() {
		let fecha = Date.now();
		let diferencia = fecha - this.lastpost;
		if (diferencia > 72000000) {
			this.lastpost = fecha;
			return true
		}
		return false;
	}
	
	this.dailyMoneyCheck = function(cantidad) {
		let fecha = Date.now();
		let diferencia = fecha - this.lastmoneytransfer;
		if (diferencia > 72000000) {
			this.transferedmoney = 0;
			this.lastmoneytransfer = fecha;
		}
		if ((this.transferedmoney + cantidad) < 21) {
			this.transferedmoney += cantidad;
			return true
		}
		return false;
	}
	
	this.addGold = function(cantidad) {
		this.Gold += cantidad;
		newChara.Gold = this.Gold;
	}
	
	this.addSP = function(cantidad) {
		this.sp += cantidad;
		newChara.sp = this.sp;
	}
	
	this.addWin = function() {
		this.wins += 1;
		newChara.wins = this.wins;
		this.cwins += 1;
		newChara.cwins = this.cwins;
		this.closes = 0;
		newChara.closes = this.closes;
	}
	
	this.addLose = function() {
		this.loses += 1;
		newChara.loses = this.loses;
		this.closes += 1;
		newChara.closes = this.closes;
		this.cwins = 0;
		newChara.cwins = this.cwins;
	}
	
	this.giveItem = function(item) {
		this.equipment.push(item);
	}
	
	//this.setstat = function(stat, value) {
		//this[stat] = value;
	//}
	
	this.train = function(part) {
		let costos = [1,1,2,2,3,4,5,0];
		let stat = parseInt(this["b"+part]);
		let costo = costos[stat];
		if (this.sp >= costo && stat < 7) {
			this["b"+part] = stat + 1;
			this.sp -= costo;
			newChara[part] = this["b"+part];
			newChara.sp = this.sp;
			return true;
		}
		return false;
	}
	
	this.indulge = function(part) {
		let costos = [0,1,1,2,2,3,4,5];
		let stat = parseInt(this["b"+part]);
		let costo = costos[stat];
		if (stat > 1) {
			this["b"+part] = stat - 1;
			this.sp += costo;
			newChara[part] = this["b"+part];
			newChara.sp = this.sp;
			return true;
		}
		return false;
	}
	
	this.setStat = function(part, value) {
		newChara[part] = value;
		this[part] = newChara[part];
	}
	
	this.removeItem = function(item) {
		for (let i = 0; i < this.equipment.length; i++) {
			if (this.equipment[i].name.toLowerCase() == item.toLowerCase()) {
				if (this.equipment[i].id == 0 || this.equipment[i].id == 100 || this.equipment[i].id == 200 || this.equipment[i].id == 300 || this.equipment[i].id == 400) { return -1; }
				let ganancia = this.equipment[i].Gold;
				let slot = this.equipment[i].slot;
				let id = this.equipment[i].id;
				let tempCustom = [];
				for (j = 0; j < customObjectArray.length; j++) {
					if (customObjectArray[j].id != id) {
						tempCustom.push(JSON.stringify(customObjectArray[j]));
					}
				}
				this.custom = tempCustom.join("#meow#");
				this.equipment.splice(i, 1);
				if (slot == "armor") { this.armor = buscaId("0",customObjectArray); } 
				if (slot == "weapon") { this.weapon = buscaId("100",customObjectArray); }
				if (slot == "item") { this.item = buscaId("200",customObjectArray); }
				if (slot == "flavor") { this.flavorr = buscaId("300",customObjectArray); }
				if (slot == "addiction") { this.addiction = buscaId("400",customObjectArray); }
				return ganancia;
			}
		}
		return -1;
	}
	
	this.renameItem = function(original, nuevo) {
		for (let i = 0; i < this.equipment.length; i++) {
			if (this.equipment[i].name.toLowerCase() == original.toLowerCase()) { //if found...
				let tempCustom = [];
				for (j = 0; j < customObjectArray.length; j++) {
					if (customObjectArray[j].id != this.equipment[i].id) {
						tempCustom.push(JSON.stringify(customObjectArray[j])); //make a new custom array without the new item to be renamed...
					}
				}
				let data = {};
				data.id = this.equipment[i].id;
				let tempNuevo = nuevo.split(" $ ");
				if (tempNuevo.length == 2) {
					data.name = tempNuevo[0];
					data.flavor = tempNuevo[1];
				} else {
					data.name = nuevo;
				}
				tempCustom.push(JSON.stringify(data)); //add the new custom item
				this.custom = tempCustom.join("#meow#"); //save into the stringed array
				return true;
			}
		}
		return false;
	}
	
	this.setweight = function(selection) {
		for (let i = 0; i < this.weights.length; i++) {
			if (this.weights[i].name.toLowerCase() == selection.toLowerCase()) {
				this.weight = this.weights[i];
				return true;
			}
		}
		return false;
	}
	
	
	this.equip = function(item) {
		for (let i = 0; i < this.equipment.length; i++) {
			if (this.equipment[i].name.toLowerCase() == item.toLowerCase()) {
				if (this.equipment[i].slot == "armor") { this.armor = this.equipment[i]; } 
				if (this.equipment[i].slot == "weapon") { this.weapon = this.equipment[i]; }
				if (this.equipment[i].slot == "item") { this.item = this.equipment[i]; }
				if (this.equipment[i].slot == "flavor") { this.flavorr = this.equipment[i]; }
				if (this.equipment[i].slot == "addiction") { this.addiction = this.equipment[i]; }
				return true;
			}
		}
		return false;
	}
	
	this.unequip = function(item) {
		for (let i = 0; i < this.equipment.length; i++) {
			if (this.equipment[i].name.toLowerCase() == item.toLowerCase()) {
				if (this.equipment[i].slot == "armor") { this.armor = buscaId("0",customObjectArray); } 
				if (this.equipment[i].slot == "weapon") { this.weapon = buscaId("100",customObjectArray); }
				if (this.equipment[i].slot == "item") { this.item = buscaId("200",customObjectArray); }
				if (this.equipment[i].slot == "flavor") { this.flavorr = buscaId("300",customObjectArray); }
				if (this.equipment[i].slot == "addiction") { this.addiction = buscaId("400",customObjectArray); }
				return true;
			}
		}
		return false;
	}
	
	this.saveLoadout = function(loadout) {
		let tempLoadouts = [];
		for (let i = 0; i < loadoutsArray.length; i++) {
			if (loadout.name != loadoutsArray[i].name) { tempLoadouts.push(JSON.stringify(loadoutsArray[i])); }
		}
		tempLoadouts.push(JSON.stringify(loadout));
		this.loadouts = tempLoadouts.join("#meow#");
	}
	
	this.viewLoadouts = function() {
		let message = "Saved loadouts: "; let tempArr = [];
		for (let i = 0; i < loadoutsArray.length; i++) {
			tempArr[i] = loadoutsArray[i].name;
		}
		message += tempArr.join(", ");
		return message;
	}
	
	this.equipLoadout = function(name) {
		let loadout = ""; let equipError = false;
		for (let i = 0; i < loadoutsArray.length; i++) { if (loadoutsArray[i].name == name) { loadout = loadoutsArray[i]; } }
		if (loadout == "") { return [false,false]; }
		//found
		delete loadout.name;
		let names = Object.keys(loadout);
		for (let i = 0; i < names.length; i++) {
			//console.log("key: "+names[i]+", target value: "+loadout[names[i]]+", current value:"+this["b"+names[i]]);
			if (names[i].startsWith("worn")) {
				//equip
				if (this.equip(loadout[names[i]]) == false) { equipError = true; } //console.log("equipped: "+loadout[names[i]]);
			} else {
				let watchdog = 900;
				if (this["b"+names[i]] < loadout[names[i]]) {
					//train
					while (this["b"+names[i]] < loadout[names[i]]) {
						this.train(names[i]); //console.log("trained "+names[i]+", current value: "+this["b"+names[i]]);
						watchdog--; if (watchdog < 1) { return [false,true]; }
					}
				} else {
					//indulge
					while (this["b"+names[i]] > loadout[names[i]]) {
						this.indulge(names[i]); //console.log("indulged "+names[i]+", current value: "+this["b"+names[i]]);
						watchdog--; if (watchdog < 1) { return [false,true]; }
					}
				}
				
			}
		}
		return [true,equipError];
	}
	
	this.deleteLoadout = function(name) {
		for (let i = 0; i < loadoutsArray.length; i++) {
			if (loadoutsArray[i].name == name) {
				loadoutsArray.splice(i,1);
				
				let tempLoadouts = [];
				for (let i = 0; i < loadoutsArray.length; i++) {
					tempLoadouts.push(JSON.stringify(loadoutsArray[i]));
				}
				this.loadouts = tempLoadouts.join("#meow#");				
				
				return true;
			}
		}
		return false;
	}
	
	this.getSaveFile = function() {
		
		newChara.sp = this.sp;
		newChara.wornArmor = this.armor.id;
		newChara.wornWeapon = this.weapon.id;
		newChara.wornItem = this.item.id;
		newChara.wornFlavor = this.flavorr.id;
		newChara.weight = this.weight.id;
		newChara.stageName = this.stageName;
		newChara.lastpost = this.lastpost;
		newChara.transferedmoney = this.transferedmoney;
		newChara.lastmoneytransfer = this.lastmoneytransfer;
		newChara.wins = this.wins;
		newChara.loses = this.loses;
		newChara.custom = this.custom;
		newChara.loadouts = this.loadouts;
		newChara.domsub = this.domsub;
		
		newChara.addlips = this.addlips; newChara.addfingers = this.addfingers; newChara.addtits = this.addtits;
		newChara.addsex = this.addsex; newChara.addass = this.addass; newChara.addfeet = this.addfeet; 
		newChara.addsight = this.addsight; newChara.addbody = this.addbody;
		if (this.faction !== undefined) { newChara.faction = this.faction; }
		
		let ownedItemsID = [];
		for (let i = 0; i < this.equipment.length; i++) { ownedItemsID[i] = this.equipment[i].id; }
		newChara.ownedItems = ownedItemsID.toString();
		
		let temp = Object.keys(newChara);
		for (let i = 0; i < temp.length; i++) {
			if (newChara[temp[i]] == undefined) { console.log("Undefinded found in: "+newChara.name); }
		}
		
		return newChara;
	}
	
	//***************************************************************************************************************
	//	COMBATE
	//***************************************************************************************************************
	
	this.removeHP = function(cantidad) {
		this.HP -= cantidad;
		if (this.HP <= 0) {
			this.HP = 0;
			this.alive = false;
			return true;
		}
		return false;
	}
	
	this.use = function(item) { //checar si es consumable o bondage y aplicar el bonus de hp
		for (let i = 0; i < this.equipment.length; i++) {
			if (this.equipment[i].name.toLowerCase() == item.toLowerCase()) {
				if (this.equipment[i].id >= 500 && this.equipment[i].id <= 599) {
					this.HP += this.equipment[i].hp;
					if (this.HP > this.maxHP) { this.HP = this.maxHP; }
					if (this.HP < 0) { this.HP = 0; }
					
					return ["consumable", this.equipment.splice(i, 1)[0]];
				}
				if (this.equipment[i].id >= 600 && this.equipment[i].id <= 699) {
					return ["bondage", this.equipment.splice(i, 1)[0]];
				}
			}
		}
		return false;
	}
	
	this.use2 = function(item) { //aplicar modificacion temporal a los stats
		let names = Object.keys(item);
		names.splice(0,5);
		for (let i = 0; i < names.length; i++) {
			this[names[i]] += item[names[i]];
		}
		changes.push(item);
	}
	
	this.nextTurn = function() {
		for (let i = 0; i < changes.length; i++) {
			changes[i].turns--;
			if (changes[i].turns == -1) {
				names = Object.keys(changes[i]);
				names.splice(0,5);
				for (let j = 0; j < names.length; j++) {
					this[names[j]] -= changes[i][names[j]];
				}
				changes.splice(i, 1);
				i--;
			}
		}
	}
	
}

//buscar por id
function buscaId(nombre, customObjectArray) {
	let lista = requireNew('./shop2.js');
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id == nombre) {
			//aplicar customs!
			for (let j = 0; j < customObjectArray.length; j++) {
				if (customObjectArray[j].id == lista[i].id) {
					//aplicar
					let llaves = Object.keys(customObjectArray[j]);
					for (let k = 0; k < llaves.length; k++) {
						lista[i][llaves[k]] = customObjectArray[j][llaves[k]];
					}
				}
			}
			return lista[i];
        }
    }
    return -1;
}

function parseStringToIntArray(myString) {
    let myArray = myString.split(",");
    for (let i = 0; i < myArray.length; i++) {
        if (!isNaN(myArray[i]) && myArray[i] != "") {
            myArray[i] = parseInt(myArray[i]);
        }
        else {
            myArray.splice(i, 1);
        }
    }
    return myArray;
}

function readStat(stat) {
	return stat === undefined ? 0 : parseInt(stat);
}


module.exports = Personaje;