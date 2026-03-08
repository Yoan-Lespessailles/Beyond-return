function est_mini_boss() {
  return kill > 0 && kill % 10 == 0;
}

function choix_ennemi() {

  const monstres_par_rang = {
    0: monstres_r0,
    1: monstres_r1,
    2: monstres_r2,
    3: monstres_r3,
    4: monstres_r4
  };

  let rang_selectionne;

  // Mini boss tous les 10 combats (rang 3 ou rang 4)
  if (est_mini_boss()) {

    // Plus le joueur avance, plus le rang 4 devient probable
    let chance_rang4 = Math.min(kill, 60);

    if (Math.random() * 100 < chance_rang4) {
      rang_selectionne = 4;
    } else {
      rang_selectionne = 3;
    }

  }
  // Combat standard
  else {

    let tirage = Math.random() * 100;

    // On change les probas tous les 5 kills
    // Pour que ce ne soit pas trop compliqué au début, on laisse 90% de chance de tomber sur un ennemi très faible
    if (kill < 5) {
      rang_selectionne = tirage < 90 ? 0 : 1;

    } else if (kill < 10) {
      if (tirage < 70) {
        rang_selectionne = 0;
      } else if (tirage < 90) {
        rang_selectionne = 1;
      } else {
        rang_selectionne = 2;
      }

    } else if (kill < 15) {
      if (tirage < 50) {
        rang_selectionne = 0;
      }
      else if (tirage < 75) {
        rang_selectionne = 1;
      }
      else if (tirage < 95) {
        rang_selectionne = 2;
      }
      else {
        rang_selectionne = 3;
      }

    } else {
      if (tirage < 20) {
        rang_selectionne = 0;
      }
      else if (tirage < 45) {
        rang_selectionne = 1;
      }
      else if (tirage < 75) {
        rang_selectionne = 2;
      }
      else {
        rang_selectionne = 3;
      }
    }
  }

  // Tirage du monstre dans le rang
  let liste = monstres_par_rang[rang_selectionne];
  let index = Math.floor(Math.random() * liste.length);
  ennemi = liste[index];

  // Mini-boss ou non 
  ennemi.estBoss = est_mini_boss();

  // On reset les PV dans le cas où on tombe sur le même ennemi sinon on tombe sur un ennemi avec 0 PV...
  ennemi.pv_actuels = ennemi.pv_max;
}


function initiative() {
  init_joueur = d20() + joueur.dexterite_effective();
  init_ennemi = d20() + ennemi.dexterite;
  combat_en_cours = true;

  if (init_joueur >= init_ennemi) {
    ajouter_msg("Vous remportez l'initiative ! Vous jouez en premier.");
    phase_joueur = 1;
    activer_btn_jr(phase_joueur);
  } else {
    ajouter_msg("L'ennemi remporte l'initiative ! Il joue en premier.");
    desactiver_btn_jr();
    setTimeout(tour_ennemi, 1500); // L'ennemi joue après 1.5s (à voir à la longue si on baisse pas)
  }

}

function activer_btn_jr(phase) {
  // Désactiver tous les boutons d'abord
  desactiver_btn_jr();

  // Activer selon la phase : 

  // Phase attaque
  if (phase == 1) {
    document.querySelector('button[data-action="attaque"]').disabled = false;
  }

  // Phase defense
  if (phase == 0) {

    let blocage_ennemi = ennemi.blocage;
    let blocage_joueur = joueur.blocage_joueur();

    // L'esquive est possible dans tous les cas
    document.querySelector('button[data-action="esquive"]').disabled = false;

    // Contre possible si arme.blocage > ennemi.blocage
    if (blocage_joueur > blocage_ennemi) {
      document.querySelector('button[data-action="contre"]').disabled = false;
    }

  }
}

function desactiver_btn_jr() {
  document.querySelectorAll(".combat-actions button").forEach(btn => {
    btn.disabled = true;
  });
}

function activer_btn_inv() {
  document.querySelector('button[data-action="inventaire"]').disabled = false;
}

