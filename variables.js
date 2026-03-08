// Déclaration des variables :
const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const choix_perso = document.querySelector(".choix-perso");
const nv_partie = document.querySelector("#nv-partie");
const ctn_partie = document.querySelector("#ctn-partie")
const retour_nv_partie = document.querySelector(".choix-perso .retour");
const valid_perso = document.querySelector("#valid-perso");
const intro = document.querySelector(".intro");
const commencer = document.querySelector("#lancer-partie");
const combat = document.querySelector(".zone-combat");
const video_village = document.querySelector(".village");
const video_montagne = document.querySelector(".montagne");
const return_home = document.querySelector("#return-home");
const compteur_kill = document.querySelector("#kill-count");
const prochain_combat = document.querySelector("#prochain-combat");
const inventaire_fenetre = document.querySelector(".inventaire-fenetre");
const inventaire_fermer = document.querySelectorAll(".inventaire-fermer");
const inventaire_ouvrir = document.querySelector('button[data-action="inventaire"]');
const inventaire_pv_max = document.querySelector('#inventaire-pv-max');
const inventaire_pv_actuels = document.querySelector('#inventaire-pv-actuels');
const poids_actuel = document.querySelector('#poids-actuel');
const poids_max = document.querySelector('#poids-max');
const gain_niveau = document.querySelector('#overlay-niveau');
const ouvrir_chroniques = document.querySelector('#chroniques');
const classement = document.querySelector('#panneau-classement');
const fermer_chroniques = document.querySelector('#fermer_chroniques');
const fenetre_sortie = document.querySelector('#sortir-montagne');
const fuir_montagne = document.querySelector('.fuir-montagne');
const rester_montagne = document.querySelector('.rester-montagne');
const btn_trier = document.querySelector('.btn-tri');

const input_nom = document.querySelector("#nom");
const joueur_pv_bar = document.querySelector(".joueur .pv-bar");
const joueur_pv_fill = document.querySelector(".joueur .pv-fill");
const joueur_pv_max = document.querySelector(".joueur .pv-max");
const joueur_pv_actuels = document.querySelector(".joueur .pv-actuels");
const joueur_force = document.querySelector('.joueur [data-stat="FOR"]');
const joueur_dexterite = document.querySelector('.joueur [data-stat="DEX"]');
const joueur_constitution = document.querySelector('.joueur [data-stat="CON"]');
const joueur_bourse = document.querySelector('#or-joueur');
const joueur_niveau = document.querySelector('#joueur-niveau');
const joueur_xp_actuelle = document.querySelector('#xp-actuelle');
const joueur_xp_max = document.querySelector('#xp-max');
const joueur_nom = document.querySelector("#joueur-nom");

const ennemi_pv_bar = document.querySelector(".ennemi .pv-bar");
const ennemi_pv_fill = document.querySelector(".ennemi .pv-fill");
const ennemi_pv_max = document.querySelector(".ennemi .pv-max");
const ennemi_pv_actuels = document.querySelector(".ennemi .pv-actuels");
const ennemi_force = document.querySelector('.ennemi [data-stat="FOR"]');
const ennemi_dexterite = document.querySelector('.ennemi [data-stat="DEX"]');
const ennemi_constitution = document.querySelector('.ennemi [data-stat="CON"]');
const ennemi_rang = document.querySelector('#ennemi-rang');
const ennemi_blocage = document.querySelector('#ennemi-blocage');
const ennemi_nom = document.querySelector("#ennemi-nom");

let force, dexterite, constitution, nom_perso, pv_joueur_max, pv_joueur_actuels, ennemi, joueur;

let kill = 0;

let or = 0;

let pv_joueur = 20;

let phase_joueur = 0; // 1 = attaque et 0 = defense

let combat_en_cours = false;

function d20() {
  return Math.floor(Math.random() * 20) + 1;
}
