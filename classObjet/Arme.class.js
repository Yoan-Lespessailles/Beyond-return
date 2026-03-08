class Arme extends Objet {
  constructor(nom, poids, valeur, rarete, type, type_degat, degats, blocage){
    super(nom, poids, valeur, rarete, type, true);
    this.type_degat=type_degat;
    this.degats=degats;
    this.equipe = false;
    this.blocage=blocage;
  }

  // Obligatoire sinon bug lorsque l'on veut changer d'armes ou équiper une arme que l'on a en double dans l'inventaire (pareil pour armure et les autres objets)
  clone() {
    return new Arme(
      this.nom,
      this.poids,
      this.valeur,
      this.rarete,
      this.type,
      this.type_degat,
      this.degats,
      this.blocage
    );
  }

  description(){
    return `Dégâts max : ${this.degats} (${this.type_degat}) ; Blocage : ${this.blocage}`;
  }
}