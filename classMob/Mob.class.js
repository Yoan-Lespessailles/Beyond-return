class Mob {
  constructor(nom, pv, force, dexterite, constitution, potentiel_degats) {
    this.nom = nom;
    this.pv_initial = pv;
    this.pv_actuels = pv;
    this.force = force;
    this.dexterite = dexterite;
    this.constitution = constitution;
    this.potentiel_degats = potentiel_degats;
  }

  // Méthode pour attaquer
  attaquer() {
    let jet = d20();

    let force;

    // Il faut faire en sorte de bien séparer force et force_effective puisque montre hérite de attaquer() mais n'a pas de méthode force_effective()
    if (typeof this.force_effective == "function") {
      force = this.force_effective();
    } else {
      force = this.force;
    }

    let resultat = force + jet;
    return { resultat, jet, force };
  }

  // Méthode pour esquiver
  esquiver() {
    let jet = d20();

    let dexterite;

    if (typeof this.dexterite_effective == "function") {
      dexterite = this.dexterite_effective();
    } else {
      dexterite = this.dexterite;
    }

    let resultat = dexterite + jet;
    return { resultat, jet, dexterite };
  }

  
  infliger_degats() {
    let jet = Math.floor(Math.random() * this.potentiel_degats) + 1;

    let force;

    if (typeof this.force_effective == "function") {
      force = this.force_effective();
    } else {
      force = this.force;
    }

    let resultat = force + jet;
    return { resultat, jet, force };
  }

  subir_degats(degats) {
    this.pv_actuels -= degats;
    if (this.pv_actuels < 0) this.pv_actuels = 0;
  }

  est_mort() {
    return this.pv_actuels <= 0;
  }

}