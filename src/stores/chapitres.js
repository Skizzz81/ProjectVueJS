import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_chapters = [
  {
    id: 1,
    campagneId: 1,
    nom: "Chapitre 1",
    etat: "inactif",
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

  return {
    list
  };
});
