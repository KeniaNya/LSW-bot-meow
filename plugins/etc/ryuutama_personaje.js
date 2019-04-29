//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	CLASE DE PERSONAJE
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var requireNew = require('require-new');
var shop = require('./ryuutama_shop.js');
//var magic database = require...

function Personaje (data) {
	// {cosa1: valor, cosa2: valor..., selected: cosa1}
	Object.assign(this, JSON.parse(data[data.selected]));
	this.LOAD = this.STR + 2 + this.LVL + this.bonusLOAD;
	if (this.Changes == undefined) { this.Changes = { STR: 0, DEX: 0, INT: 0, SPI: 0, HP: 0, MP: 0 }; }
	//this.STR2 = this.STR-this.Changes.STR;
	//this.DEX2 = this.DEX-this.Changes.DEX;
	//this.INT2 = this.INT-this.Changes.INT;
	//this.SPI2 = this.SPI-this.Changes.SPI;
	//this.HP2  = this.HP -this.Changes.HP;
	//this.MP2  = this.MP -this.Changes.MP;
	for (stat in this.Changes) { this[stat+"2"] = this[stat] + this.Changes[stat]; }
	
	this.restoreStat = function(object) {
		if (this.Changes[object] === undefined) { return false; }
		this.Changes[object] = 0; return true;
	}
	this.restoreAll = function(object) { this.Changes = { STR: 0, DEX: 0, INT: 0, SPI: 0, HP: 0, MP: 0 }; }
	
	this.buy = function(object, value) {		
		let item = busca(shop, object); if (item == -1) { return false; }
		if (this.GOLD < item.Price * value) { return false; } else { this.GOLD -= item.Price * value; }
		for (let i = 0; i < value; i++) { this.Inventory.push(item); } return true;
	}
	
	this.give = function(object, value) {
		if (this[object] !== undefined) { this.Changes[object] += value; return true; } //si es un stat...
		let item = busca(shop, object); if (item == -1) { return false; }
		for (let i = 0; i < value; i++) { this.Inventory.push(item); } return true;  //si es un item...
	}
	
	this.giveOther = function(object, value) {
		let item = {Name: object};
		for (let i = 0; i < value; i++) { this.Inventory.push(item); } return true;  //si es un item...
	}
	
	this.removeItem = function(object, number) {
		let indice = -1;
		for (let i = 0; i < number; i++) {
			indice = busca2(this.Inventory, object); if (indice != -1) { this.Inventory.splice(indice, 1); continue; }
			indice = busca2(this.Weapons, object); if (indice != -1) { this.Weapons.splice(indice, 1); continue; }
			indice = busca2(this.Armor, object); if (indice != -1) { this.Armor.splice(indice, 1); continue; }
			indice = busca2(this.Shield, object); if (indice != -1) { this.Shield.splice(indice, 1); continue; }
			indice = busca2(this.Clothes, object); if (indice != -1) { this.Clothes.splice(indice, 1); continue; }
			return i;
		}
		return number;
	}
	
	this.removeOther = function(object) {
		let item = busca(this.Inventory, object);
		if (item != -1) { this.Inventory.splice(this.Inventory.indexOf(item),1); return true;} else { return false; }
	}
	
	this.set = function(object, value) {
		if (this[object] !== undefined) { this[object] = value; return true; }
		return false;
	}
	
	this.edit = function(object, value) {
		if (this.Editable.indexOf(object) == -1) { return false; }
		this[object] = value; return true;
	}
	
	this.equip = function(object) {
		let item = busca(this.Inventory, object); if (item == -1 || item.Slot === undefined) { return false; } //not found
		this.Inventory.splice(this.Inventory.indexOf(item),1);
		if (item.Slot != "Weapons" && this[item.Slot].length == 1) { this.Inventory.push(this[item.Slot].splice(0,1)[0]); }
		if (item.Slot == "Weapons" && this[item.Slot].length == 2) { this.Inventory.push(this[item.Slot].splice(0,1)[0]); }
		this[item.Slot].push(item);
		return true;
	}
	
	this.unequip = function(object) {
		let tempItem = busca(shop, object); if (tempItem == -1 || tempItem.Slot === undefined) { return false; } //doesn't exist or not equippable
		let item = busca(this[tempItem.Slot], object); if (item == -1) { return false; } //not found
		this.Inventory.push(this[item.Slot].splice(this[item.Slot].indexOf(item),1)[0]);
		return true;
	}
	
	this.addClass = function(clase) {
		this.Class = clase.Name;
		this.Habilities = this.Habilities.concat(clase.Habilities);
	}
	
	this.addArchetype = function(arche) {
		this.Archetype = arche.Name;
		this.Habilities = this.Habilities.concat(arche.Habilities);
		let bonuses = Object.keys(arche.Bonus);
		for (let i in bonuses) { this[bonuses[i]] += arche.Bonus[bonuses[i]]; }
	}
	
	this.addCharas = function(charas) {
		this.STR = charas[0];
		this.DEX = charas[1];
		this.INT = charas[2];
		this.SPI = charas[3];
		this.HP += (charas[0]-4)*2;
		this.MP += (charas[3]-4)*2;
	}
	
	this.roll = function(info) {
		//STR+DEX+bonus?
		info = info.trim().split(" ").join("").toUpperCase();
		let values = []; let signs = [1]; let last = 0;
		for (let i in info) {
			if (info[i] == "+" || info[i] == "-") {
				values.push(info.slice(last, i));
				last = parseInt(i)+1;
				signs.push(info[i] == "+" ? 1 : -1);
			}
		} values.push(info.slice(last));
		
		let suma = 0; let o = "[eicon]"; let c = "[/eicon]"; let text = " ";
		for (let i in values) {
			if (this[values[i]] !== undefined) {			//this is a stat
				let roll = dice(this[values[i]] + this.Changes[values[i]]);
				suma += roll * signs[i];
				text += o+roll+"_d"+(this[values[i]] + this.Changes[values[i]])+c;
				continue;
			}
			if (!isNaN(parseInt(values[i]))) {				//this is a number
				suma += parseInt(values[i]) * signs[i];
				text += (signs[i] == 1 ? "+" : "-") + parseInt(values[i]);
				continue;
			}
			return -999;
		}
		return text+" [color=cyan](Total: [b]"+suma+"[/b])[/color]";
	}
	
	this.saveFile = function() {
		let save = JSON.stringify(this);
		data[data.selected] = save;
		return data;
	}
	
}

function busca(lista, nombre) {
    for (let i in lista) {
		if (lista[i].Name.toLowerCase() == nombre.toLowerCase()) { return lista[i]; }
    }
    return -1;
}

function busca2(lista, nombre) {
    for (let i in lista) {
		if (lista[i].Name.toLowerCase() == nombre.toLowerCase()) { return i; }
    }
    return -1;
}

function dice(size) {
	return Math.ceil(Math.random()*size);
}

module.exports = Personaje;