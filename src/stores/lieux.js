import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_places = [
  {
    id: 1,
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

  return {
    list
  };
});
