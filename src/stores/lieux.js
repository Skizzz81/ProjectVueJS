import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_places = [
  {
    id: 1,
    nom: "Lieu 1",
    description: "Description du lieu.",
    joueurIds: [1]
  }
];

export const usePlacesStore = defineStore("places", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("places") ?? "null") ?? default_places
  );

  watchEffect(() => {
    localStorage.setItem("places", JSON.stringify(list.value));
  });

  function trouverLieu(id) {
    return list.value.find((lieu) => lieu.id === id);
  }

  function dupliquerLieu(id) {
    const original = trouverLieu(id);
    if (!original) return { success: false, error: "lieu introuvable" };

    const copie = {
      ...original,
      id: crypto.randomUUID(),
      nom: `${original.nom} (copie)`
    };
    list.value.push(copie);
    return { success: true, lieu: copie };
  }

  return {
    list,
    trouverLieu,
    dupliquerLieu
  };
});
