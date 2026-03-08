class Perso extends Mob {
  constructor(nom, pv, force, dexterite, constitution, or) {
    super(nom, pv, force, dexterite, constitution, 0);
    this.or = or;
    this.arme_equipee = null;
    this.armure_equipee = null;
    this.maj_pv_max_jr();
    this.inventaire = [];
    this.niveau = 1;
    this.exp = 0;
    this.malus_force = 0;
    this.malus_dexterite = 0;
  }

  parer() {
    let jet = d20();
    const force = this.force_effective();
    let resultat = force + jet;
    return { resultat, jet, force };
  }

  equiper_arme(arme) {
    if (this.arme_equipee != null) {
      this.arme_equipee.equipe = false;
    }
    this.arme_equipee = arme;
    arme.equipe = true;
    this.maj_potentiel_degats();
  }

  desequiper_arme() {
    if (this.arme_equipee != null) {
      this.arme_equipee.equipe = false;
      this.arme_equipee = null;
    }
    this.maj_potentiel_degats();
  }

  equiper_armure(armure) {
    if (this.armure_equipee != null) {
      this.armure_equipee.equipe = false;
    }
    this.armure_equipee = armure;
    armure.equipe = true;

    this.maj_pv_max_jr();

    maj_pv_joueur_ui();
  }

  desequiper_armure() {
    if (this.armure_equipee != null) {
      this.armure_equipee.equipe = false;
      this.armure_equipee = null;
    }
    this.maj_pv_max_jr();

    maj_pv_joueur_ui()
  }

  // Mise en place d'un ratio de vie pour éviter que le joueur ne puisse recharger ses PV en déséquipant une armure donnant plus de PV avec une armure donnant moins de PV
  maj_pv_max_jr() {
    // On calcule le ratio de vie
    let ratio_vie;
    if (this.pv_max > 0) {
      ratio_vie = this.pv_actuels / this.pv_max;
    } else {
      ratio_vie = 1;
    }

    // On recalcule les pv_max en y ajoutant le bonus d'armure
    let resistance = this.armure_equipee ? this.armure_equipee.defense : 0;

    // Modification des PV max si constitution modifiée
    this.pv_max = Math.round(
      this.pv_initial + 1.5 * this.constitution + resistance
    );

    // On réapplique le ratio aux pv actuels
    this.pv_actuels = Math.round(this.pv_max * ratio_vie);

    // On sécurise les pv actuels pour qui ne dépassent pas les pv max
    if (this.pv_actuels > this.pv_max) {
      this.pv_actuels = this.pv_max;
    }

  }

  maj_potentiel_degats() {
    if (this.arme_equipee != null) {
      this.potentiel_degats = this.arme_equipee.degats;
    } else {
      this.potentiel_degats = 0;
    }
  }

  infliger_degats() {
    let jet = 0
    let resultat = 0;
    if (this.potentiel_degats == 0) {
      resultat = this.force;

    } else {
      jet = Math.floor(Math.random() * this.potentiel_degats) + 1;
      resultat = this.force + jet;

    }

    return { resultat: resultat, jet: jet, force: this.force };
  }

  maj_or(or) {
    let message;
    this.or += or;
    joueur_bourse.textContent = this.or;

    if (or == 0) {
      message = "C'est monstrueux cette malchance, aucune pièce d'or à l'horizon"
    } else if (or < 0) {
      message = "Vous vous délestez de <b>" + Math.abs(or) + "</b> pièces d'or";
    } else {
      message = "Vous recevez <b>" + or + "</b> pièces d'or";
    }

    return message;

  }

  ajout_inventaire(objet) {
    this.inventaire.push(objet)
  }

  suppression_inventaire(objet) {
    let index = this.inventaire.indexOf(objet);
    if (index != -1) { // si on ne le met pas, il y a une erreur lorsque on clique trop rapidement sur le bouton jeter
      this.inventaire.splice(index, 1);
    }
    // splice permet de mettre à jours les indexs après suppression. Le 1 correspond au nombre d'éléments à supprimer
  }

  equiper(obj) {
    if (obj instanceof Arme) {
      this.equiper_arme(obj);
    }
    if (obj instanceof Armure) {
      this.equiper_armure(obj);
    }
  }

  desequiper(obj) {
    if (obj instanceof Arme) {
      this.desequiper_arme();
    }
    if (obj instanceof Armure) {
      this.desequiper_armure();
    }
  }

  utiliser(obj) {
    if (obj instanceof Potion) {
      const soin = obj.soigner(this);
      ajouter_msg(`🧪 Vous récupérez ${soin} PV.`);
      maj_pv("joueur", this.pv_actuels, this.pv_max);
    }

    // suppression de la potion après utilisation
    this.suppression_inventaire(obj);
  }

  poids_max() {
    return 10 + this.force * 10;
  }

  poids_actuel() {
    let total = 0;

    for (let obj of this.inventaire) {
      total += obj.poids;
    }

    return total;
  }

  xp_pour_niveau_suivant() {
    return 4 + this.niveau;
  }

  gagner_exp(montant) {
    // +1 pour garantir un gain minimum d'XP même sur les monstres de rang 0
    this.exp += (montant + 1);
    ajouter_msg(`✨ Vous gagnez ${montant + 1} point(s) d'expérience.`);

    while (this.exp >= this.xp_pour_niveau_suivant()) {
      this.exp -= this.xp_pour_niveau_suivant();
      this.monter_niveau();
    }
    maj_xp_ui();
  }

  monter_niveau() {
    this.niveau++;
    ajouter_msg(`⬆️ Vous passez niveau ${this.niveau} !`);

    maj_xp_ui();
    // ouverture d’un choix de stat
    ouvrir_choix_stat();
  }

  blocage_joueur() {

    // Si une arme est équipée et possède un blocage
    if (this.arme_equipee != null && this.arme_equipee.blocage != undefined) {
      return this.arme_equipee.blocage;
    }

    // Mains nues = blocage possible puisque règle arme.blocage > ennemi.blocage pour bloquer
    return 0;
  }

  force_effective() {
    return Math.max(0, this.force - this.malus_force);
  }

  dexterite_effective() {
    return Math.max(0, this.dexterite - this.malus_dexterite);
  }

}
