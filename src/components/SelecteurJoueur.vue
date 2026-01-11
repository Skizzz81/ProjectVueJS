<script setup>
import { computed } from "vue";
import { usePlayersStore } from "../stores/joueurs";
import { useCampaignsStore } from "../stores/campagnes";

const playersStore = usePlayersStore();
const campaignsStore = useCampaignsStore();

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  }
});

const campagneActive = computed(() => {
  const id = campaignsStore.activeCampaignId?.value ?? campaignsStore.activeCampaignId;
  return campaignsStore.list.find((campagne) => String(campagne.id) === String(id));
});

const joueurs = computed(() => {
  if (!campagneActive.value) return [];
  const ids = new Set((campagneActive.value.joueurIds || []).map((id) => String(id)));
  return playersStore.list.filter((joueur) => ids.has(String(joueur.id)));
});

function selectionnerJoueur(value) {
  // Convertir en nombre si c'est un nombre, sinon garder la valeur
  const id = !isNaN(value) && value !== '' ? Number(value) : value;
  emit('update:modelValue', id);
}
</script>

<template>
  <div>
    <h3>Sélection du joueur</h3>
    <select :value="modelValue" @change="selectionnerJoueur($event.target.value)">
      <option :value="null">-- Sélectionner un joueur --</option>
      <option v-for="joueur in joueurs" :key="joueur.id" :value="joueur.id">
        {{ joueur.nom }}
      </option>
    </select>
    
    <div v-if="modelValue">
      <p><strong>Joueur sélectionné :</strong> {{ playersStore.trouverJoueur(modelValue)?.nom }}</p>
      <p><strong>Lieu actuel :</strong> {{ playersStore.trouverJoueur(modelValue)?.lieuId || 'Non défini' }}</p>
    </div>
  </div>
</template>

<style scoped>
div {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

select {
  width: 100%;
  max-width: 400px;
}

p {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  border-radius: 4px;
}
</style>
