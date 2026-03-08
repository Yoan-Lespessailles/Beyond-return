class Potion extends Objet {
  constructor(nom, poids, valeur, rarete, soins) {
    super(nom, poids, valeur, rarete, "Potion", false);
    this.soins = soins;
  }

  soigner(joueur) {
    let soin = Math.floor(Math.random() * this.soins) + joueur.constitution + 1;
    joueur.pv_actuels += soin;

    if (joueur.pv_actuels > joueur.pv_max) {
      joueur.pv_actuels = joueur.pv_max;
    }

    return soin;
  }

  clone() {
    return new Potion(
      this.nom,
      this.poids,
      this.valeur,
      this.rarete,
      this.soins
    );
  }

  description(){
    return `Restaure jusqu’à ${this.soins} PV`;
  }

}

