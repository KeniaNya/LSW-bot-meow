//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var requireNew = require('require-new');

function Personaje (newChara) {
	
	var changes = [];
	
	this.name = newChara.name;
	this.HP = (newChara.HP === undefined ? 100 : parseInt(newChara.HP));
	this.alive = true;
	this.Gold = parseInt(newChara.Gold);
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
	this.weapon = buscaId(newChara.wornWeapon);
	this.armor = buscaId(newChara.wornArmor);
	this.item = buscaId(newChara.wornItem);
	this.flavorr = (newChara.wornFlavor != undefined ? buscaId(newChara.wornFlavor) : buscaId("300"));
	this.addiction = (newChara.wornAddiction != undefined ? buscaId(newChara.wornAddiction) : buscaId("400"));
	this.color1 = newChara.color1;
	this.color2 = newChara.color2;
	this.lastpost = (newChara.lastpost != undefined ? parseInt(newChara.lastpost) : 0);
	this.battlestoday = (newChara.battlestoday != undefined ? parseInt(newChara.battlestoday) : 0);
	
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
	for (let i = 0; i < itemList.length; i++) { this.equipment[i] = buscaId(itemList[i]); }
	
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
			this.battlestoday = 0;
			this.lastpost = fecha;
		}
		if (this.battlestoday < 3) {
			this.battlestoday += 1;
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
		if (newChara.Gold >= 10 && (newChara[part] === undefined || parseInt(newChara[part]) < 5)) {
			newChara[part] = (newChara[part] === undefined ? 1 : parseInt(newChara[part])) + 1;
			newChara.Gold = parseInt(newChara.Gold) - 10;
			this[part] = newChara[part];
			return true;
		}
		return false;
	}
	
	this.indulge = function(part) {
		if (newChara[part] === undefined || parseInt(newChara[part]) > -3) {
			newChara[part] = (newChara[part] === undefined ? 1 : parseInt(newChara[part])) - 1;
			newChara.Gold = parseInt(newChara.Gold) + 10;
			this[part] = newChara[part];
			return true;
		}
		return false;
	}
	
	this.setStat = function(part, value) {
		newChara[part] = value;
		this[part] = newChara[part];
	}
	
	this.removeItem = function(item) {
		if (item.id == 0 || item.id == 100 || item.id == 200 || item.id == 300 || item.id == 400) { return false; }
		for (let i = 0; i < this.equipment.length; i++) {
			if (item.id == this.equipment[i].id) {
				this.equipment.splice(i, 1);
				if (item.slot == "armor") { this.armor = buscaId("0"); } 
				if (item.slot == "weapon") { this.weapon = buscaId("100"); }
				if (item.slot == "item") { this.item = buscaId("200"); }
				if (item.slot == "flavor") { this.flavorr = buscaId("300"); }
				if (item.slot == "addiction") { this.addiction = buscaId("400"); }
				return true;
			}
		}
		return false;
	}
	
	this.equip = function(item) {
		if (item.slot != null) {
			for (let i = 0; i < this.equipment.length; i++) {
				if (item.id == this.equipment[i].id) {
					if (item.slot == "armor") { this.armor = item; } 
					if (item.slot == "weapon") { this.weapon = item; }
					if (item.slot == "item") { this.item = item; }
					if (item.slot == "flavor") { this.flavorr = item; }
					if (item.slot == "addiction") { this.addiction = item; }
					return true;
				}
			}
		}
		return false;
	}
	
	this.getSaveFile = function() {
		
		newChara.wornArmor = this.armor.id;
		newChara.wornWeapon = this.weapon.id;
		newChara.wornItem = this.item.id;
		newChara.wornFlavor = this.flavorr.id;
		newChara.wornAddiction = this.addiction.id;
		newChara.battlestoday = this.battlestoday;
		newChara.lastpost = this.lastpost;
		newChara.transferedmoney = this.transferedmoney;
		newChara.lastmoneytransfer = this.lastmoneytransfer;
		newChara.wins = this.wins;
		newChara.loses = this.loses;
		
		let ownedItemsID = [];
		for (let i = 0; i < this.equipment.length; i++) { ownedItemsID[i] = this.equipment[i].id; }
		newChara.ownedItems = ownedItemsID.toString();
		
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
function buscaId(nombre) {
	let lista = requireNew('./shop.js');
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id == nombre) {
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