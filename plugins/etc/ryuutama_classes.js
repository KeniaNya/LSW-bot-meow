//*****************************************************************************************************************************************
//*****************************************************************************************************************************************
//
//	Clases para ryuutama
//
//*****************************************************************************************************************************************
//*****************************************************************************************************************************************

var r = []; //trovador, mercader, sanador y cazador

r.push({
	Name: "Minstrel",
	Desc: "A traveler among travelers, minstrels trek from town to town while showing off their skill in song or dance. The Minstrel has various skills that can support the party in a variety of situations.",
	Habilities: [
		{Hability: "Well-traved", Stats: "-", Effects: "+1 to Journey Checks (Travel/Direction/Camping Checks; always in eﬀect)"},
		{Hability: "Traditions", Stats: "INT + INT", Effects: "You can get more information about the things you see and hear."},
		{Hability: "Music", Stats: "DEX + SPI", Effects: "Give all party members a +1 bonus to their next roll. Critical: +3 bonus. Fumble: Any PCs with Condition of 6 or less gain the [Muddled: 6] status eﬀect."}
	]
});

r.push({
	Name: "Merchant",
	Desc: "A traveling tradesman who exchanges goods from various locales for gold and jewels. The Merchant has skills that allow them to buy goods cheaply and sell them for a higher price. They are also good at negotiations using conversational skills.",
	Habilities: [
		{Hability: "Well-spoken", Stats: "-", Effects: "Negotiation Check [INT + SPI] gets +1, always in eﬀect"},
		{Hability: "Animal owner", Stats: "-", Effects: "You can keep 2 more animals for a total of 3 without paying for their food and water."},
		{Hability: "Trader", Stats: "INT + SPI", Effects: "You may buy items at a reduced price or sell items at an increased value.\nCheck result/Price change: 6-7/10%, 8-9/20%, 10-13/40%, 14-17/60%, 18+/80%"}
	]
});

r.push({
	Name: "Hunter",
	Desc: "An outdoorsman who makes their living from nature, using their wisdom, cunning and technology to bring down their prey. They are able to fnd food in any terrain while en route to their destination, and can even carve out the edible or useful parts of monsters.",
	Habilities: [
		{Hability: "Animal tracking", Stats: "STR + INT", Effects: "Find a monster’s location. +1 bonus to damage against any monsters found."},
		{Hability: "Trapping", Stats: "DEX + INT", Effects: "Harvest materials from a defeated Monster"},
		{Hability: "Hunting", Stats: "DEX + INT", Effects: "Receive a number of rations equal to Check result – target number, but cannot participate in the camp check. Critical: All food is Delicious. Fumble: Aficted by [Injury: 6] status eﬀect"}
	]
});

r.push({
	Name: "Healer",
	Desc: "A medic respected by all for their skill in using herbs to cure illnesses and heal injuries. You’ll want to make sure you have a Healer with you if you are traveling in dangerous areas.",
	Habilities: [
		{Hability: "Healing", Stats: "INT + SPI", Effects: "Spend 1 Healing herb and a target character recovers HP equal to the result of [INT + SPI]. During combat, recover only the result of [INT] (only 1 die.)"},
		{Hability: "First Aid", Stats: "INT + SPI", Effects: "Relieve a character’s status eﬀect for 1 hour. Then, reduce that status eﬀect’s strength permanently by a number equal to the Healer’s level."},
		{Hability: "Herb gathering", Stats: "STR + INT", Effects: "Find a single Healing Herb (Before travel). Critical: Find 3 Healing Herbs. Fumble: Aficted with [Poison: 6]"}
	]
});


module.exports = r;