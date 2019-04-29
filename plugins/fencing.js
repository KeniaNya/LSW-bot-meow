var fChatLibInstance;
var channel;
var hey = "[b][color=red][Hey!][/color][/b] ";
var info = "[b][color=cyan][Info][/color][/b] ";
var started;
var characters;
var board;
var turn;
var turnCount;

module.exports = function (parent, chanName) {
    fChatLibInstance = parent;

    var cmdHandler = {};
    channel = chanName;
	started = false;
	characters = [];
	board = [1,0,0,0,0,0,0,0,0,0,0,0,0,
			 0,
			 0,0,0,0,0,0,0,0,0,0,0,0,2]; //centro index 13
	turn = 1;
	turnCount = 12;
	
	cmdHandler.fencing_join = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't join in the middle of a game.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice > -1) { fChatLibInstance.sendMessage(hey+data.character+" has already joined.", channel); return 0; }
		characters.push({name: data.character, dice: "[color=yellow]None yet[/color]"});
		fChatLibInstance.sendMessage(info+data.character+" has joined.", channel);
		if (characters.length == 2) { cmdHandler.fencing_start("", data); }
	}
	
	cmdHandler.fencing_leave = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't leave in the middle of a game, end the game first.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice == -1) { fChatLibInstance.sendMessage(hey+data.character+" wasn't in.", channel); return 0; }
		characters.splice(indice, 1);
		fChatLibInstance.sendMessage(info + data.character + " has left.", channel);
	}
	
	cmdHandler.fencing_remove = function (args, data) {
		if (started) { fChatLibInstance.sendMessage(hey+"You can't remove a player in the middle of a game, end the game first.", channel); return 0; }
		let indice = busca(characters, args);
		if (indice == -1) { fChatLibInstance.sendMessage(hey + args + " wasn't in or wasn't found.", channel); return 0; }
		characters.splice(indice, 1);
		fChatLibInstance.sendMessage(info + args + " has been removed.", channel);
	}
	
	cmdHandler.fencing_players = function (args, data) {
		if (characters.length == 0) { fChatLibInstance.sendMessage(hey + "There are no players.", channel); return 0; }
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name; }
		fChatLibInstance.sendMessage(info+"Current players ("+characters.length+"): "+lista.join(", ")+".", channel);
	}
	
	cmdHandler.fencing_stop = function (args, data) {
		started = false;
		characters = [];
		board = [1,0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,0,0,0,0,
			 0,0,0,0,0,0,2];
		turn = 1;
		turnCount = 12;
		fChatLibInstance.sendMessage(info + "The game has ended.", channel);
	}
	
	cmdHandler.fencing_dice = function (args, data) {
		if (!started) { fChatLibInstance.sendMessage(hey+"There is no game going on.", channel); return 0; }
		let indice = busca(characters, data.character);
		if (indice == -1) { fChatLibInstance.sendPrivMessage(data.character, hey+"You are not in the game."); return 0; }
		let message = info+"Your dice are: "+s(characters[indice].dice)+".";
		fChatLibInstance.sendPrivMessage(data.character, message);
	}
	
	cmdHandler.fencing_start = function (args, data) {
		if (started == true) { fChatLibInstance.sendMessage(hey+"There's a game going on, end that game first.", channel); return 0; }
		if (characters.length < 2) { fChatLibInstance.sendMessage(hey+"You need at least 2 players.", channel); return 0; }
		
		//scramble people
		for (let i = characters.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let temp = characters[i];
			characters[i] = characters[j];
			characters[j] = temp;
		}
		
		//assign dice
		for (let i = 0; i < characters.length; i++) {
			characters[i].dice = rollDice();
			let message = info+"Your dice are: "+s(characters[i].dice)+".";
			fChatLibInstance.sendPrivMessage(characters[i].name, message);
		}
		started = true;
		let lista = []; for (let i = 0; i < characters.length; i++) { lista[i] = characters[i].name+"("+(i+1)+")"; }
		let message = "[b][color=green][Game has started!][/color][/b] Current players ("+characters.length+"): "+lista.join(", ")+".\n";
		message += status();
		fChatLibInstance.sendMessage(message, channel);
	}
	
	cmdHandler.fencing_move = function (args, data) {
		if (data.character != characters[turn-1].name) { fChatLibInstance.sendMessage(hey+"It's not your turn or you're not in the game.", channel); return 0; }
		number = parseInt(args);
		if (isNaN(number)) { fChatLibInstance.sendMessage(hey+"You have to put a number, example: !fencing_move 3", channel); return 0; }
		playerDice = characters[turn-1].dice;
		let found = playerDice.indexOf(number);
		let found2 = playerDice.indexOf(-number);
		if (found == -1 && found2 == -1) { fChatLibInstance.sendMessage(hey+"You don't have that number in your dice pool!", channel); return 0; }
		let p1 = board.indexOf(1);
		let p2 = board.indexOf(2);
		if (turn == 1) {
			if (p1+number >= p2 || p1+number < 0) { fChatLibInstance.sendMessage(hey+"You can't step or go behind your opponent or off the board", channel); return 0; }
			board[p1] = 0;
			board[p1+number] = 1;
		} else {
			if (p2-number <= p1 || p2-number > 26) { fChatLibInstance.sendMessage(hey+"You can't step or go behind your opponent or off the board", channel); return 0; }
			board[p2] = 0;
			board[p2-number] = 2;
		}
		found != -1 ? playerDice = playerDice.splice(found, 1) : playerDice = playerDice.splice(found2, 1)
		let message = info+characters[turn-1].name+" has moved!\n";
		turn == 1 ? turn = 2 : turn = 1;
		message += status();
		if (turn == 2) { turnCount -= 1; if (turnCount == 0) { /*trigger game end phase*/ } }
		fChatLibInstance.sendMessage(message, channel);
		cmdHandler.fencing_dice("", data);
		fencing_replenish();
		cmdHandler.fencing_dice("", {character:characters[turn-1].name});
	}
	
	/*Attack: A player may use up to three dice to attack, these dice must show the EXACT number of squares needed to reach the opponent's square. A single dice attack is a normal ATTACK, using 2 dice to attack is called a POWER ATTACK, using 3 dice is called an UNBLOCKABLE ATTACK. If the opponent cannot PARRY, they are hit and you score a point, ending the round.

Lunge: The third action is a special action called a LUNGE, this is somewhat like a MOVE and ATTACK at the same time. You use 1 dice and move that many spaces forwards, then spend up to three dice for an attack as normal. You MAY NOT move backwards as part of a lunge. The number used for the movement part of the lunge can be any legal move, except moving backwards, the number for the attack must be the correct number for your position after the movement. This attack is called a LUNGE, POWER LUNGE, or UNBLOCKABLE LUNGE, depending on how many dice you use for the attack.*/
	
	
	function status() {
		return b(board) + "\nIt's "+characters[turn-1].name+"("+turn+") turn! (Remaining actions: "+turnCount+")";
	}
	
	return cmdHandler;
};

