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

  return {
    list,
    activeCampaignId
  };
});
