<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ControleMjPanel from "../components/ControleMjPanel.vue";
import { useCampaignsStore } from "../stores/campagnes";

const router = useRouter();
const campaignsStore = useCampaignsStore();

const campagneActive = computed(() => {
  const activeCampaignId = campaignsStore.activeCampaignId;
  if (!activeCampaignId) return null;
  return campaignsStore.trouverCampaign(activeCampaignId);
});

function retourAuxCampagnes() {
  router.push({ name: "campagnes" });
}
</script>

<template>
  <section>
    <div class="header">
      <button @click="retourAuxCampagnes" class="back-btn">← Retour aux campagnes</button>
      <h2 v-if="campagneActive">{{ campagneActive.nom }}</h2>
      <h2 v-else>Aucune campagne active</h2>
    </div>

    <div v-if="!campagneActive" class="no-campaign">
      <p>Veuillez sélectionner une campagne active depuis la liste des campagnes.</p>
      <button @click="retourAuxCampagnes">Aller aux campagnes</button>
    </div>

    <div v-else class="campaign-info">
      <p><strong>État:</strong> {{ campagneActive.etat }}</p>
      <p v-if="campagneActive.description"><strong>Description:</strong> {{ campagneActive.description }}</p>
      <p v-if="campagneActive.commentaireMj"><strong>Commentaire MJ:</strong> {{ campagneActive.commentaireMj }}</p>
    </div>

    <ControleMjPanel v-if="campagneActive" />
  </section>
</template>

<style scoped>
section {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  padding: 8px 16px;
  background: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background: #555;
}

.campaign-info {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 24px;
}

.campaign-info p {
  margin: 8px 0;
}

.no-campaign {
  text-align: center;
  padding: 40px;
}

.no-campaign button {
  margin-top: 16px;
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.no-campaign button:hover {
  background: #359268;
}
</style>
