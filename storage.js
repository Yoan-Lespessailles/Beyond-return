/*
 * SAUVEGARDE DE LA PARTIE (localStorage)
ATTENTION : On ne sauvegarde QUE des données simples
pas d'instances de classes sinon ça ne fonctionne pas et on s'arrache les cheveux
*/
function sauvegarder_partie() {

  const sauvegarde = {
    joueur: {
      nom: joueur.nom,
      force: joueur.force,
      dexterite: joueur.dexterite,
      constitution: joueur.constitution,

      pv_actuels: joueur.pv_actuels,
      pv_max: joueur.pv_max,

      or: joueur.or,
      niveau: joueur.niveau,
      exp: joueur.exp,

      inventaire: joueur.inventaire.map(item => ({
        classe: item.constructor.name, // class Objet + Arme, Armure, Potion
        data: {
          // Champs communs (class Objet)
          nom: item.nom,
          poids: item.poids,
          valeur: item.valeur,
          rarete: item.rarete,
          type: item.type,
          equipable: item.equipable,

          // Champs spécifiques (class Arme, Armure et Potion)
          type_degat: item.type_degat,
          degats: item.degats,
          blocage: item.blocage,
          defense: item.defense,
          soins: item.soins,
          equipe: item.equipe == true
        }
      }))
    },

    // Dernier ennemi vaincu
    dernier_ennemi: dernier_ennemi,

    // Peut être que j'aurais dû enregistrer kill dans la class Perso... A voir un jour
    progression: {
      kill: kill
    }
  };

  localStorage.setItem("sauvegarde_BR", JSON.stringify(sauvegarde));
}

/*
*CHARGEMENT DE LA PARTIE
Reconstruction des classes -> bug avant : je sauvegardais des instances de classes mais avec JSON.parse() les classes disparaissaient et les méthodes avec
*/

function charger_partie() {

  const data = localStorage.getItem("sauvegarde_BR");
  if (!data) return false;

  try {
    const sauvegarde = JSON.parse(data);

    // Sécurité minimale
    if (!sauvegarde.joueur) throw "Sauvegarde invalide";

    // Recréation du joueur (classe Perso)
    joueur = new Perso(
      sauvegarde.joueur.nom,
      sauvegarde.joueur.pv_max,
      sauvegarde.joueur.force,
      sauvegarde.joueur.dexterite,
      sauvegarde.joueur.constitution,
      sauvegarde.joueur.or
    );

    joueur.pv_actuels = sauvegarde.joueur.pv_actuels;
    joueur.pv_max = sauvegarde.joueur.pv_max;

    joueur.niveau = sauvegarde.joueur.niveau;
    joueur.exp = sauvegarde.joueur.exp;

    // Reconstruction de l'inventaire
    // Reset sécurité
    joueur.inventaire = [];
    joueur.arme_equipee = null;
    joueur.armure_equipee = null;

    // Reconstruction de l'inventaire
    sauvegarde.joueur.inventaire.forEach(item => {
      const d = item.data;
      let obj = null;

      switch (item.classe) {

        case "Arme":
          obj = new Arme(
            d.nom,
            d.poids,
            d.valeur,
            d.rarete,
            d.type,
            d.type_degat,
            d.degats,
            d.blocage
          );
          break;

        case "Armure":
          obj = new Armure(
            d.nom,
            d.poids,
            d.valeur,
            d.type,
            d.rarete,
            d.defense
          );
          break;

        case "Potion":
          obj = new Potion(
            d.nom,
            d.poids,
            d.valeur,
            d.rarete,
            d.soins
          );
          break;

        default:
          console.warn("Objet inconnu :", item.classe);
          return;
      }

      // Gestion de l'équipement
      if (d.equipe) {
        obj.equipe = true;
        if (obj instanceof Arme) joueur.arme_equipee = obj;
        if (obj instanceof Armure) joueur.armure_equipee = obj;
      }

      // On ajoute les objets possédé par le joueur dans l'inventaire
      joueur.inventaire.push(obj);

    });

    // État logique post-combat
    combat_en_cours = false;
    ennemi = null;

    // Boutons
    desactiver_btn_jr();
    activer_btn_inv();

    // Le joueur peut lancer un nouveau combat
    prochain_combat.hidden = false;

    // Progression
    kill = sauvegarde.progression.kill;
    compteur_kill.textContent = kill;

    // Mise à jour de l’interface
    joueur_nom.textContent = sauvegarde.joueur.nom;
    maj_inventaire();
    maj_pv("joueur", joueur.pv_actuels, joueur.pv_max);
    maj_pv_max("joueur", joueur.pv_max);
    maj_stats_joueur();
    maj_xp_ui();
    maj_poids_inventaire();

    // Dernier ennemi vaincu
    afficher_ennemi_vaincu(sauvegarde.dernier_ennemi);

    return true;

  } catch (e) {
    // Test
    console.error("Erreur de chargement de la sauvegarde :", e);
    localStorage.removeItem("sauvegarde_BR");
    return false;
  }
}

