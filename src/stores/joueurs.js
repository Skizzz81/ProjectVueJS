import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_players = [
  {
    id: 1,
    nom: "Joueur 1",
    etat: "vivant",
    commentaireMj: "Commentaire visible uniquement en mode MJ.",
    description: "Description du joueur.",
    inventaireObjetsIds: [1],
    inventaireIndicesIds: [1],
    lieuId: 1
  }
];

export const usePlayersStore = defineStore("players", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("players") ?? "null") ?? default_players
  );

  watchEffect(() => {
    localStorage.setItem("players", JSON.stringify(list.value));
  });

  function genId() { return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9); }
  function trouverJoueur(id) { return list.value.find(joueur => joueur.id === id); }
  function trouverIndexJoueur(id) { return list.value.findIndex(joueur => joueur.id === id); }

  function ajouterJoueur(data = {}){
    const joueur = {
      id: data.id ?? genId(),
      nom: data.nom || 'Nouveau joueur',
      etat: data.etat || 'vivant',
      commentaireMj: data.commentaireMj || '',
      description: data.description || '',
      inventaireObjetsIds: data.inventaireObjetsIds || [],
      inventaireIndicesIds: data.inventaireIndicesIds || [],
      lieuId: data.lieuId ?? null
    };
    list.value.push(joueur);
    return { success: true, joueur };
  }

  function modifierJoueur(id, data = {}){
    const joueur = trouverJoueur(id);
    if (!joueur) return { success: false, error: 'joueur introuvable' };
    Object.assign(joueur, data);
    return { success: true, joueur };
  }

  function supprimerJoueur(id){
    const index = trouverIndexJoueur(id);
    if (index === -1) return { success: false, error: 'joueur introuvable' };
    list.value.splice(index, 1);
    return { success: true };
  }

  return {
    list,
    trouverJoueur,
    trouverIndexJoueur,
    ajouterJoueur,
    modifierJoueur,
    supprimerJoueur
  };
});
