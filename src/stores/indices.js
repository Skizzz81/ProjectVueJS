import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_clues = [
  {
    id: 1,
    nom: "Indice 1",
    description: "Description de l'indice.",
    commentaireMj: "Commentaire visible uniquement en mode MJ."
  }
];

export const useCluesStore = defineStore("clues", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("clues") ?? "null") ?? default_clues
  );

  watchEffect(() => {
    localStorage.setItem("clues", JSON.stringify(list.value));
  });

  function trouverIndice(id) {
    return list.value.find((indice) => indice.id === id);
  }

  function dupliquerIndice(id) {
    const original = trouverIndice(id);
    if (!original) return { success: false, error: "indice introuvable" };

    const copie = {
      ...original,
      id: crypto.randomUUID(),
      nom: `${original.nom} (copie)`
    };
    list.value.push(copie);
    return { success: true, indice: copie };
  }

  return {
    list,
    trouverIndice,
    dupliquerIndice
  };
});
