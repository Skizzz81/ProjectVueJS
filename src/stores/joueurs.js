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

  function trouverJoueur(id) {
    return list.value.find((joueur) => joueur.id === id);
  }

  function dupliquerJoueur(id) {
    const original = trouverJoueur(id);
    if (!original) return { success: false, error: "joueur introuvable" };

    const copie = {
      ...original,
      id: crypto.randomUUID(),
      nom: `${original.nom} (copie)`
    };
    list.value.push(copie);
    return { success: true, joueur: copie };
  }

  return {
    list,
    trouverJoueur,
    dupliquerJoueur
  };
});
