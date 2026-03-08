// Création des armures :

const loot_armure = {

  commun: [
    // Armures légères
    new Armure("Tunique rembourrée", 2, 20, "armure légère", "Commun", 5),
    new Armure("Armure de cuir",     4, 40, "armure légère", "Commun", 8),

    // Armures intermédiaires
    new Armure("Chemise de mailles", 8, 90, "armure intermédiaire", "Commun", 10),
  ],

  peu_commun: [
    // Armures légères
    new Armure("Cuir bouilli",    5, 55, "armure légère", "Peu-commun", 12),
    new Armure("Cuir clouté",     6, 75, "armure légère", "Peu-commun", 13),

    // Armures intermédiaires
    new Armure("Haubert",                 10, 120, "armure intermédiaire", "Peu-commun", 14),
    new Armure("Cotte de mailles lourde", 12, 140, "armure intermédiaire", "Peu-commun", 16),

    // Armures lourdes
    new Armure("Plastron d'acier", 15, 180, "armure lourde", "Peu-commun", 18),
  ],

  rare: [
    // Armures légères
    new Armure("Armure tribale", 3, 60, "armure légère", "Rare", 20),

    // Armures intermédiaires
    new Armure("Armure lamellaire", 14, 180, "armure intermédiaire", "Rare", 24),

    // Armures lourdes
    new Armure("Cuirasse complète", 18, 220, "armure lourde", "Rare", 26),
    new Armure("Armure de plates",  20, 280, "armure lourde", "Rare", 30),
  ],

  epique: [
    // Armures lourdes
    new Armure("Armure royale", 22, 350, "armure lourde", "Epique", 35),
  ]
};
