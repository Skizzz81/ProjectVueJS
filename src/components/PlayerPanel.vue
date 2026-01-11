<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { useCampaignsStore } from "../stores/campagnes";
import { usePlacesStore } from "../stores/lieux";
import { usePlayersStore } from "../stores/joueurs";
import { useItemsStore } from "../stores/objets";
import { useCluesStore } from "../stores/indices";

const campaignsStore = useCampaignsStore();
const playersStore = usePlayersStore();
const placesStore = usePlacesStore();
const itemsStore = useItemsStore();
const cluesStore = useCluesStore();

const selectedPlayerId = ref(null);

const activeCampaign = computed(() =>
  campaignsStore.trouverCampaign(campaignsStore.activeCampaignId)
);


const availablePlayers = computed(() => {
  const ids = activeCampaign.value?.joueurIds;
  if (!Array.isArray(ids)) return playersStore.list;
  return playersStore.list.filter((p) => ids.includes(p.id));
});

watch(
  availablePlayers,
  (list) => {
    if (!selectedPlayerId.value && list.length > 0) {
      selectedPlayerId.value = list[0].id;
    }
  },
  { immediate: true }
);

const selectedPlayer = computed(() =>
  selectedPlayerId.value ? playersStore.trouverJoueur(selectedPlayerId.value) : null
);

function nomLieu(id) {
  if (id === null || id === undefined) return "-";
  return placesStore.trouverLieu(id)?.nom ;
}

function nomsParIds(ids, trouverFn) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return ids.map((id) => trouverFn(id)?.nom );
}
</script>

<template>
  <section>
    <h2>Choisir un joueur</h2>
    <p v-if="!activeCampaign">Aucune campagne active.</p>

    <label>
      Joueur
      <select v-model="selectedPlayerId">
        <option v-for="p in availablePlayers" :key="p.id" :value="p.id">
          {{ p.nom }}
        </option>
      </select>
    </label>

    <div v-if="selectedPlayer">
      <h3>Details du joueur</h3>
      <p>Nom : {{ selectedPlayer.nom }}</p>
      <p>Etat : {{ selectedPlayer.etat }}</p>
      <p>Lieu : {{ nomLieu(selectedPlayer.lieuId) }}</p>

      <h3>Inventaire</h3>
      <p>
        Objets :
        {{ nomsParIds(selectedPlayer.inventaireObjetsIds, itemsStore.trouverObjet, "Objet").join(", ") || "-" }}
      </p>
      <p>
        Indices :
        {{ nomsParIds(selectedPlayer.inventaireIndicesIds, cluesStore.trouverIndice, "Indice").join(", ") || "-" }}
      </p>
    </div>
  </section>
</template>

<style scoped>
section {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}

label {
  display: inline-block;
  margin-bottom: 12px;
}

select {
  margin-left: 8px;
  padding: 6px 8px;
}
</style>