function ajouter_msg(message) {
  let log = document.querySelector(".combat-event-log");

  let p = document.createElement("p");

  p.innerHTML = message; //si p.textcontent la balise <b> ne fonctionne pas
  log.appendChild(p);
  log.scrollTop = log.scrollHeight; // Scroll automatique vers le bas
}

// Bouton Attaquer
document.querySelector('button[data-action="attaque"]').addEventListener('click', () => {
  if (phase_joueur == 0) return;

  let jet_attaque = joueur.attaquer();

  ajouter_msg(`Vous lancez une attaque ! (jet: ${jet_attaque.jet} + force ${jet_attaque.force} = ${jet_attaque.resultat})`);

  let defense_ennemi = ennemi.esquiver();
  ajouter_msg(`L'ennemi se défend ! (jet: ${defense_ennemi.jet} + dexterite ${defense_ennemi.dexterite} = ${defense_ennemi.resultat})`);

  if (jet_attaque.resultat > defense_ennemi.resultat) {
    let degats = joueur.infliger_degats();

    ennemi.subir_degats(degats.resultat);

    ajouter_msg(`Vous infligez (jet: ${degats.jet} + force ${degats.force} = ${degats.resultat} dégats !)`);

    maj_pv("ennemi", ennemi.pv_actuels, ennemi.pv_max);

    if (ennemi.est_mort()) {
      fin_combat("victoire");
      return;
    }
  } else {
    ajouter_msg("Votre attaque échoue !");
  }

  phase_joueur = 0;
  // Fin du tour du joueur
  fin_tour_jr();
});

// Bouton Contre
document.querySelector('button[data-action="contre"]').addEventListener('click', () => {
  if (phase_joueur == 1) return;

  let jet_defense = joueur.parer();

  ajouter_msg(`Vous tentez un contre !
  (jet: ${jet_defense.jet} + force ${jet_defense.force} = ${jet_defense.resultat})`);

  if (window.attaque_ennemie_en_cours > jet_defense.resultat) {
    let degats = ennemi.infliger_degats();

    joueur.subir_degats(degats.resultat);

    ajouter_msg(`Vous n'arrivez pas à parer l'ennemi, vous subissez (jet: ${degats.jet} + force ${degats.force} = ${degats.resultat} dégats !)`);

    maj_pv("joueur", joueur.pv_actuels, joueur.pv_max);

    if (joueur.est_mort()) {
      fin_combat("defaite");
      return;
    }

  } else {
    ajouter_msg("Vous réussisez à parer l'attaque !");
  }

  phase_joueur = 1;
  fin_tour_jr();
});

// Bouton Esquive
document.querySelector('button[data-action="esquive"]').addEventListener('click', () => {
  if (phase_joueur == 1) return;

  let jet_esquive = joueur.esquiver();

  ajouter_msg(`Vous tentez d'esquiver ! (jet: ${jet_esquive.jet} + dex ${jet_esquive.dexterite} = ${jet_esquive.resultat})`);

  if (window.attaque_ennemie_en_cours > jet_esquive.resultat) {
    let degats = ennemi.infliger_degats()

    joueur.subir_degats(degats.resultat);

    ajouter_msg(`Vous n'arrivez pas à parer l'ennemi, vous subissez (jet: ${degats.jet} + force ${degats.force} = ${degats.resultat} dégats !)`);

    maj_pv("joueur", joueur.pv_actuels, joueur.pv_max);

    if (joueur.est_mort()) {
      fin_combat("defaite");
      return;
    }

  } else {
    ajouter_msg("Vous réussisez à esquiver l'attaque !");
  }

  phase_joueur = 1;
  fin_tour_jr();
});

