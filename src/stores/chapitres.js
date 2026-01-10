import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_chapters = [
  {
    id: 1,
    campagneId: 1,
    nom: "Chapitre 1",
    etat: "actif",
    description: "Description du chapitre.",
    commentaireMj: "Commentaire visible uniquement en mode MJ.",
    motPasseActivation: "secret",
    motPasseResolution: "final",
    queteIds: [1],
    recompenseObjetsIds: [2],
    recompenseIndicesIds: [1],
    objetsRequisIds: [1]
  }
];

export const useChaptersStore = defineStore("chapters", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("chapters") ?? "null") ?? default_chapters
  );

  watchEffect(() => {
    localStorage.setItem("chapters", JSON.stringify(list.value));
  });

  function trouverChapitre(id) {
    return list.value.find((chapitre) => chapitre.id === id);
  }

  function dupliquerChapitre(id) {
    const original = trouverChapitre(id);
    if (!original) return { success: false, error: "chapitre introuvable" };

    const copie = {
      ...original,
      id: crypto.randomUUID(),
      nom: `${original.nom} (copie)`
    };
    list.value.push(copie);
    return { success: true, chapitre: copie };
  }

  function genId() {
    return (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 9);
  }

  function trouverIndexChapitre(id) {
    return list.value.findIndex((chapitre) => chapitre.id === id);
  }

  function ajouterChapitre(data = {}) {
    const chapitre = {
      id: data.id ?? genId(),
      campagneId: data.campagneId ?? null,
      nom: data.nom || "Nouveau chapitre",
      etat: data.etat || "inactif",
      description: data.description || "",
      commentaireMj: data.commentaireMj || "",
      motPasseActivation: data.motPasseActivation || "",
      motPasseResolution: data.motPasseResolution || "",
      queteIds: data.queteIds || [],
      recompenseObjetsIds: data.recompenseObjetsIds || [],
      recompenseIndicesIds: data.recompenseIndicesIds || [],
      objetsRequisIds: data.objetsRequisIds || []
    };
    list.value.push(chapitre);
    return { success: true, chapitre };
  }

  function modifierChapitre(id, data = {}) {
    const chapitre = trouverChapitre(id);
    if (!chapitre) return { success: false, error: "chapitre introuvable" };
    Object.assign(chapitre, data);
    return { success: true, chapitre };
  }

  function supprimerChapitre(id) {
    const index = trouverIndexChapitre(id);
    if (index === -1) return { success: false, error: "chapitre introuvable" };
    list.value.splice(index, 1);
    return { success: true };
  }

  return {
    list,
    trouverChapitre,
    dupliquerChapitre,
    trouverIndexChapitre,
    ajouterChapitre,
    modifierChapitre,
    supprimerChapitre
  };
});
