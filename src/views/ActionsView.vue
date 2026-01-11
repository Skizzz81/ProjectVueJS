<script setup>
import { ref, computed } from "vue";
import SelecteurJoueur from "../components/SelecteurJoueur.vue";
import ActionsJoueur from "../components/ActionsJoueur.vue";
import { useCampaignsStore } from "../stores/campagnes";

const joueurSelectionneId = ref(null);
const campaignsStore = useCampaignsStore();

const campagneActive = computed(() => {
  const id = campaignsStore.activeCampaignId?.value ?? campaignsStore.activeCampaignId;
  return campaignsStore.list.find((campagne) => String(campagne.id) === String(id));
});

const aucunJoueur = computed(() => {
  return !campagneActive.value || (campagneActive.value.joueurIds || []).length === 0;
});
</script>

<template>
  <div>
    <h1>Actions du joueur</h1>

    <SelecteurJoueur v-model="joueurSelectionneId" />

    <div v-if="aucunJoueur">
      <p>Aucun joueur dans la campagne active.</p>
    </div>

    <div v-else-if="!joueurSelectionneId">
      <p>Veuillez selectionner un joueur pour effectuer des actions</p>
    </div>

    <div v-else>
      <ActionsJoueur :joueurId="joueurSelectionneId" />
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 30px;
}

p {
  text-align: center;
  color: #95a5a6;
  padding: 40px;
  background: white;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
