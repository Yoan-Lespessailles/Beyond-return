// Class Monstre :
class Monstre extends Mob {
  constructor(nom, pv, force, dexterite, constitution, potentiel_degats, blocage, rang) {
    super(nom, pv, force, dexterite, constitution, potentiel_degats);
    this.blocage = blocage;
    this.rang = rang;
    this.pv_max = Math.round(this.pv_initial + 1.5 * this.constitution);
    this.pv_actuels = this.pv_max;
  }


  gain_or() {
    const multiplicateur_or = 5;

    let score_danger =
      this.force +
      this.dexterite +
      this.constitution +
      this.potentiel_degats;

    let base_or = score_danger * multiplicateur_or;

    let seuil = 30 - (5 * this.rang); // Pourcentage chance de ne rien drop, mais battre un monstre de rang élevé ne garanti pas forcément un récompense
    if (Math.random() * 100 < seuil) {
      return 0;
    }
    return Math.floor(Math.random() * base_or) + 1;
  }

  tirer_rarete(rang) {
    const roll = Math.random() * 100;

    if (roll < 5 + rang) return "epique";          // 1 % toujours possible
    if (roll < 15 + rang * 3) return "rare";
    if (roll < 40 + rang * 5) return "peu_commun";
    return "commun";
  }

  tirer_dans_table(table) {
    // Génération d’un nombre aléatoire entre 0 et (taille - 1)
    let index = Math.random() * table.length;
    index = Math.floor(index);

    let objet_tire = table[index];

    return objet_tire;
  }

  loot() {
    // 1. On regarde si le monstre lâche du loot
    let chance_loot = 35 + this.rang * 10;

    if (Math.random() * 100 > chance_loot) {
      return null;
    }

    // 2. On détermine quel type de loot lâche le monstre
    let roll_type = Math.random();
    let type;

    if (roll_type < 0.4) {
      type = "arme";
    } else if (roll_type < 0.7) {
      type = "armure";
    } else {
      type = "potion";
    }

    // 3. On détermine la rareté du loot
    const rarete = this.tirer_rarete(this.rang);

    // 4. On récupère aléatoirement le loot en fonction du type et de la rareté
    if (type == "arme") {
      return this.tirer_dans_table(loot_arme[rarete]);
    }

    if (type == "armure") {
      return this.tirer_dans_table(loot_armure[rarete]);
    }

    if (type == "potion") {
      return this.tirer_dans_table(loot_potion[rarete]);
    }

  }



}