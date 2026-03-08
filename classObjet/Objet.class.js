class Objet {
  constructor(nom, poids, valeur, rarete, type, equipable){
    this.nom=nom;
    this.poids=poids;
    this.valeur=valeur;
    this.rarete=rarete;
    this.type=type;
    this.equipable=equipable;
  }

  description(){
    return this.nom;
  }

}