function verifier_sauvegarde() {
  ctn_partie.disabled = !localStorage.getItem("sauvegarde_BR");
}

function afficher_ennemi_vaincu(data) {

  // Nom
  ennemi_nom.textContent = data.nom;

  // Rang
  ennemi_rang.textContent = data.rang;

  // Caractéristiques
  ennemi_force.textContent = "⚔️ " + data.force;
  ennemi_dexterite.textContent = "🦶 " + data.dexterite;
  ennemi_constitution.textContent = "🛡️ " + data.constitution;
  ennemi_blocage.textContent = libelle_blocage(data.blocage);

  // PV figés à 0 puisque ennemi déjà mort
  maj_pv("ennemi", 0, data.pv_max);
  maj_pv_max("ennemi", data.pv_max);

}

function enregistrer_run(statut) {

  const run = {
    nom: joueur.nom,
    niveau: joueur.niveau,
    or: joueur.or + calculer_valeur_inventaire(),
    kills: kill,
    statut: statut, // "mort" ou "vivant"
    date: Date.now()
  };

  const classement = JSON.parse(
    localStorage.getItem("classement_runs")
  ) || [];

  classement.push(run);

  localStorage.setItem(
    "classement_runs",
    JSON.stringify(classement)
  );
}

function afficher_classement() {

  let classement;
  const data = localStorage.getItem("classement_runs");

  if (data) {
    classement = JSON.parse(data);
  } else {
    classement = [];
  }

  // Tri par date décroissante (plus récent en haut)
  classement.sort((a, b) => b.date - a.date);

  const tbody = document.querySelector("#classement-body");
  tbody.innerHTML = "";

  classement.forEach(run => {
    ajouter_ligne_classement(
      run.date,
      run.nom,
      run.niveau,
      run.or,
      run.kills,
      run.statut
    );
  });
}

function ajouter_ligne_classement(date, nom, niveau, or, kills, statut) {

  const tbody = document.querySelector("#classement-body");
  const tr = document.createElement("tr");

  const date_lisible = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  let statut_label;
  let statut_class;

  if (statut == "mort") {
    statut_label = "💀 Disparu";
    statut_class = "run-mort";
  } else {
    statut_label = "🚪 En vie...";
    statut_class = "run-sorti";
  }

  tr.innerHTML = `
    <td>${date_lisible}</td>
    <td>${nom}</td>
    <td>${niveau}</td>
    <td>🪙 ${or}</td>
    <td>☠️ ${kills}</td>
    <td class="${statut_class}">${statut_label}</td>
  `;

  tbody.appendChild(tr);
}

function calculer_valeur_inventaire() {
  let total = 0;

  for (let item of joueur.inventaire) {
    total += item.valeur;
  }

  return total;
}





