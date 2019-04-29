//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var requireNew = require('require-new');
var statTable = [0,1,2,4,6,9,13,18];

function Personaje (newChara) {
	var customObjectArray = [];
	var changes = [];
	
	this.name = newChara.name;
	this.HP = parseInt(newChara.HP);
	this.maxHP = this.HP;
	this.alive = true;
	this.Gold = parseInt(newChara.Gold);
	this.sp = (newChara.sp == undefined ? 0 : parseInt(newChara.sp));
	
	this.atklips = parseInt(newChara.atklips);
	this.atkfingers = parseInt(newChara.atkfingers);
	this.atktits = parseInt(newChara.atktits);
	this.atksex = parseInt(newChara.atksex);
	this.atkass = parseInt(newChara.atkass);
	this.atkfeet = parseInt(newChara.atkfeet);
	this.deflips = parseInt(newChara.deflips);
	this.deftits = parseInt(newChara.deftits);
	this.defsex  = parseInt(newChara.defsex);
	this.defass = parseInt(newChara.defass);
	this.deffeet = (newChara.deffeet === undefined ? 1 : parseInt(newChara.deffeet));
	this.batklips = parseInt(newChara.atklips);
	this.batkfingers = parseInt(newChara.atkfingers);
	this.batktits = parseInt(newChara.atktits);
	this.batksex = parseInt(newChara.atksex);
	this.batkass = parseInt(newChara.atkass);
	this.batkfeet = parseInt(newChara.atkfeet);
	this.bdeflips = parseInt(newChara.deflips);
	this.bdeftits = parseInt(newChara.deftits);
	this.bdefsex  = parseInt(newChara.defsex);
	this.bdefass = parseInt(newChara.defass);
	
	this.usedstatpoints = statTable[this.atklips] + statTable[this.atkfingers] + statTable[this.atktits] + statTable[this.atksex] + statTable[this.atkass] + statTable[this.atkfeet] + statTable[this.deflips] + statTable[this.deftits] + statTable[this.defsex] + statTable[this.defass] + statTable[this.deffeet];
	console.log(this.usedstatpoints);
	
	this.custom = (newChara.custom === undefined ? "" : newChara.custom);
	if (this.custom != "") {
		let customArray = this.custom.split("#meow#");
		for (let i = 0; i < customArray.length; i++) {
			customObjectArray[i] = JSON.parse(customArray[i].trim());
		}
	}
	
	this.weapon = buscaId(newChara.wornWeapon,customObjectArray);
	this.armor = buscaId(newChara.wornArmor,customObjectArray);
	this.item = buscaId(newChara.wornItem,customObjectArray);
	this.flavorr = (newChara.wornFlavor != undefined ? buscaId(newChara.wornFlavor,customObjectArray) : buscaId("300",customObjectArray));
	this.addiction = (newChara.wornAddiction != undefined ? buscaId(newChara.wornAddiction,customObjectArray) : buscaId("400",customObjectArray));
	this.color1 = newChara.color1;
	this.color2 = newChara.color2;
	this.lastpost = (newChara.lastpost != undefined ? parseInt(newChara.lastpost) : 0);
	
	this.lastmoneytransfer = (newChara.lastmoneytransfer != undefined ? parseInt(newChara.lastmoneytransfer) : 0);
	this.transferedmoney = (newChara.transferedmoney != undefined ? parseInt(newChara.transferedmoney) : 0);
	
	this.addlips = 0; this.addfingers = 0; this.addtits = 0; this.addsex = 0; this.addass = 0; this.addfeet = 0;
	this.addbody = 0; this.addsight = 0;
	this.wins = (newChara.wins === undefined ? 0 : parseInt(newChara.wins));
	this.loses = (newChara.loses === undefined ? 0 : parseInt(newChara.loses));
	
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
	
	//save game!
	
	
	names = Object.keys(this.flavorr);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.flavorr[names[i]];
	};
	
	names = Object.keys(this.addiction);
	names.splice(0,4);
	for (let i = 0; i < names.length; i++) {
		this[names[i]] += this.addiction[names[i]];
	};
	
	this.atkbody = Math.ceil((this.atktits + this.atkass + this.atksex) / 3);
	this.defsight = Math.ceil((this.deftits + this.defass + this.defsex) / 3);
	
	let itemList = parseStringToIntArray(newChara.ownedItems);
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
		if (diferencia > 79200000) {
			this.lastpost = fecha;
			return true
		}
		return false;
	}
	
	this.dailyMoneyCheck = function(cantidad) {
		let fecha = Date.now();
		let diferencia = fecha - this.lastmoneytransfer;
		if (diferencia > 79200000) {
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
	}
	
	this.addLose = function() {
		this.loses += 1;
		newChara.loses = this.loses;
	}
	
	this.giveItem = function(item) {
		this.equipment.push(item);
	}
	
	this.train = function(part) {
		let costos = [1,1,2,2,3,4,5,0];
		let stat = parseInt(newChara[part]);
		let costo = costos[stat];
		if (this.sp >= costo && stat < 7 && this.usedstatpoints+costo <= 80) {
			newChara[part] = stat + 1;
			this.sp -= costo;
			this[part] = newChara[part];
			newChara.sp = this.sp;
			return true;
		}
		return false;
	}
	
	this.indulge = function(part) {
		let costos = [0,1,1,2,2,3,4,5];
		let stat = parseInt(newChara[part]);
		let costo = costos[stat];
		if (stat > 1) {
			newChara[part] = stat - 1;
			this.sp += costo;
			this[part] = newChara[part];
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
				if (this.equipment[i].slot == "addiction") { this.addiction = this.equipment[i]; }
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
		newChara.wornAddiction = this.addiction.id;
		newChara.lastpost = this.lastpost;
		newChara.transferedmoney = this.transferedmoney;
		newChara.lastmoneytransfer = this.lastmoneytransfer;
		newChara.wins = this.wins;
		newChara.loses = this.loses;
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
		this.HP -= cantidad;
		if (this.HP <= 0) {
			this.HP = 0;
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
					this.equipment.splice(i, 1);
					return "consumable";
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

module.exports = Personaje;