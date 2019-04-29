var r = []; //Welcome to the shop!

// 0 to 5 weapons
r.push({Name: "Unarmed",	Slot: "Weapons", Price: 0, Size: 0, Desc: "Unarmed or improvised weapons, both hands", ATK: "DEX + STR", DMG: "STR - 2"});
r.push({Name: "Light blades",Slot: "Weapons", Price: 400, Size: 1, Desc: "Precise but weak, single handed", ATK: "DEX + INT + 1", DMG: "INT - 1"});
r.push({Name: "Swords",		Slot: "Weapons", Price: 700, Size: 3, Desc: "A weapon with a good balance, single handed", ATK: "DEX + STR", DMG: "STR"});
r.push({Name: "Polearms",	Slot: "Weapons", Price: 350, Size: 3, Desc: "Powerful and versatile weapon, two handed", ATK: "DEX + STR", DMG: "STR + 1"});
r.push({Name: "Axes",		Slot: "Weapons", Price: 500, Size: 3, Desc: "Less precise but powerful, two handed", ATK: "STR + STR - 1", DMG: "STR"});
r.push({Name: "Bows", 		Slot: "Weapons", Price: 750, Size: 3, Desc: "Ranged weapon, two handed", ATK: "INT + DEX - 2", DMG: "DEX"});

// 6 to 9 armor
r.push({Name: "Clothes", Slot: "Armor", Price: 50, Size: 3, Def: 0, Penalty: 0, Desc: "Normal clothes. Thick, tough clothing is preferred by travelers. Generally they are made from wool and thread"});
r.push({Name: "Light armor", Slot: "Armor", Price: 900, Size: 3, Def: 1, Penalty: 0, Desc: "Armor constructed from the hide of animals, with metal plates covering vital points. Only the chest is protected, but because of its light weight it is easily worn"});
r.push({Name: "Medium armor", Slot: "Armor", Price: 2000, Size: 5, Def: 2, Penalty: -1, Desc: "Armor constructed from metal plates. The arms and legs are protected in addition to the chest area, but the weight increases proportionally"});
r.push({Name: "Heavy armor", Slot: "Armor", Price: 10000, Size: 5, Def: 3, Penalty: -3, Desc: "Heavy armor constructed from metal plates that completely covers the entire body. The body’s movement is restricted, so movement is hampered with the armor equipped"});

// 10 to 11 shields
r.push({Name: "Light shield", Slot: "Shield", Price: 400, Size: 3, Def: 1, Penalty: 0, Dodge: 7, Desc: "A shield that can be held in one hand. Made from wood and grass, its light weight keeps it from being a nuisance in battle"});
r.push({Name: "Heavy shield", Slot: "Shield", Price: 1200, Size: 3, Def: 2, Penalty: -1, Dodge: 9, Desc: "A shield large enough to cast half of the body in shadow. Most of them are made from metal; its heavy weight makes it hard to carry"});

// 12 to 17 Shoes
r.push({Name: "Rain boots", Slot: "Clothes", Price: 300, Size: 1, Desc: "+1 on Rain/Hard rain/Storm"});
r.push({Name: "Walking shoes", Slot: "Clothes", Price: 350, Size: 1, Desc: "+1 on a road"});
r.push({Name: "Climbing shoes", Slot: "Clothes", Price: 450, Size: 1, Desc: "+1 on Wasteland/Rocky Terrain/Mountain/Alpine"});
r.push({Name: "Snow boots", Slot: "Clothes", Price: 500, Size: 1, Desc: "+1 on Snow/Blizzard"});
r.push({Name: "Mud boots", Slot: "Clothes", Price: 500, Size: 1, Desc: "+1 on Swamp"});
r.push({Name: "Jungle boots", Slot: "Clothes", Price: 600, Size: 1, Desc: "+1 on Woods/Deep Forest/Jungle"});

// 18 to 23 Capes
r.push({Name: "Windbreaker", Slot: "Clothes", Price: 120, Size: 3, Desc: "+1 on Strong wind"});
r.push({Name: "Warm cape", Slot: "Clothes", Price: 160, Size: 3, Desc: "+1 on Cold"});
r.push({Name: "Raincoat", Slot: "Clothes", Price: 400, Size: 3, Desc: "+1 on Rain/Hard rain/Snow"});
r.push({Name: "Camo cape", Slot: "Clothes", Price: 400, Size: 3, Desc: "Hide check +1 for chosen Terrain"});
r.push({Name: "Fire cape", Slot: "Clothes", Price: 700, Size: 3, Desc: "-1 fire damage (ruined if wet)"});
r.push({Name: "Sun cape", Slot: "Clothes", Price: 400, Size: 3, Desc: "+1 to Hot"});

// 24 to 26 Staffs
r.push({Name: "Walking stick", Slot: "Clothes", Price: 50, Size: 3, Desc: "+1 on Level 3 or lower Terrain"});
r.push({Name: "Hiking staff", Slot: "Clothes", Price: 100, Size: 3, Desc: "+1 on Rocky terrain/Mountain"});
r.push({Name: "Snow staff", Slot: "Clothes", Price: 280, Size: 3, Desc: "+1 on Snow"});

// 27 to 30 Hats
r.push({Name: "Cap", Slot: "Clothes", Price: 120, Size: 1, Desc: "Hats and caps are believed to oﬀer protection from evil."});
r.push({Name: "Sun hat", Slot: "Clothes", Price: 180, Size: 1, Desc: "+1 on Hot"});
r.push({Name: "Woolen hat", Slot: "Clothes", Price: 200, Size: 1, Desc: "+1 on Cold"});
r.push({Name: "Sand hood", Slot: "Clothes", Price: 340, Size: 1, Desc: "+1 on Desert"});

