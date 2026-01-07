import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_clues = [
  {
    id: 1,
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

  return {
    list
  };
});
