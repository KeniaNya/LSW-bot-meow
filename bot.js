console.log("ok");

/* var message = `
[color=gray]══════════════════════════════════════════════════
                                 ⭐ ⭐ [color=red][b]Character card[/b][/color] ⭐ ⭐
══════════════════════════════════════════════════
[color=purple]                     [icon]Kenia Nya[/icon]
          [b]Name:[/b] Kenia Nya | [b]Money:[/b] $96.00 | [b]Stat points:[/b] 2 | [b]Wins/Losses:[/b] 85/46
          [b]Attack:[/b] 4 Lips, 6 Fingers, 3 Tits, 4 Sex, 2 Ass, 2 Feet.
          [b]Defense:[/b] 3 Lips, 5 Tits, 4 Sex, 7 Ass, 7 Feet.
          [b]Sextoy:[/b] [color=yellow]Epic Dildo of Penetration[/color]. +3 atk on fingers, For maximum impact!.
          [b]Outfit:[/b] [eicon]doronja_i[/eicon][eicon]doronja_d[/eicon][color=red]Kenia's Sexy Villainess Outfit~[/color]. +3 def on tits, +3 def on sex, +3 def on ass.
          [b]Accessory:[/b] Wristbands. Standard uniform.
          [b]Flavor item:[/b] None. Nothing equiped.
          [b]Level:[/b] 73 | [b]Total XP:[/b] 402800 | [b]XP for next level:[/b] 2424 | [b]XP gain on next battle:[/b] 7300[/color][/color]`

function fixBbcode (message) {
	message = message.split("/").join("");
	message = message.split("[b]").join("**");
	message = message.split("[icon]").join("*");
	message = message.split("[eicon]").join("*");
	message = message.split("[color]").join("");
	message = message.split("[color=").join("*");
	message = message.split("]").join("*");
	return message;
}

 
console.log(fixBbcode(message)); */

var meow = "good";
var nyan = "if it works";
var pj = {name:"meow"};
var test = "uh?";

var message = "this is a test to check the use of brackets...";

var result = "";


let corte1 = message.split("{");
result += corte1.splice(0,1)[0];
let temp = corte1.length;
for (let i = 0; i < temp; i++) {
	console.log(i);
	let corte2 = corte1.splice(0,1)[0].split("}");
	result += eval(corte2[0]) + corte2[1];
}

console.log(result);