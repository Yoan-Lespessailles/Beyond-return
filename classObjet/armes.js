// Création des armes :

const loot_arme = {

  commun: [
    // Armes une main
    new Arme("Épée courte",   2, 30, "Commun", "Épée",  "Tranchant",  5, 1),
    new Arme("Gladius",       2, 35, "Commun", "Épée",  "Tranchant",  6, 1),
    new Arme("Dague simple",  1, 10, "Commun", "Dague", "Perforant",  3, 0),
    new Arme("Coutelas",      2, 20, "Commun", "Dague", "Perforant",  4, 0),
    new Arme("Hachette",      2, 25, "Commun", "Hache", "Tranchant",  5, 0),
    new Arme("Masse légère",  3, 28, "Commun", "Masse", "Contondant", 5, 0),
  ],

  peu_commun: [
    // Armes une main
    new Arme("Épée fine",       1.5, 45, "Peu-commun", "Épée",          "Tranchant",  8, 1),
    new Arme("Dague crantée",   1,   20, "Peu-commun", "Dague",         "Perforant",  6, 1),
    new Arme("Marteau de main", 3,   40, "Peu-commun", "Marteau léger", "Contondant", 7, 0),

    // Armes deux mains
    new Arme("Claymore",        5,  120, "Peu-commun", "Épée longue",   "Tranchant", 10, 1),

    // Armes exotiques
    new Arme("Wakizashi",       2,   90, "Peu-commun", "Wakizashi",     "Tranchant",  7, 1),
    new Arme("Tanto",           1,   50, "Peu-commun", "Dague",         "Perforant",  6, 0),
    new Arme("Bâton renforcé",  3,   40, "Peu-commun", "Bâton",         "Contondant", 6, 1),
  ],

  rare: [
    // Armes une main
    new Arme("Épée bouclier",   4,  80, "Rare", "Épée", "Tranchant", 6, 2),

    // Armes deux mains
    new Arme("Espadon",         6, 140, "Rare", "Épée longue",     "Tranchant", 12, 1),
    new Arme("Hache de guerre", 7, 110, "Rare", "Hache de guerre", "Tranchant", 11, 1),
    new Arme("Marteau de guerre",8,130, "Rare", "Marteau de guerre","Contondant",12, 1),

    // Armes exotiques
    new Arme("Katana",          3, 150, "Rare", "Katana",  "Tranchant", 10, 2),
    new Arme("Naginata",        5, 170, "Rare", "Naginata","Tranchant", 11, 1),
    new Arme("Fléau d'armes",   4, 100, "Rare", "Fléau",  "Contondant", 9, 0),
    new Arme("Couteaux-griffes",1,  60, "Rare", "Griffes","Perforant",  7, 0),
  ],

  epique: [
    // Armes deux mains
    new Arme("Bardiche",        6, 150, "Epique", "Bardiche", "Tranchant", 14, 1),
  ]
};