// 31 to 32 Accessories
r.push({Name: "Googles", Slot: "Clothes", Price: 4000, Size: 1, Desc: "+1 on all Rain, Wind and Snow related conditions"});
r.push({Name: "Accessory", Slot: "Clothes", Price: 100, Size: 1, Desc: "Rings, earrings, bracelets, or any other decorative accessory"});

// 33 to 40 Services
r.push({Name: "Food (disgusting)", Price: 1, Desc: "-1 to next day’s Condition check"});
r.push({Name: "Food (normal)", Price: 3, Desc: "Normal food"});
r.push({Name: "Food (delicious)", Price: 30, Desc: "+1 to next day’s Condition check"});
r.push({Name: "Food (feast)", Price: 1500, Desc: "+3 to next day’s Condition check (Only sold in large cities)"});

r.push({Name: "Squalor", Price: 5, Desc: "Roll twice, take worst of next day’s Condition Check"});
r.push({Name: "Basic room", Price: 20, Desc: "Normal place to sleep"});
r.push({Name: "Suite", Price: 100, Desc: "+1 bonus to next day’s Condition Check"});
r.push({Name: "Royal suite", Price: 1200, Desc: "Roll twice, take best of next day’s Condition Check"});

// 41 to 45 Animals

r.push({Name: "Riding animal", Price: 900, Desc: "+1 bonus to travel checks on topographies of level 2 or less (1 person)"});
r.push({Name: "Large riding animal", Price: 3800, Desc: "+1 bonus to travel checks on topographies of level 2 or less (4 people)"});
r.push({Name: "Pack animal", Price: 500, Desc: "This animal has a carrying capacity of 15"});
r.push({Name: "Large pack animal", Price: 200, Desc: "This animal has a carrying capacity of 30"});
r.push({Name: "Pet animal", Price: 300, Desc: "A pet; Must be no larger than one meter. i.e.: cat, turtle, rabbig, etc"});

// 46 to 51 General items

r.push({Name: "Food", Price: 5, Size: 1, Desc: "A single day's ration of food (goes bad in 24 hours)"});
r.push({Name: "Alcohol", Price: 10, Size: 1, Desc: "If drunk when a character's condition is 3 or less, gain [Muddled,4]"});
r.push({Name: "Disgusting rations", Price: 5, Size: 1, Desc: "Disgusting but edible. If eaten when character's condition is 3 or less, lose half current MP"});
r.push({Name: "Rations", Price: 10, Size: 1, Desc: "Portable food that can be taken on a trip"});
r.push({Name: "Delicious rations", Price: 70, Size: 1, Desc: "When eaten, next day's condition check gains a +1 bonus"});
r.push({Name: "Animal feed", Price: 5, Size: 1, Desc: "Needed when taking animals to the barren desert or alpine enviroments"});

// 52 to 61 Camping equipment

r.push({Name: "Bedding", Price: 40, Size: 1, Desc: "Fleece, blankets, etc. to make bedding down more confortable"});
r.push({Name: "Sleeping bag", Price: 50, Size: 1, Desc: "A small portable bed suitable for a single person"});
r.push({Name: "Tent", Price: 120, Size: 3, Desc: "A tent large enough for 3 people"});
r.push({Name: "Artic tent", Price: 300, Size: 5, Desc: "A 3-man tent that gives shelter from the cold; +2 bonus to camping checks in cold weather"});
r.push({Name: "Large tent", Price: 500, Size: 5, Desc: "A tent large enough for 10 people"});
r.push({Name: "Flow stone", Price: 20, Size: 1, Desc: "Single use item that is used to warm bathwater up to 40 degrees C"});
r.push({Name: "Portable bath", Price: 450, Size: 5, Desc: "A bathtub that can be taken anywhere"});
r.push({Name: "Pillow", Price: 10, Size: 1, Desc: "Soft sleeping aid for those who can't sleep without one"});
r.push({Name: "Stuffed animal", Price: 100, Size: 1, Desc: "Stuffed doll in various shapes and sizes"});
r.push({Name: "Insect repellant candle", Price: 10, Size: 1, Desc: "Smelly candle that repels vermin and insects. Lasts for 12 hours"});

// 62 to 70 Containers

r.push({Name: "Waterskin", Price: 30, Size: 1, Desc: "A pouch of leather that can hold a day's ration of water"});
r.push({Name: "Magic jar", Price: 2000, Size: 1, Desc: "A magical jar that keeps cold liquids cold or hot liquids hot: +1 travel check in hot/cold weathers"});
r.push({Name: "Travel bag", Price: 10, Size: 1, Desc: "A bag held in 1 hand (Capacity: 3)"});
r.push({Name: "Belt pouch", Price: 30, Size: 1, Desc: "Only one can be equipped. Good when you want to be able to grab something quickly (Capacity 2)"});
r.push({Name: "Herb bottle", Price: 100, Size: 3, Desc: "Magically keeps up to ten herbs fresh; once opened for the first time, the bottle is good for seven days before it no longer works"});
r.push({Name: "Barrel", Price: 10, Size: 5, Desc: "Holds 15 days worth of water, or holds 10 size worth of other items"});
r.push({Name: "Backpack", Price: 20, Size: 3, Desc: "A rucksack used by many travelers (Capacity 5)"});
r.push({Name: "Large backpack", Price: 40, Size: 5, Desc: "Large rucksack that holds many items (Capacity 10)"});
r.push({Name: "Wooden chest", Price: 10, Size: 5, Desc: "If carried by a human, they take a -1 penalty to travel checks (Capacity 15)"});

//r.push({Name: "", Slot: "Clothes", Price: 300, Size: 1, Desc: ""});

module.exports = r;