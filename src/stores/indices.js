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


  function genId() {
    return (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 9);
  }
  function trouverIndice(id) { return list.value.find(i => i.id === id); }
  function trouverIndexIndice(id) { return list.value.findIndex(i => i.id === id); }


  
  function ajouterIndice(data = {}){
    const indice = {
      id: data.id ?? genId(),
      nom: data.nom || "Nouvel indice",
      description: data.description || '',
      commentaireMj: data.commentaireMj || ''
    };
    list.value.push(indice);
    return { success: true, indice };
  }

  function modifierIndice(id, data = {}){
    const indice = trouverIndice(id);
    if(!indice) return { success: false, error: 'indice introuvable' };
    Object.assign(indice, data);
    return { success: true, indice };
  }

  function supprimerIndice(id){
    const index = trouverIndexIndice(id);
    if(index === -1) return { success: false, error: 'indice introuvable' };
    list.value.splice(index, 1);
    return { success: true };
  }

  return {
    list,
    trouverIndice,
    dupliquerIndice,
    trouverIndexIndice,
    ajouterIndice,
    modifierIndice,
    supprimerIndice
  };
});
