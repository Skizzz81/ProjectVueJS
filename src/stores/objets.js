import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_items = [
  {
    id: 1,
    nom: "Objet 1",
    description: "Description de l'objet.",
    commentaireMj: "Commentaire visible uniquement en mode MJ."
  },
  {
    id: 2,
    nom: "Objet 2",
    description: "Objet de recompense.",
    commentaireMj: "Commentaire visible uniquement en mode MJ."
  }
];

export const useItemsStore = defineStore("items", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("items") ?? "null") ?? default_items
  );

  watchEffect(() => {
    localStorage.setItem("items", JSON.stringify(list.value));
  });

  function trouverObjet(id) {
    return list.value.find((objet) => objet.id === id);
  }

  function dupliquerObjet(id) {
    const original = trouverObjet(id);
    if (!original) return { success: false, error: "objet introuvable" };

    const copie = {
      ...original,
      id: crypto.randomUUID(),
      nom: `${original.nom} (copie)`
    };
    list.value.push(copie);
    return { success: true, objet: copie };
  }

  return {
    list,
    trouverObjet,
    dupliquerObjet
  };
});
