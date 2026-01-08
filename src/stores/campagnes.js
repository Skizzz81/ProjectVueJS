import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const default_campaigns = [
  {
    id: 1,
    nom: "Campagne de base",
    etat: "brouillon",
    description: "Exemple de campagne.",
    commentaireMj: "Commentaire visible uniquement en mode MJ.",
    joueurIds: [1],
    chapitreIds: [1]
  }
];

export const useCampaignsStore = defineStore("campaigns", () => {
  const list = ref(
    JSON.parse(localStorage.getItem("campaigns") ?? "null") ?? default_campaigns
  );
  const activeCampaignId = ref(
    JSON.parse(localStorage.getItem("activeCampaignId") ?? "null") ?? 1
  );

  watchEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(list.value));
    localStorage.setItem("activeCampaignId", JSON.stringify(activeCampaignId.value));
  });

  // Helpers
  function genId() {
    return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2,9);
  }

  function trouverCampaign(id) {
    return list.value.find((campagne) => campagne.id === id);
  }

  function trouverIndexCampaign(id) {
    return list.value.findIndex((campagne) => campagne.id === id);
  }

  // CRUD
  function ajouterCampagne(data = {}) {
    const campagne = {
      id: data.id ?? genId(),
      nom: data.nom || 'Nouvelle campagne',
      etat: data.etat || 'brouillon',
      description: data.description || '',
      commentaireMj: data.commentaireMj || '',
      joueurIds: data.joueurIds || [],
      chapitreIds: data.chapitreIds || []
    };
    list.value.push(campagne);
    return { success: true, campagne };
  }

  function modifierCampagne(id, data = {}) {
    const campagne = trouverCampaign(id);
    if (!campagne) return { success: false, error: 'campagne introuvable' };
    Object.assign(campagne, data);
    return { success: true, campagne };
  }

  function supprimerCampagne(id) {
    const index = trouverIndexCampaign(id);
    if (index === -1) return { success: false, error: 'campagne introuvable' };
    list.value.splice(index, 1);
    if (activeCampaignId.value === id) activeCampaignId.value = list.value[0]?.id ?? null;
    return { success: true };
  }

  return {
    list,
    activeCampaignId,
    trouverCampaign,
    trouverIndexCampaign,
    ajouterCampagne,
    modifierCampagne,
    supprimerCampagne
  };
});
