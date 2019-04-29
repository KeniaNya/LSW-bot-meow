//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var items = require('./shop.js');
var chara;

function Personaje (newChara) {
	chara = newChara;
	
	this.name = chara.name;
	this.HP = (chara.HP === undefined ? 100 : parseInt(chara.HP));
	this.Gold = parseInt(chara.Gold);
	this.atklips = parseInt(chara.atklips);
	this.atkfingers = parseInt(chara.atkfingers);
	this.atktits = parseInt(chara.atktits);
	this.atksex = parseInt(chara.atksex);
	this.atkass = parseInt(chara.atkass);
	this.atkfeet = parseInt(chara.atkfeet);
	this.deflips = parseInt(chara.deflips);
	this.deftits = parseInt(chara.deftits);
	this.defsex  = parseInt(chara.defsex);
	this.defass = parseInt(chara.defass);
	this.weapon = buscaId(items, chara.wornWeapon);
	this.armor = buscaId(items, chara.wornArmor);
	this.item = buscaId(items, chara.wornItem);
	this.flavorr = (chara.wornFlavor != undefined ? buscaId(items,chara.wornFlavor) : buscaId(items, "300"));
	this.addiction = (chara.wornAddiction != undefined ? buscaId(items,chara.wornAddiction) : buscaId(items, "400"));
	this.color1 = chara.color1;
	this.color2 = chara.color2;
	this.lastpost = (chara.lastpost != undefined ? parseInt(chara.lastpost) : 0);
	this.battlestoday = (chara.battlestoday != undefined ? parseInt(chara.battlestoday) : 0);
	this.addlips = 0; this.addfingers = 0; this.addtits = 0; this.addsex = 0; this.addass = 0; this.addfeet = 0;
	this.addbody = 0; this.addsight = 0;
	
	var names = Object.keys(this.weapon);
	names.splice(0,4);
	for (var i = 0; i < names.length; i++) {
		this[names[i]] += this.weapon[names[i]];
	};
	
	names = Object.keys(this.armor);
	names.splice(0,4);
	for (var i = 0; i < names.length; i++) {
		this[names[i]] += this.armor[names[i]];
	};
	
	names = Object.keys(this.item);
	names.splice(0,4);
	for (var i = 0; i < names.length; i++) {
		this[names[i]] += this.item[names[i]];
	};
	
	names = Object.keys(this.flavorr);
	names.splice(0,4);
	for (var i = 0; i < names.length; i++) {
		this[names[i]] += this.flavorr[names[i]];
	};
	
	names = Object.keys(this.addiction);
	names.splice(0,4);
	for (var i = 0; i < names.length; i++) {
		this[names[i]] += this.addiction[names[i]];
	};
	
	this.atkbody = Math.ceil((this.atktits + this.atkass + this.atksex) / 3);
	this.defsight = Math.ceil((this.deftits + this.defass + this.defsex) / 3);
	
	var itemList = parseStringToIntArray(chara.ownedItems);
	this.equipment = [];														//ARREGLO DE OBJETOS
	for (var i = 0; i < itemList.length; i++) { this.equipment[i] = buscaId(items, itemList[i]); }
	
	this.updateStats = function() {
		this.atklips = parseInt(chara.atklips);
		this.atkfingers = parseInt(chara.atkfingers);
		this.atktits = parseInt(chara.atktits);
		this.atksex = parseInt(chara.atksex);
		this.atkass = parseInt(chara.atkass);
		this.atkfeet = parseInt(chara.atkfeet);
		this.deflips = parseInt(chara.deflips);
		this.deftits = parseInt(chara.deftits);
		this.defsex  = parseInt(chara.defsex);
		this.defass = parseInt(chara.defass);
		
		var names = Object.keys(this.weapon);
		names.splice(0,4);
		for (var i = 0; i < names.length; i++) {
			this[names[i]] += this.weapon[names[i]];
		};
		
		names = Object.keys(this.armor);
		names.splice(0,4);
		for (var i = 0; i < names.length; i++) {
			this[names[i]] += this.armor[names[i]];
		};
		
		names = Object.keys(this.item);
		names.splice(0,4);
		for (var i = 0; i < names.length; i++) {
			this[names[i]] += this.item[names[i]];
		};
		
		names = Object.keys(this.flavorr);
		names.splice(0,4);
		for (var i = 0; i < names.length; i++) {
			this[names[i]] += this.flavorr[names[i]];
		};
		
		names = Object.keys(this.addiction);
		names.splice(0,4);
		for (var i = 0; i < names.length; i++) {
			this[names[i]] += this.addiction[names[i]];
		};
	}
	
	this.dailyCheck = function() {
		var fecha = Date.now();
		var diferencia = fecha - this.lastpost;
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
	
	this.addGold = function(cantidad) {
		this.Gold += cantidad;
		chara.Gold = this.Gold;
	}
	
	this.giveItem = function(item) {
		this.equipment.push(item);
	}
	
	this.train = function(part) {
		if (chara.Gold >= 10 && (chara[part] === undefined || parseInt(chara[part]) < 5)) {
			chara[part] = (chara[part] === undefined ? 2 : parseInt(chara[part])) + 1;
			chara.Gold = parseInt(chara.Gold) - 10;
			this[part] = chara[part];
			return true;
		}
		return false;
	}
	
	this.indulge = function(part) {
		if (chara[part] === undefined || parseInt(chara[part]) > -3) {
			chara[part] = (chara[part] === undefined ? 0 : parseInt(chara[part])) - 1;
			chara.Gold = parseInt(chara.Gold) + 10;
			this[part] = chara[part];
			return true;
		}
		return false;
	}
	
	this.removeItem = function(item) {
		if (item.id == 0 || item.id == 100 || item.id == 200 || item.id == 300 || item.id == 400) { return false; }
		for (var i = 0; i < this.equipment.length; i++) {
			if (item == this.equipment[i]) {
				this.equipment.splice(i, 1);
				if (item.slot == "armor") { this.armor = buscaId(items,"0"); } 
				if (item.slot == "weapon") { this.weapon = buscaId(items,"100"); }
				if (item.slot == "item") { this.item = buscaId(items,"200"); }
				if (item.slot == "flavor") { this.flavorr = buscaId(items,"300"); }
				if (item.slot == "addiction") { this.addiction = buscaId(items,"400"); }
				return true;
			}
		}
		return false;
	}
	
	this.equip = function(item) {
		if (item.slot != null) {
			for (var i = 0; i < this.equipment.length; i++) {
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
		
		chara.wornArmor = this.armor.id;
		chara.wornWeapon = this.weapon.id;
		chara.wornItem = this.item.id;
		chara.wornFlavor = this.flavorr.id;
		chara.wornAddiction = this.addiction.id;
		chara.battlestoday = this.battlestoday;
		chara.lastpost = this.lastpost;
		
		var ownedItemsID = [];
		for (var i = 0; i < this.equipment.length; i++) { ownedItemsID[i] = this.equipment[i].id; }
		chara.ownedItems = ownedItemsID.toString();
		
		return chara;
	}
	
	//***************************************************************************************************************
	//	COMBATE
	//***************************************************************************************************************
	
	this.removeHP = function(cantidad) {
		this.HP -= cantidad;
		if (this.HP <= 0) {
			this.HP = 0;
			return true;
		}
		return false;
	}
}

//buscar por id
function buscaId(lista, nombre) {
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == nombre) {
            return lista[i];
        }
    }
    return -1;
}

function parseStringToIntArray(myString) {
    var myArray = myString.split(",");
    for (var i = 0; i < myArray.length; i++) {
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