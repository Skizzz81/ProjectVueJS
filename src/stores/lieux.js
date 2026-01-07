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

  function genId(){ return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9); }
  function trouverLieu(id){ return list.value.find(lieu => lieu.id === id); }
  function trouverIndexLieu(id){ return list.value.findIndex(lieu => lieu.id === id); }

  function ajouterLieu(data = {}){
    const lieu = {
      id: data.id ?? genId(),
      description: data.description || '',
      joueurIds: data.joueurIds || []
    };
    list.value.push(lieu);
    return { success: true, lieu };
  }

  function modifierLieu(id, data = {}){
    const lieu = trouverLieu(id);
    if(!lieu) return { success: false, error: 'lieu introuvable' };
    Object.assign(lieu, data);
    return { success: true, lieu };
  }

  function supprimerLieu(id){
    const index = trouverIndexLieu(id);
    if(index === -1) return { success: false, error: 'lieu introuvable' };
    list.value.splice(index, 1);
    return { success: true };
  }

  return {
    list,
    trouverLieu,
    trouverIndexLieu,
    ajouterLieu,
    modifierLieu,
    supprimerLieu
  };
});