//Mise à jour des PV
function maj_pv(qui, pv_actuels, pv_max) {

  let pourcentage = Math.round((pv_actuels / pv_max) * 100);

  if (qui == "joueur") {
    pv_bar = joueur_pv_bar;
    pv_fill = joueur_pv_fill;
    pv_act = joueur_pv_actuels;

    inventaire_pv_actuels.textContent = joueur.pv_actuels;

  } else {
    pv_bar = ennemi_pv_bar;
    pv_fill = ennemi_pv_fill;
    pv_act = ennemi_pv_actuels;
  }

  pv_bar.setAttribute("aria-valuenow", pv_actuels);
  pv_fill.setAttribute("data-current", pv_actuels);

  pv_fill.style.width = pourcentage + "%";

  // Couleur de la barre de PV :
  if (pourcentage > 75) {
    pv_fill.style.backgroundColor = "#2ecc71"; // vert
  }
  else if (pourcentage > 60) {
    pv_fill.style.backgroundColor = "#a4e72d"; // vert-jaune
  }
  else if (pourcentage > 50) {
    pv_fill.style.backgroundColor = "#f1c40f"; // jaune
  }
  else if (pourcentage > 30) {
    pv_fill.style.backgroundColor = "#f39c12"; // orange
  }
  else {
    pv_fill.style.backgroundColor = "#e74c3c"; // rouge
  }

  pv_act.textContent = pv_actuels;

}

function maj_pv_max(qui, pv_max) {
  if (qui == "joueur") {
    pv_bar = joueur_pv_bar;
    pv_fill = joueur_pv_fill;
    pv_maximum = joueur_pv_max;

    inventaire_pv_max.textContent = joueur.pv_max;

  } else {
    pv_bar = ennemi_pv_bar;
    pv_fill = ennemi_pv_fill;
    pv_maximum = ennemi_pv_max;
  }

  pv_bar.setAttribute("aria-valuemax", pv_max);

  pv_fill.setAttribute("data-max", pv_max);

  pv_maximum.textContent = pv_max;

}

function fin_tour_jr() {
  desactiver_btn_jr();

  if (phase_joueur == 0) {
    setTimeout(tour_ennemi, 1500); // L'ennemi joue après 1.5s comme au dessus
  } else {
    activer_btn_jr(phase_joueur);
  }

}

function tour_ennemi() {
  if (!combat_en_cours) return;

  // L'ennemi décide d'attaquer
  let attaque_ennemi = ennemi.attaquer();
  ajouter_msg(`L'ennemi attaque ! (jet: ${attaque_ennemi.jet} + force ${attaque_ennemi.force} = ${attaque_ennemi.resultat})`);

  activer_btn_jr(phase_joueur);

  // Stocker l'attaque ennemie pour la résolution
  window.attaque_ennemie_en_cours = attaque_ennemi.resultat;
}

function fin_combat(resultat) {
  combat_en_cours = false;
  desactiver_btn_jr();
  activer_btn_inv();

  if (resultat == "victoire") {
    ajouter_msg("🎉 Vous avez vaincu l'ennemi !");
    prochain_combat.hidden = false;

    // Compteur de kills
    kill += 1;
    compteur_kill.textContent = kill;

    // Or
    let or_gagne = ennemi.gain_or();
    ajouter_msg(joueur.maj_or(or_gagne));

    // Loot
    let loot_gagne = ennemi.loot();
    if (loot_gagne != null) {
      let loot_copie = loot_gagne.clone();
      joueur.ajout_inventaire(loot_copie);
      maj_inventaire();
      maj_poids_inventaire();
      ajouter_msg(`Vous avez récupérer un équipement <b>${loot_copie.rarete}</b> : ${loot_copie.nom}`)
    }

    // Exp
    joueur.gagner_exp(ennemi.rang);

    dernier_ennemi = {
      nom: ennemi.nom,
      rang: ennemi.rang,
      force: ennemi.force,
      dexterite: ennemi.dexterite,
      constitution: ennemi.constitution,
      blocage: ennemi.blocage,
      pv_max: ennemi.pv_max
    };

    // Sauvegarde
    sauvegarder_partie();

    // Continuer ou sortir tous les 10 kills
    if (ennemi.estBoss) {
      fenetre_sortie.classList.add("active");
    }

  } else {

    desactiver_btn_jr();
    ajouter_msg("💀 Vous avez été vaincu... contemplez votre mort, elle est définitive...");
    enregistrer_run("mort");

    setTimeout(() => {
      // On quitte la partie pour arriver au classement
      quitter_montagne();
    }, 2000);

    // On supprime la sauvegarde pour désactiver le bouton continuer
    localStorage.removeItem("sauvegarde_BR");
  }

}

