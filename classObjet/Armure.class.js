class Armure extends Objet {
  constructor(nom, poids, valeur, type, rarete, defense){
    super(nom, poids, valeur, rarete, type, true);
    this.defense=defense;
    this.equipe=false;
  }
  
  clone() {
    return new Armure(
      this.nom,
      this.poids,
      this.valeur,
      this.type,
      this.rarete,
      this.defense
    );
  }

  description(){
    return `Bonus PV max : +${this.defense}`;
  }

}

