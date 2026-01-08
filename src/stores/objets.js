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
  
  function genId() {
    return (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 9);
  }
  function trouverIndexObjet(id) {
    return list.value.findIndex((objet) => objet.id === id);
  }

  function ajouterObjet(data = {}) {
    const objet = {
      id: data.id ?? genId(),
      nom: data.nom || "Nouvel objet",
      description: data.description || "",
      commentaireMj: data.commentaireMj || ""
    };
    list.value.push(objet);
    return { success: true, objet };
  }

  function modifierObjet(id, data = {}){
    const objet = trouverObjet(id);
    if(!objet) return { success: false, error: 'objet introuvable' };
    Object.assign(objet, data);
    return { success: true, objet };
  }

  function supprimerObjet(id){
    const index = trouverIndexObjet(id);
    if(index === -1) return { success: false, error: 'objet introuvable' };
    list.value.splice(index, 1);
    return { success: true };
  }

  return {
    list,
    trouverObjet,
    dupliquerObjet,
    trouverIndexObjet,
    ajouterObjet,
    modifierObjet,
    supprimerObjet
  };
});
