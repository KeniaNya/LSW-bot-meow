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
	var changes = [];
	
	// { name: Kenia Nya, stats: {json string} }
	var stats = JSON.parse(newChara.stats);
	this.name = newChara.name;
	Object.assign(this, stats);
	
	/* if (this.custom != "") {
		let customArray = this.custom.split("#meow#");
		for (let i = 0; i < customArray.length; i++) {
			customObjectArray[i] = JSON.parse(customArray[i].trim());
		}
	} */
	
	this.weapon = buscaId(this.wornWeapon,customObjectArray);
	this.armor = buscaId(this.wornArmor,customObjectArray);
	this.item = buscaId(this.wornItem,customObjectArray);
	this.flavorr = buscaId(this.wornFlavor,customObjectArray);
	
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
	
	//this.equipment = [];
	//for (let i = 0; i < this.ownedItems.length; i++) { this.equipment[i] = buscaId(this.ownedItems[i],customObjectArray); }
	
	this.addGold = function(cantidad) {
		this.Gold += cantidad;
		newChara.Gold = this.Gold;
	}
	
	this.giveItem = function(item) {
		this.equipment.push(item);
	}
	
	this.train = function(part) {
		if (this.statpoints >= 1) {
			this.statpoints -= 1;
			newChara.statpoints = this.statpoints;
			this[part] += 1;
			newChara[part] = this[part];
			return true;
		}
		return false;
	}
	
	this.untrain = function(part) {
		this.statpoints += 1;
		newChara.statpoints = this.statpoints;
		this[part] -= 1;
		newChara[part] = this[part];
		return true;
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
				return ganancia;
			}
		}
		return -1;
	}
	
	this.renameItem = function(original, nuevo) {
		for (let i = 0; i < this.equipment.length; i++) {
			if (this.equipment[i].name.toLowerCase() == original.toLowerCase()) {
				let tempCustom = [];
				for (j = 0; j < customObjectArray.length; j++) {
					if (customObjectArray[j].id != this.equipment[i].id) {
						tempCustom.push(JSON.stringify(customObjectArray[j]));
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
				tempCustom.push(JSON.stringify(data));
				this.custom = tempCustom.join("#meow#");
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
				return true;
			}
		}
		return false;
	}
	
	this.setstat = function(stat, value) { this[stat] = value; newChara[stat] = this[stat]; }
	this.incstat = function(stat) { this[stat] += 1; newChara[stat] = this[stat]; }
	this.decstat = function(stat) { this[stat] -= 1; newChara[stat] = this[stat]; }
	
	this.getSaveFile = function() {
		
		newChara.wornArmor = this.armor.id;
		newChara.wornWeapon = this.weapon.id;
		newChara.wornItem = this.item.id;
		newChara.wornFlavor = this.flavorr.id;
		newChara.custom = this.custom;
		
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
		this.hp -= cantidad;
		if (this.hp <= 0) {
			this.hp = 0;
			this.alive = false;
			return true;
		}
		return false;
	}
	
	this.use = function(item) {
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
	
	this.use2 = function(item) {
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
	let lista = requireNew('./shop3.js');
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

module.exports = Personaje;