function busca(lista, name) {
    for (let i = 0; i < lista.length; i++) { if (lista[i].name == name) { return i; } }
    return -1;
}

function rollDice() {
	let dice = [];
	for (let i = 0; i < 5; i++) { dice[i] = Math.ceil(Math.random()*6); }
	if (repeated(dice)) { return rollDice(); }
	return dice;
}

function s(dice) { return "[b]"+dice.join(", ")+"[/b]" }

function b(board) {
	let display = board;
	let newDisplay = [];
	for (let i = 0; i < display.length; i++) {
		if (i == 13) { newDisplay[i] = "[color=red]"+display[i]+"[/color]"; continue; }
		if (i % 2 == 0) { newDisplay[i] = "[color=blue]"+display[i]+"[/color]"; continue; }
		if (i % 2 == 1) { newDisplay[i] = "[color=yellow]"+display[i]+"[/color]"; continue; }
	}
	display = newDisplay.join("").split("0").join("█");
	return display;
}

function fencing_replenish() {
	while (characters[turn-1].dice.length < 5) {
		characters[turn-1].dice.push(Math.ceil(Math.random()*6));
	}
	if (repeated(characters[turn-1].dice)) { characters[turn-1].dice = rollDice(); }
}

function repeated(dice) {
	let temp = dice[0];
	let flag = false;
	for (let i = 1; i < dice.length; i++) {
		if (temp == dice[i]) { flag = true; }
	}
	return flag;
}