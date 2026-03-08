function ouvrir_inventaire() {
  inventaire_fenetre.classList.add("active");
  combat.classList.remove("active");
}

function fermer_inventaire() {
  inventaire_fenetre.classList.remove("active");
  combat.classList.add("active");
}

inventaire_ouvrir.addEventListener('click', () => {
  ouvrir_inventaire();
})

inventaire_fermer.forEach(btn => {
  btn.addEventListener('click', () => {
    fermer_inventaire();
  });
});

function maj_inventaire() {
  const tbody = document.getElementById("corpsInventaire");

  // On recrée tout l'inventaire sauf la bourse
  tbody.querySelectorAll("tr:not(.ligne-bourse)").forEach(tr => tr.remove());

  // Pour chaque objet dans l'inventaire, on créé les lignes de l'inventaire
  joueur.inventaire.forEach((obj, index) => {

    // On détermine le texte du bouton entre utliser et equiper/déséquiper
    let texte_action = "Utiliser";

    if (obj.equipable == true) {
      texte_action = obj.equipe ? "Déséquiper" : "Équiper";
    }

    const ligne = document.createElement("tr");

    ligne.innerHTML = `
      <td class="objet-nom objet-${obj.rarete}" title="${obj.description()}">${obj.nom}</td>
      <td class="objet-quantite">1</td>
      <td class="objet-type">${obj.type}</td>
      <td class="objet-equipable">${obj.equipable ? "✔" : "✖"}</td>
      <td class="objet-equipe">${obj.equipe ? "✔" : "✖"}</td>
      <td class="objet-poids">${obj.poids}</td>
      <td class="objet-valeur">${obj.valeur}</td>
      <td class="objet-actions">
        <button onclick="action_objet(${index})">${texte_action}</button>
        <button class="btn-danger" onclick="jeter_objet(${index})">Jeter</button>
      </td>
    `;

    tbody.appendChild(ligne);
  });
}


function action_objet(index) {
  const obj = joueur.inventaire[index];

  if (obj.equipable) {
    if (obj.equipe) {
      joueur.desequiper(obj);
    } else {
      joueur.equiper(obj);
    }
  } else {
    joueur.utiliser(obj);
  }

  maj_inventaire();
  maj_poids_inventaire();
}

function jeter_objet(index) {
  const obj = joueur.inventaire[index];

  if (obj.equipable && obj.equipe) {
    joueur.desequiper(obj);
  }

  joueur.suppression_inventaire(obj);

  maj_inventaire();
  maj_poids_inventaire();
}

function maj_poids_inventaire() {
  const actuel = joueur.poids_actuel();
  const max = joueur.poids_max();

  poids_actuel.textContent = actuel.toFixed(2);
  poids_max.textContent = max;

  calculer_malus_poids();
  maj_stats_joueur();
  maj_pv_joueur_ui();

  if (actuel > max) {
    poids_actuel.classList.add("surcharge");
  } else {
    poids_actuel.classList.remove("surcharge");
  }
}

function calculer_malus_poids() {

  const poids = joueur.poids_actuel();
  const max = joueur.poids_max();

  if (poids <= max) {
    joueur.malus_force = 0;
    joueur.malus_dexterite = 0;
    return;
  }

  const surcharge = poids / max;
  // Tous les 10% on réapplique le malus
  const paliers = Math.floor((surcharge - 1) / 0.10) + 1;

  joueur.malus_force = paliers;
  joueur.malus_dexterite = paliers;
}


// Tri de l'inventaire
let mode_tri = 0;
// 0 = armes
// 1 = armures
// 2 = potions

function type_objet(item) {
  if (item instanceof Arme) return "arme";
  if (item instanceof Armure) return "armure";
  if (item instanceof Potion) return "potion";
  return "autre";
}

function valeur_rarete(rarete) {
  switch (rarete) {
    case "Peu-commun": return 1;
    case "Rare": return 2;
    case "Epique": return 3;
    default: return 0;
  }
}

function trier_inventaire() {

  const priorite = ["arme", "armure", "potion"];
  const type_prioritaire = priorite[mode_tri];

  joueur.inventaire.sort((a, b) => {

  const ta = type_objet(a);
  const tb = type_objet(b);

  // Priorité au type sélectionné

  // Si a est du bon type et pas b alors on met a en avant
  if (ta == type_prioritaire && tb != type_prioritaire) return -1;

  // Si b est du bon type alors on met b avant
  if (tb == type_prioritaire && ta != type_prioritaire) return 1;

  // Regroupement par type
  const ordreType = { 
    arme: 0, 
    armure: 1, 
    potion: 2 
  };

  if (ta != tb) {
    return ordreType[ta] - ordreType[tb];
  }

  // Rareté (plus rare au moins rare)
  const rarete = valeur_rarete(b.rarete) - valeur_rarete(a.rarete);
  if (rarete != 0) return rarete;

  // Valeur (plus cher au moins cher)
  return b.valeur - a.valeur;
});

  // On passe au mode suivant en faisant une boucle
  mode_tri = (mode_tri + 1) % 3;

  maj_inventaire();
}

btn_trier.addEventListener("click", trier_inventaire);