function combat_suivant() {
  prochain_combat.hidden = true;
  choix_ennemi();

  maj_pv_ennemi_ui()

  document.getElementById("ennemi-nom").textContent = ennemi.nom;
  ennemi_rang.textContent = ennemi.rang;
  ennemi_blocage.textContent = libelle_blocage(ennemi.blocage);

  maj_stats_ennemi()

  initiative();
}

prochain_combat.addEventListener("click", () => {
  combat_suivant();
})

function appliquer_gain_stat(stat) {

  if (stat == "force") {
    joueur.force++;
  }

  if (stat == "dexterite") {
    joueur.dexterite++;
  }

  if (stat == "constitution") {
    joueur.constitution++;
  }

  ajouter_msg(`🧬 +1 ${stat}`);

  // MAJ pv max en cas d'augmentation de constitution 
  joueur.maj_pv_max_jr();

  // UI
  maj_stats_joueur();
  maj_pv_joueur_ui()

  fermer_choix_stat();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-stat");
  if (!btn) return;

  const stat = btn.dataset.upgrade;
  appliquer_gain_stat(stat);
});

function maj_xp_ui() {
  joueur_niveau.textContent = joueur.niveau;
  joueur_xp_actuelle.textContent = joueur.exp;
  joueur_xp_max.textContent = joueur.xp_pour_niveau_suivant();
}

function maj_stats_joueur() {
  joueur_force.classList.toggle("malus", joueur.malus_force > 0);
  joueur_dexterite.classList.toggle("malus", joueur.malus_dexterite > 0);

  joueur_force.textContent = "⚔️ " + joueur.force_effective();
  joueur_dexterite.textContent = "🦶 " + joueur.dexterite_effective();
  joueur_constitution.textContent = "🛡️ " + joueur.constitution
}

function maj_stats_ennemi() {
  ennemi_force.textContent = "⚔️ " + ennemi.force;
  ennemi_dexterite.textContent = "🦶 " + ennemi.dexterite;
  ennemi_constitution.textContent = "🛡️ " + ennemi.constitution;
}

function maj_pv_joueur_ui() {
  maj_pv("joueur", joueur.pv_actuels, joueur.pv_max);
  maj_pv_max("joueur", joueur.pv_max);
}

function maj_pv_ennemi_ui() {
  maj_pv("ennemi", ennemi.pv_actuels, ennemi.pv_max);
  maj_pv_max("ennemi", ennemi.pv_max);
}

function libelle_blocage(blocage) {
  if (blocage == 0) {
    return "Parade possible";
  }
  if (blocage == 1) {
    return "Parade limitée";
  }
  if (blocage == 2) {
    return "Parade impossible";
  }
  return "";
}

function quitter_montagne() {
  video_village.classList.remove("desactive-video");
  video_montagne.classList.add("desactive-video");
  combat.classList.remove("active");
  header.classList.add("active");
  classement.classList.add("active");
  afficher_classement()
}

fuir_montagne.addEventListener("click", () => {
  fenetre_sortie.classList.remove("active");
  ajouter_msg("Vous avez décider de quitter cet enfer...");
  enregistrer_run("sorti");
  setTimeout(() => {
    // On quitte la partie pour arriver au classement
    quitter_montagne();
  }, 2000);

  // On supprime la sauvegarde pour désactiver le bouton continuer
  localStorage.removeItem("sauvegarde_BR");
})

rester_montagne.addEventListener("click", () => {
  ajouter_msg("Vous vous enfoncez plus profondément dans la montagne...");
  fenetre_sortie.classList.remove("active");
})