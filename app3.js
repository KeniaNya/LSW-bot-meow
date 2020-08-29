var magia = {}

magia.int = 1;

console.log(magia.int);


/*
var numero = 1;

var contador = 0;
var contador_viejo = 0;

while (contador < 100) {
	
	contador = 0;
	let n = numero;
	for (let i = n; i > 0; i--) {
		if (n % i == 0) {
			//console.log((n/i) + " x " + i + " = " + n);
			contador += 1;
			
		}
	}
	
	if (contador > contador_viejo) {
		contador_viejo = contador;
		contador = 0;
		let n = numero;
		for (let i = n; i > 0; i--) {
			if (n % i == 0) {
				console.log((n/i) + " x " + i + " = " + n);
				contador += 1;
				
			}
		}
	
		console.log("Contador: " + contador);
	}
	
	
	numero += 1;
}




*/




/*

var fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817, 39088169, 63245986, 102334155, 165580141, 267914296, 433494437, 701408733, 1134903170, 1836311903, 2971215073, 4807526976, 7778742049, 12586269025, 20365011074, 32951280099, 53316291173, 86267571272, 139583862445, 225851433717, 365435296162, 591286729879, 956722026041, 1548008755920, 2504730781961, 4052739537881, 6557470319842, 10610209857723, 17167680177565, 27777890035288, 44945570212853, 72723460248141, 117669030460994, 190392490709135, 308061521170129, 498454011879264, 806515533049393, 1304969544928657, 2111485077978050, 3416454622906707, 5527939700884757, 8944394323791464];

var dias_max = 0;
var x_max = 0;
var y_max = 0;

for (let x = -1000000; x < 1000000; x++) {
	for (let n = 0; n < 100; n++) {
		let s = solucion(x, n);
		if (s != "not integer") {
			//console.log("x: "+x+", y: "+s+", days: "+n);
			if (n > dias_max) { dias_max = n; x_max = x; y_max = s; }
		}
	}
}

console.log("Solucion - x: "+x_max+", y: "+y_max+", days: "+ (dias_max + 1));

function solucion(x, n) {
	let y = (1000000 - fibonacci[n] * x) / fibonacci[n - 1];
	if (y != Math.round(y)) { return "not integer"; }
	//if (y < 0) { return "not integer"; }
	return y;
}

*/

/*
function fibonacci(num) {
	if (num <= 1) return 1;
	return fibonacci(num - 1) + fibonacci(num - 2);
}
*/





/*

// carta en false es boca abajo

var cartas = [];
var cantidad = 4;

var pruebas = 10000;
var maximo = 0;

for (let j = 0; j < pruebas; j++) {
	
	//shuffle
	for (let i = 0; i < cantidad; i++) {
		let r = Math.floor(Math.random() * 2);
		let c = false;
		if (r == 1) { c = true; }
		cartas[i] = c;
	}

	let continua = true;
	let intentos = 0;
	let puntero = 0;
	let c1 = 0;
	let c2 = 0;
	let secuencia = [1,2,1,3,1,2,1,4,1,2,1,3,1,2,1];
	
	do {
		intentos++;
		
		//check if all the cards are face down
		let bandera = true;
		for (let i = 0; i < cantidad; i++) {
			if (cartas[i] == true) { bandera = false; }
		}
		if (bandera) { continua = false; }
		
		//console.log(intentos);
		//console.log(cartas);

		//grey code
		puntero = secuencia[c1] - 1;
		c1 += 1;
		
		cartas[puntero] = !cartas[puntero]
		
		//binary code (this part is commented)
		
		puntero += 1;
		secuencia[c1] -= 1;
		if (secuencia[c1] == 0) {
			c1 += 1;
			puntero = 0;
		}
		
		
	}
	while (continua)
	intentos -= 1;
	if (intentos > maximo) { maximo = intentos; }

}

console.log(maximo);

*/

/*
0000 
1000 1
1100 2
0100 1
0110 3
1110 1
1010 2
0010 1
0011 4
1011 1
1111 2
0111 1
0101 3
1101 1
1001 2
0001 1



*/


/*
var requireNew = require('require-new');
var jsonfile = require('jsonfile');
var Discord = require('fchatlib/node_modules/discord.io');
var auth = { token: "NjE3MTY4NDk2NzQ4NTI3NjM1.XWnN3Q.RcbMhF-UUNyuC0xvRt8Bpi7lAHs" };
var commandHandler = {};
var bot;

createPlugins();
connectDiscord();


function connectDiscord() {
	bot = new Discord.Client({ token: auth.token });
	bot.connect();
	bot.on('ready', function (evt) {
		console.log('Connected, logged in as: '+bot.username + ' - (' + bot.id + ')');
	});
	bot.on('message', function (user, userID, channelID, message, evt) {
		let userNick = bot.servers["495737115225751562"].members[userID].nick;
		if (userNick == undefined) { userNick = user; }
		//parent.sendMessage2(userNick+": "+message, getFlistRoom(channelID));
		console.log(userNick+": "+message);
		readMessage(userNick, message, channelID);
	});
	bot.on('disconnect', function(error, code) { setTimeout(bot.connect, 5000); });
	bot.envia = function (message, channelID) {
		bot.sendMessage({ to: channelID, message: message });
	}
}

function createPlugins() {
	fileName = process.cwd()+"/config/discord plugins.js";
	
	jsonfile.readFile(fileName, function(err, pluginsLoaded) {
		if (err) { return 0; }
        var pluginsPath = "";
		for (let i = 0; i < pluginsLoaded.length; i++) {
			pluginsPath = process.cwd()+"/discord plugins/"+pluginsLoaded[i].n+".js";
			
			var newHandler = requireNew(pluginsPath)(bot, pluginsLoaded[i].rooms);

			//lowercase alias
			for(var j = 0; j < Object.keys(newHandler).length; j++){
				if(Object.keys(newHandler)[j].toLowerCase() != Object.keys(newHandler)[j]){
					newHandler[Object.keys(newHandler)[j].toLowerCase()] = newHandler[Object.keys(newHandler)[j]];
				}
			}
			commandHandler = Object.assign(commandHandler,newHandler);
			
		}
	});
}

function readMessage(user, message, channelID) {
	if (message && message.length > 2 && message[0] == '!') {
		
        let opts = {
            command: String(message.split(' ')[0]).replace('!', '').trim().toLowerCase(),
            argument: message.substring(String(message.split(' ')[0]).length).trim()
        };
		console.log(user, message, channelID, opts.command, opts.argument);
        if (typeof commandHandler[opts.command] === 'function') {
            commandHandler[opts.command](opts.argument, user, channelID);
		}
	}
}

*/



