"use strict";

// Continuer la partie
verifier_sauvegarde()

ctn_partie.addEventListener("click", () => {
  charger_partie();

  menu.classList.remove("active");
  combat.classList.add("active");
  header.classList.remove("active");
});

// Passer du menu à nouvelle partie :
nv_partie.addEventListener("click", () => {

  // On supprime la sauvegarde
  localStorage.removeItem("sauvegarde_BR");

  // On reset la progression sinon on la garde puisqu'on actualise pas la page donc on actualise pas les valeurs
  kill = 0;
  joueur = null;
  ennemi = null;
  const log = document.querySelector(".combat-event-log");
  log.innerHTML = "";

  compteur_kill.textContent = "0";
  joueur_bourse.textContent = "0";

  menu.classList.remove("active");
  choix_perso.classList.add("active");

  // A utiliser pour remettre le le bouton continuer inaccessible
  verifier_sauvegarde();
});

// Passer de nouvelle partie à menu :
retour_nv_partie.addEventListener("click", () => {
  menu.classList.add("active");
  choix_perso.classList.remove("active");
});

// Passer de nouvelle partie à l'introduction du jeu :
valid_perso.addEventListener("click", () => {

  // Teste si le champ texte est vide
  if (input_nom.value.trim() === "") {
    alert("Veuillez saisir un nom de personnage !");
    input_nom.focus();
    return;
  }

  nom_perso = input_nom.value;

  [force, dexterite, constitution] = document.getElementById("repart-carac").value.split(',').map(Number);
  // split va découper la chaine séparée par une "," et placer chque élément dans un tableau. Le problème c'est que les éléments dans le tableau sont des strings or il nous faut des int donc on utilise map(number) 

  choix_perso.classList.remove("active");
  intro.classList.add("active");

})

// Passer de l'intro à la zone de combat :
commencer.addEventListener("click", () => {
  // Cacher et afficher du html :
  intro.classList.remove("active");
  combat.classList.add("active");
  header.classList.remove("active");
  video_village.classList.add("desactive-video");
  video_montagne.classList.remove("desactive-video");

  // Joueur :
  joueur = new Perso(nom_perso, pv_joueur, force, dexterite, constitution, or);
  maj_xp_ui();
  
  // Arme de départ aléatoire (commun)
  let arme_depart = arme_commun_aleatoire(loot_arme["commun"]);
  joueur.ajout_inventaire(arme_depart.clone());

  // TEST LOOT COULEURS
  // joueur.ajout_inventaire(loot_armure["peu_commun"][0]);
  // joueur.ajout_inventaire(loot_arme["rare"][0]);
  // joueur.ajout_inventaire(loot_arme["epique"][0]);
  
  // TEST SURCHARGE
  // for (let i = 0; i < 20; i++) {
  //   joueur.ajout_inventaire(loot_armure["peu_commun"][0].clone());
  // }

  for (let i = 0; i < 5; i++) {
    joueur.ajout_inventaire(loot_potion["commun"][0].clone());
  }

  joueur.equiper_arme(joueur.inventaire[0]);
  maj_inventaire();
  maj_poids_inventaire();

  maj_pv("joueur", joueur.pv_actuels, joueur.pv_max);
  maj_pv_max("joueur", joueur.pv_max);

  joueur_nom.textContent = joueur.nom;

  maj_stats_joueur()

  // Ennemi
  choix_ennemi();

  maj_pv("ennemi", ennemi.pv_actuels, ennemi.pv_max);
  maj_pv_max("ennemi", ennemi.pv_max);

  ennemi_nom.textContent = ennemi.nom;
  ennemi_rang.textContent = ennemi.rang;
  ennemi_blocage.textContent = libelle_blocage(ennemi.blocage);

  maj_stats_ennemi()

  // Initiative
  initiative();

})

// Retourner au menu principal
return_home.addEventListener("click", () => {
  combat.classList.remove("active");
  video_village.classList.remove("desactive-video");
  video_montagne.classList.add("desactive-video");
  menu.classList.add("active");
  header.classList.add("active");

  verifier_sauvegarde();
})

function ouvrir_choix_stat() {
  gain_niveau.classList.add("active");
  // XP + Gain de niveau
}

function fermer_choix_stat() {
  gain_niveau.classList.remove("active");
}

function arme_commun_aleatoire(table) {
  let index = Math.floor(Math.random() * table.length);
  return table[index];
}

// Ouvrir les chroniques
ouvrir_chroniques.addEventListener("click", () => {
  menu.classList.remove("active");
  classement.classList.add("active");
  afficher_classement();
});

// Fermer les chroniques
fermer_chroniques.addEventListener("click", () => {
  classement.classList.remove("active");
  menu.classList.add("active");
});