// Création des monstres

//rang 0 = rang très faible
const monstres_r0 = [
  new Monstre("Zombie",                    8, 0, 0, 0, 3, 0, 0),
  new Monstre("Cadavre gelé",             10, 0, 0, 1, 4, 0, 0),
  new Monstre("Araignée géante juvénile",  6, 1, 2, 0, 3, 0, 0),
  new Monstre("Os errants",                7, 1, 0, 0, 3, 0, 0)
];


//rang 1 = rang standard
const monstres_r1 = [
  new Monstre("Zombie armé",                18, 2, 0, 2, 5, 0, 1),
  new Monstre("Goule affamée",              16, 3, 2, 1, 6, 0, 1),
  new Monstre("Araignée géante adulte",     20, 3, 2, 2, 6, 0, 1),
  new Monstre("Squelette archer éclaireur", 14, 2, 1, 1, 5, 1, 1)
];

//rang 2 = rang intermédiaire
const monstres_r2 = [
  new Monstre("Guerrier squelette",       26, 4, 1, 3, 8, 0, 2),
  new Monstre("Garde des cryptes",        28, 4, 1, 4, 9, 0, 2),
  new Monstre("Dévoreur des cryptes",     24, 4, 2, 2, 8, 1, 2),
  new Monstre("Araignée des profondeurs", 30, 5, 2, 3, 9, 1, 2)
];

//rang 3 = rang difficile
const monstres_r3 = [
  new Monstre("Spectre des galeries",    22, 4, 4, 2, 10, 2, 3),
  new Monstre("Ombre d’un noble",        25, 5, 3, 3, 11, 2, 3),
  new Monstre("Chevalier spectral",      34, 5, 3, 4, 12, 2, 3),
  new Monstre("Horde de zombies",        38, 6, 2, 4, 11, 1, 3)
];

// rang 4 = rang élite (mini-boss)
const monstres_r4 = [
  new Monstre("Garde royal d’Eldran",    55, 7, 2, 6, 14, 0, 4),
  new Monstre("Champion ossuaire",       60, 8, 2, 7, 15, 0, 4),
  new Monstre("Spectre royal",           45, 7, 4, 5, 16, 2, 4)
];

// rang 5 = boss du donjon à implémenter dans un prochain temps pour une véritable fin
const monstres_r5 = [
  new Monstre(
    "Eldran, Roi Squelette",
    120,   // pv
    10,    // force
    4,     // dex
    10,    // constitution
    20,    // potentiel_degats
    2,     // blocage
    5      // rang
  )
];