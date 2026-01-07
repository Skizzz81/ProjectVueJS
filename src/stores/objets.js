import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_items = [
  {
    id: 1,
    description: "Description de l'objet.",
    commentaireMj: "Commentaire visible uniquement en mode MJ."
  },
  {
    id: 2,
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

  return {
    list
  };
});
